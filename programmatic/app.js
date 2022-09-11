import { ρ, maybe, map } from './js/fp.js';

import {
  ε,
  withChildren,
  withEvent,
  withProperties,
  blurFocusSelection,
} from './js/elements.js';

import { header, textInput } from './js/components/index.js';

const app = document.getElementById('app');

// const header = document.createElement('header');

// header.append(saveSelectInput({ id: 'greeting', placeholder: 'your name' }));

app.innerText = '';
app.append(
  // ρ(
  //   ε('header'),
  //   withChildren([ρ(ε('h2'), withChildren('Hello,')), textInput('your name')])
  // ),
  header({
    placeholder: 'Buttholes',
  }),
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
        ε('fieldset'),
        // withProperties({ class: 'tile' }),
        withChildren([
          ρ(ε('legend'), withChildren('Category')),
          ρ(
            ε('label'),
            withProperties({ class: 'tile' }),
            withChildren([
              ρ(
                ε('span'),
                withProperties({ class: ['big', 'booty'] }),
                withChildren('Work')
              ),
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
