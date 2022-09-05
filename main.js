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
    addMissingIdToTodo
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

function addMissingIdToTodo(todo) {
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
  const todoList = document.querySelector('#todo-list');
  todoList.innerHTML = '';

  // filter the todos by `done` property
  const filteredTodos = state.todos.filter(todoFilters[state.filter]);

  // update filter buttons
  document.querySelectorAll('.filter > button').forEach((button) => {
    if (button.getAttribute('data-filter') === state.filter) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  // replace "global" `todos` with our filtered copy
  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const content = document.createElement('div');
    const actions = document.createElement('div');
    const edit = document.createElement('button');
    const deleteButton = document.createElement('button');

    input.type = 'checkbox';
    input.checked = todo.done;
    span.classList.add('bubble');
    if (todo.category == 'other') {
      span.classList.add('other');
    } else {
      span.classList.add('work');
    }
    content.classList.add('todo-content');
    actions.classList.add('actions');
    edit.classList.add('edit');
    deleteButton.classList.add('delete');

    content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
    edit.innerHTML = 'Edit';
    deleteButton.innerHTML = 'Delete';

    label.append(input, span);
    actions.append(edit, deleteButton);
    todoItem.append(label, content, actions);

    todoList.appendChild(todoItem);

    if (todo.done) {
      todoItem.classList.add('done');
    }

    input.addEventListener('change', (e) => {
      state.todos = state.todos.map((td) =>
        td.id !== todo.id
          ? td
          : {
              ...todo,
              done: e.target.checked,
            }
      );
      // todo.done = e.target.checked;
      localStorage.setItem('todos', JSON.stringify(state.todos));

      if (todo.done) {
        todoItem.classList.add('done');
      } else {
        todoItem.classList.remove('done');
      }

      DisplayTodos();
    });

    edit.addEventListener('click', (e) => {
      const input = content.querySelector('input');
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

    deleteButton.addEventListener('click', (e) => {
      // use triple equals
      state.todos = state.todos.filter((t) => t !== todo);
      localStorage.setItem('todos', JSON.stringify(state.todos));
      DisplayTodos();
    });
  });
}
