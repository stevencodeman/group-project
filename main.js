let todos = JSON.parse(localStorage.getItem('todos')) || [];

/*
    added this to store the data for the running app
    currently, just putting the `filter` value in here
*/
const state = {
  username: localStorage.getItem('username') || '',
  filter: null,
};

// filters
const filters = {
  all: (todo) => todo,
  complete: (todo) => todo.done,
  incomplete: (todo) => !todo.done,
};

const filterToButtonText = (filter) =>
  filterButtonText[filter] ?? 'YOU FUCKED UP';

function updateFilter(newFilter) {
  if (state.filter === newFilter) {
    // early return so we don't do an update when nothing has changed
    return;
  }

  if (!filters[newFilter]) {
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
    // console.log('nextFilter', nextFilter);
    button.addEventListener('click', (e) => {
      e.preventDefault();
      updateFilter(nextFilter);
    });
  });

  // const username = localStorage.getItem('username') || '';

  nameInput.value = state.username;

  nameInput.addEventListener('change', (e) => {
    const username = e.target.value;
    state.username = username;
    localStorage.setItem('username', username);
  });

  newTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const todo = {
      content: e.target.elements.content.value,
      category: e.target.elements.category.value,
      done: false,
      createdAt: new Date().getTime(),
    };

    todos.push(todo);

    localStorage.setItem('todos', JSON.stringify(todos));

    // Reset the form
    e.target.reset();

    DisplayTodos();
  });

  updateFilter('all');
  DisplayTodos();
});

function DisplayTodos() {
  const todoList = document.querySelector('#todo-list');
  todoList.innerHTML = '';

  // filter the todos by `done` property
  const filteredTodos = todos.filter(filters[state.filter]);

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
      todo.done = e.target.checked;
      localStorage.setItem('todos', JSON.stringify(todos));

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
        todo.content = e.target.value;
        localStorage.setItem('todos', JSON.stringify(todos));
        DisplayTodos();
      });
    });

    deleteButton.addEventListener('click', (e) => {
      // use triple equals
      todos = todos.filter((t) => t !== todo);
      localStorage.setItem('todos', JSON.stringify(todos));
      DisplayTodos();
    });
  });
}
