import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
// import { v4 as Uuid } from 'https://jspm.dev/uuid';

import { createTodoElement } from './components/todoItem.js';
import { createStore } from './store/index.js';

/*
    added this to store the data for the running app
    currently, just putting the `filter` value in here
*/
const initialState = {
  username: localStorage.getItem('username') || '',
  filter: null,
  todos: JSON.parse(localStorage.getItem('todos')) || [],
};

const store = createStore(stateReducer, initialState);

store.subscribe(update);

function stateReducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    default:
      return state;
    case 'UPDATE_USERNAME':
      return {
        ...state,
        username: payload,
      };
    case 'UPDATE_FILTER':
      return {
        ...state,
        filter: payload,
      };
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, payload],
      };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === payload.id ? payload : todo
        ),
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== payload.id),
      };
  }
}

function update(state) {
  localStorage.setItem('todos', JSON.stringify(state.todos));
  DisplayTodos(state);
}

// todo functions
function createTodo(content, category, done = false) {
  return {
    id: nanoid(),
    content,
    category,
    done,
    createdAt: new Date().getTime(),
  };
}

// filters
const todoFilters = {
  all: (todo) => todo,
  complete: (todo) => todo.done,
  incomplete: (todo) => !todo.done,
};

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
      store.dispatch({ type: 'UPDATE_FILTER', payload: nextFilter });
    });
  });

  nameInput.value = store.getState().username;

  nameInput.addEventListener('change', (e) => {
    const username = e.target.value;
    // state.username = username;
    store.dispatch({ type: 'UPDATE_USERNAME', payload: username });
    localStorage.setItem('username', username);
  });

  newTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const { content, category } = form.elements;

    const newTodo = createTodo(content.value, category.value);

    // Reset the form
    form.reset();

    store.dispatch({ type: 'ADD_TODO', payload: newTodo });
  });

  store.dispatch({ type: 'UPDATE_FILTER', payload: 'all' });
});

function DisplayTodos(state) {
  const filteredTodos = state.todos.filter(todoFilters[state.filter]);

  const todoList = document.querySelector('#todo-list');
  todoList.innerHTML = '';
  todoList.append(
    ...filteredTodos.map((todo) =>
      createTodoElement(
        todo,
        (updatedTodo) =>
          store.dispatch({
            type: 'UPDATE_TODO',
            payload: updatedTodo,
          }),
        (deletedTodo) =>
          store.dispatch({
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
