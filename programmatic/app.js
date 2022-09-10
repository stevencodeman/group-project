import { pipe as ρ, maybe, map } from './js/fp.js';

const ε = (tag) => document.createElement(tag);

const app = document.getElementById('app');

const header = document.createElement('header');

header.append(saveSelectInput({ id: 'greeting', placeholder: 'your name' }));

app.innerText = '';
app.append(
  ρ(
    ε('header'),
    withChildren([ρ(ε('h2'), withChildren('Hello,')), textInput('your name')])
  ),
  ρ(
    ε('form'),
    withEvent('submit', (e) =>
      ρ(
        e.preventDefault(),
        () => new FormData(e.currentTarget),
        Object.fromEntries,
        console.log
      )
    ),
    withChildren([
      ρ(
        ε('label'),
        withChildren([
          ρ(ε('span'), withChildren("What's on your todo list?")),
          ρ(
            textInput('What do? Take nap?'),
            withProperties({ name: 'title', required: true }),
            blurFocusSelection
          ),
        ])
      ),
      ρ(
        ε('label'),
        withChildren([
          ρ(ε('span'), withChildren('Description')),
          ρ(
            ε('textarea'),
            withProperties({
              placeholder: 'How you fin to do this?',
              name: 'description',
              class: 'description',
              required: true,
              // rows: 10,
            })
          ),
        ])
      ),
      ρ(
        ε('div'),
        withProperties({ class: 'row' }),
        withChildren([
          ρ(
            ε('label'),
            withProperties({ class: 'tile' }),
            withChildren([
              ρ(ε('span'), withChildren('Work')),
              ρ(
                ε('input'),
                withProperties({
                  type: 'radio',
                  value: 'work',
                  name: 'category',
                  checked: true,
                })
              ),
            ])
          ),
          ρ(
            ε('label'),
            withProperties({ class: 'tile' }),
            withChildren([
              ρ(ε('span'), withChildren('Fun')),
              ρ(
                ε('input'),
                withProperties({
                  type: 'radio',
                  value: 'fun',
                  name: 'category',
                })
              ),
            ])
          ),
          ρ(
            ε('label'),
            withProperties({ class: 'tile' }),
            withChildren([
              ρ(ε('span'), withChildren('Other')),
              ρ(
                ε('input'),
                withProperties({
                  type: 'radio',
                  value: 'other',
                  name: 'category',
                })
              ),
            ])
          ),
        ])
      ),
      ρ(
        ε('button'),
        withProperties({ type: 'submit' }),
        withChildren('Add todo')
      ),
    ])
  )
);

function textInput(placeholder) {
  return ρ(ε('input'), withProperties({ type: 'text', placeholder }));
}

// function createElement(tag, properties, ...children) {
//   const el = document.createElement(tag);

//   if (properties) {
//     Object.keys(properties).forEach((key) => {
//       el[key] = properties[key];
//     });
//   }

//   el.append(...(Array.isArray(children) ? children : [children]));

//   return el;
// }

function withEvent(type, listener) {
  return (el) => {
    el.addEventListener(type, listener);
    return el;
  };
}

function withProperties(props) {
  return (el) => {
    Object.keys(props).forEach((prop) => {
      el.setAttribute(prop, props[prop]);
    });

    return el;
  };
}

function withChildren(children) {
  return (el) => {
    el.append(...(Array.isArray(children) ? children : [children]));
    return el;
  };
}

function blurFocusSelection(el) {
  // early return the element if it's not an input
  if (el.tagName.toLowerCase() !== 'input') return el;

  // gonna store the selection state here
  const state = { start: 0, end: 0 };

  el.addEventListener('blur', ({ currentTarget: input }) => {
    state.start = input.selectionStart;
    state.end = input.selectionEnd;

    input.selectionStart = 0;
    input.selectionEnd = 0;
  });

  el.addEventListener('focus', ({ currentTarget: input }) => {
    input.selectionStart = state.start;
    input.selectionEnd = state.end;
  });

  return el;
}

function saveSelectInput({ id, placeholder }) {
  let start = 0;
  let end = 0;

  const input = document.createElement('input');
  input.type = 'text';
  input.id = id;
  input.placeholder = placeholder;

  input.addEventListener('blur', (e) => {
    start = e.currentTarget.selectionStart;
    end = e.currentTarget.selectionEnd;
    e.currentTarget.selectionStart = 0;
    e.currentTarget.selectionEnd = 0;
    console.log(start, end);
  });

  input.addEventListener('focus', (e) => {
    e.currentTarget.selectionStart = start;
    e.currentTarget.selectionEnd = end;
    console.log(start, end);
  });

  return input;
}

// {/* <section class="greeting">
// <h2 class="title">
//   Hello, <input type="text" id="name" placeholder="Name here" />
// </h2>
// </section> */}
