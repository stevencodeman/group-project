import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
import { v4 as Uuid } from 'https://jspm.dev/uuid';

/*
    added this to store the data for the running app
    currently, just putting the `filter` value in here
*/
const state = {
  username: localStorage.getItem('username') || '',
  filter: null,
  todos: (JSON.parse(localStorage.getItem('todos')) || []).map(
    addMissingTodoId
  ),
};

// todo functions
function createTodo(content, category, done = false) {
  return {
    id: Uuid(),
    content,
    category,
    done,
    createdAt: new Date().getTime(),
  };
}

function addMissingTodoId(todo) {
  return {
    ...todo,
    id: !!todo.id?.match(/^[A-Za-z0-9_]{21,21}$/) ? todo.id : nanoid(),
  };
}

// filters
const todoFilters = {
  all: (todo) => todo,
  complete: (todo) => todo.done,
  incomplete: (todo) => !todo.done,
};

function updateFilter(newFilter) {
  if (state.filter === newFilter) {
    // early return so we don't do an update when nothing has changed
    return;
  }

  if (!todoFilters[newFilter]) {
    throw new Error(
      `Oops, you forgot to add a filter handler for ${newFilter}`
    );
  }

  state.filter = newFilter;
  // call `displayTodos` to update the view on page
  DisplayTodos();
}

// element factories
function createCheckbox(todo, onCheck) {
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = todo.done;

  input.addEventListener('change', (e) => {
    onCheck(e.target.checked);
  });

  const span = document.createElement('span');
  span.classList.add('bubble');
  span.classList.add(todo.category === 'other' ? 'other' : 'work');

  const label = document.createElement('label');
  label.append(input, span);

  return label;
}

function createTodoContent(todo) {
  const content = document.createElement('div');
  content.classList.add('todo-content');
  content.innerHTML = `<input type="text" value="${todo.content}" readonly />`;

  return content;
}

function createTodoActionButtons(todo) {
  const editButton = document.createElement('button');
  editButton.classList.add('edit');
  editButton.innerHTML = 'Edit';
  editButton.addEventListener('click', (e) => {
    // const input = content.querySelector('input');
    const input = document.querySelector(`#${todo.id} > .todo-content > input`);
    input.removeAttribute('readonly');
    input.focus();
    input.addEventListener('blur', (e) => {
      input.setAttribute('readonly', true);
      // todo.content = e.target.value;
      state.todos = state.todos.map((td) =>
        td.id === todo.id
          ? {
              ...todo,
              content: e.target.value,
            }
          : td
      );

      localStorage.setItem('todos', JSON.stringify(state.todos));
      DisplayTodos();
    });
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.innerHTML = 'Delete';
  deleteButton.addEventListener('click', (e) => {
    // use triple equals
    state.todos = state.todos.filter((t) => t !== todo);
    localStorage.setItem('todos', JSON.stringify(state.todos));
    DisplayTodos();
  });

  const actions = document.createElement('div');
  actions.classList.add('actions');
  actions.append(editButton, deleteButton);

  return actions;
}

function createTodoElement(todo) {
  // returns a fully configured todo list item element

  const todoItem = document.createElement('div');
  todoItem.setAttribute('id', todo.id);
  todoItem.classList.add(
    ...['todo-item', todo.done ? 'done' : null].filter(Boolean)
  );

  const checkBubble = createCheckbox(todo, (checked) => {
    if (checked) {
      todoItem.classList.add('done');
    } else {
      todoItem.classList.remove('done');
    }

    state.todos = state.todos.map((td) =>
      td.id !== todo.id
        ? td
        : {
            ...todo,
            done: checked,
          }
    );
    // todo.done = e.target.checked;
    localStorage.setItem('todos', JSON.stringify(state.todos));

    DisplayTodos();
  });

  const content = createTodoContent(todo);

  const actions = createTodoActionButtons(todo);

  todoItem.append(checkBubble, content, actions);

  return todoItem;
}

window.addEventListener('load', () => {
  const nameInput = document.querySelector('#name');
  const newTodoForm = document.querySelector('#new-todo-form');

  // filter toggle buttons
  const filterButtons = document.querySelectorAll('.filter > button');

  // on click for the filter buttons
  filterButtons.forEach((button) => {
    const nextFilter = button.getAttribute('data-filter');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      updateFilter(nextFilter);
    });
  });

  nameInput.value = state.username;

  nameInput.addEventListener('change', (e) => {
    const username = e.target.value;
    state.username = username;
    localStorage.setItem('username', username);
  });

  newTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const { content, category } = form.elements;

    const newTodo = createTodo(content.value, category.value);

    // todos.push(todo);
    state.todos = [...state.todos, newTodo];

    localStorage.setItem('todos', JSON.stringify(state.todos));

    // Reset the form
    form.reset();

    DisplayTodos();
  });

  updateFilter('all');
  DisplayTodos();
});

function DisplayTodos() {
  // filter the todos by `done` property
  const filteredTodos = state.todos.filter(todoFilters[state.filter]);

  const todoList = document.querySelector('#todo-list');
  todoList.innerHTML = '';
  todoList.append(...filteredTodos.map((todo) => createTodoElement(todo)));

  // update filter buttons
  document.querySelectorAll('.filter > button').forEach((button) => {
    if (button.getAttribute('data-filter') === state.filter) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}
