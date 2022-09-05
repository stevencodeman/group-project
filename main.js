import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
// import { v4 as Uuid } from 'https://jspm.dev/uuid';

import { createTodoElement } from './components/todoItem.js';

/*
    added this to store the data for the running app
    currently, just putting the `filter` value in here
*/
let state = {
  username: localStorage.getItem('username') || '',
  filter: null,
  todos: (JSON.parse(localStorage.getItem('todos')) || []).map(
    addMissingTodoId
  ),
};

function updateState(action) {
  const { type, payload } = action;
  let nextState = state;
  switch (type) {
    case 'UPDATE_TODO':
      nextState = {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === payload.id ? payload : todo
        ),
      };
      break;
    case 'DELETE_TODO':
      console.log('deleting todo:', payload.id);
      nextState = {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== payload.id),
      };
      break;
  }

  if (nextState !== state) {
    state = nextState;
    localStorage.setItem('todos', JSON.stringify(state.todos));
    DisplayTodos(state.todos);
  }
}

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

// probably don't need this function, but i was using it for transitioning
// between todo id formats (none -> uuid -> nanoid)
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
  DisplayTodos(state.todos);
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

    DisplayTodos(state.todos);
  });

  updateFilter('all');
  DisplayTodos(state.todos);
});

function DisplayTodos(todos) {
  // filter the todos by `done` property
  const filteredTodos = todos.filter(todoFilters[state.filter]);

  const todoList = document.querySelector('#todo-list');
  todoList.innerHTML = '';
  todoList.append(
    ...filteredTodos.map((todo) =>
      createTodoElement(
        todo,
        (updatedTodo) =>
          updateState({
            type: 'UPDATE_TODO',
            payload: updatedTodo,
          }),
        (deletedTodo) =>
          updateState({
            type: 'DELETE_TODO',
            payload: deletedTodo,
          })
      )
    )
  );

  // update filter buttons
  document.querySelectorAll('.filter > button').forEach((button) => {
    if (button.getAttribute('data-filter') === state.filter) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}
