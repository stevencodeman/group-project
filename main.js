let todos = JSON.parse(localStorage.getItem('todos')) || [];

const state = {
  filter: 'all',
};

window.addEventListener('load', () => {
  const nameInput = document.querySelector('#name');
  const newTodoForm = document.querySelector('#new-todo-form');
  const filterCompleteButton = document.getElementById('filterComplete');

  filterCompleteButton.addEventListener('click', (e) => {
    e.preventDefault();

    switch (state.filter) {
      default: {
        throw new Error(`You forgot filter state for "${state.filter}`);
      }
      case 'all': {
        console.log('filteer "all" -> "complete"');
        state.filter = 'complete';
        filterCompleteButton.innerText = 'Show Incomplete';
        console.log('all', `state.filter: ${state.filter}`);
        break;
      }
      case 'complete': {
        console.log('filter "complete" -> "incomplete"');
        state.filter = 'incomplete';
        filterCompleteButton.innerText = 'Show All';
        break;
      }
      case 'incomplete': {
        console.log('filter "incomplete" -> "all"');
        state.filter = 'all';
        filterCompleteButton.innerText = 'Show Complete';
        break;
      }
    }

    displayTodos();
  });

  const username = localStorage.getItem('username') || '';

  nameInput.value = username;

  nameInput.addEventListener('change', (e) => {
    localStorage.setItem('username', e.target.value);
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

    displayTodos();
  });

  displayTodos();
});

function displayTodos() {
  const todoList = document.querySelector('#todo-list');
  todoList.innerHTML = '';

  const filteredTodos = todos.filter((todo) => {
    switch (state.filter) {
      default:
        throw new Error(`You forgot to handle filter "${state.filter}"`);
      case 'all':
        return true;
      case 'complete':
        return todo.done;
      case 'incomplete':
        return !todo.done;
    }
  });

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

    label.appendChild(input);
    label.appendChild(span);
    actions.appendChild(edit);
    actions.appendChild(deleteButton);
    todoItem.appendChild(label);
    todoItem.appendChild(content);
    todoItem.appendChild(actions);

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

      displayTodos();
    });

    edit.addEventListener('click', (e) => {
      const input = content.querySelector('input');
      input.removeAttribute('readonly');
      input.focus();
      input.addEventListener('blur', (e) => {
        input.setAttribute('readonly', true);
        todo.content = e.target.value;
        localStorage.setItem('todos', JSON.stringify(todos));
        displayTodos();
      });
    });

    deleteButton.addEventListener('click', (e) => {
      todos = todos.filter((t) => t != todo);
      localStorage.setItem('todos', JSON.stringify(todos));
      displayTodos();
    });
  });
}
