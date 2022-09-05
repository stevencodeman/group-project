export function createTodoElement(todo, onUpdate, onDelete) {
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

    onUpdate({
      ...todo,
      done: checked,
    });
  });

  const content = createTodoContent(todo, onUpdate);

  const actions = createTodoActionButtons(
    todo,
    () => {
      // const input = content.querySelector('input');
      content.removeAttribute('readonly');
      content.focus();
    },
    onDelete
  );

  todoItem.append(checkBubble, content, actions);

  return todoItem;
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

function createTodoContent(todo, onUpdate) {
  // console.log('createTodoContent', todo.content);
  const input = document.createElement('input');
  input.classList.add('todo-content');
  input.type = 'text';
  input.value = todo.content;
  input.readOnly = true;
  input.addEventListener('blur', (e) => {
    onUpdate({
      ...todo,
      content: e.target.value,
    });
  });

  // const content = document.createElement('div');
  // content.classList.add('todo-content');
  // content.append(input);
  // return content;
  return input;
}

function createTodoActionButtons(todo, onEdit, onDelete) {
  const editButton = document.createElement('button');
  editButton.classList.add('edit');
  editButton.innerHTML = 'Edit';
  editButton.addEventListener('click', (e) => {
    onEdit();
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.innerHTML = 'Delete';
  deleteButton.addEventListener('click', (e) => {
    onDelete(todo);
  });

  const actions = document.createElement('div');
  actions.classList.add('actions');
  actions.append(editButton, deleteButton);

  return actions;
}
