import { ρ, maybe, map } from './js/fp.js';

import {
  ε,
  withChildren,
  withEvent,
  withProperties,
  blurFocusSelection,
} from './js/elements.js';

import {
  header,
  textInput,
  formLabelInput,
  formLabelTextarea,
  formRadioSet,
} from './js/components/index.js';

const app = document.getElementById('app');

app.innerText = '';
app.append(
  header({ placeholder: 'your name' }),
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
      formLabelInput({
        caption: "What's on your todo list?",
        placeholder: 'What do? Take nap',
        name: 'title',
        required: true,
      }),
      formLabelTextarea({
        caption: 'Description',
        placeholder: 'How you fin to do this?',
        name: 'description',
        required: true,
        class: 'description',
      }),
      formRadioSet({
        caption: 'Category',
        name: 'category',
        // class: 'tile',
        // buttonClass: 'tile',
        buttons: [
          {
            caption: 'Work',
            value: 'work',
            checked: true,
            class: 'tile',
          },
          {
            caption: 'Fun',
            value: 'fun',
            class: 'tile',
          },
        ],
      }),
      // ρ(
      //   ε('fieldset'),
      //   // withProperties({ class: 'tile' }),
      //   withChildren([
      //     ρ(ε('legend'), withChildren('Category')),
      //     ρ(
      //       ε('label'),
      //       withProperties({ class: 'tile' }),
      //       withChildren([
      //         ρ(
      //           ε('span'),
      //           withProperties({ class: ['big', 'booty'] }),
      //           withChildren('Work')
      //         ),
      //         ρ(
      //           ε('input'),
      //           withProperties({
      //             type: 'radio',
      //             value: 'work',
      //             name: 'category',
      //             checked: true,
      //           })
      //         ),
      //       ])
      //     ),
      //     ρ(
      //       ε('label'),
      //       withProperties({ class: 'tile' }),
      //       withChildren([
      //         ρ(ε('span'), withChildren('Fun')),
      //         ρ(
      //           ε('input'),
      //           withProperties({
      //             type: 'radio',
      //             value: 'fun',
      //             name: 'category',
      //           })
      //         ),
      //       ])
      //     ),
      //     ρ(
      //       ε('label'),
      //       withProperties({ class: 'tile' }),
      //       withChildren([
      //         ρ(ε('span'), withChildren('Other')),
      //         ρ(
      //           ε('input'),
      //           withProperties({
      //             type: 'radio',
      //             value: 'other',
      //             name: 'category',
      //           })
      //         ),
      //       ])
      //     ),
      //   ])
      // ),
      ρ(
        ε('button'),
        withProperties({ type: 'submit' }),
        withChildren('Add todo')
      ),
    ])
  )
);
