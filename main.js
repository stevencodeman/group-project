import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';
// import { v4 as Uuid } from 'https://jspm.dev/uuid';

import { createTodoElement } from './components/todoItem.js';
import { createStore } from './lib/store.js';

const initialState = JSON.parse(localStorage.getItem('todos-app-state')) || {
  username: '',
  filter: 'all',
  todos: [],
};

const store = createStore(stateReducer, initialState);

initApp(store.getState(), store.dispatch);

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
  localStorage.setItem('todos-app-state', JSON.stringify(state));
  DisplayTodos(state);
}

function initApp(state, dispatch) {
  const nameInput = document.getElementById('name');
  // nameInput.value = state.username;
  nameInput.addEventListener('change', (e) => {
    const username = e.target.value;
    dispatch({ type: 'UPDATE_USERNAME', payload: username });
  });

  const newTodoForm = document.getElementById('new-todo-form');
  newTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const { content, category } = form.elements;

    const newTodo = {
      id: nanoid(),
      content,
      category,
      done,
      createdAt: new Date().getTime(),
    };

    // Reset the form
    form.reset();

    dispatch({ type: 'ADD_TODO', payload: newTodo });
  });

  const filterButtons = document.querySelectorAll('.filter > button');

  filterButtons.forEach((button) => {
    const nextFilter = button.getAttribute('data-filter');
    button.addEventListener('click', (e) => {
      e.preventDefault();
      store.dispatch({ type: 'UPDATE_FILTER', payload: nextFilter });
    });
  });

  DisplayTodos(state);
}

function DisplayTodos(state) {
  const nameInput = document.getElementById('name');
  nameInput.value = state.username;

  const filteredTodos = state.todos.filter((todo) => {
    switch (state.filter) {
      default:
        return true;
      case 'complete':
        return todo.done;
      case 'incomplete':
        return !todo.done;
    }
  });

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
