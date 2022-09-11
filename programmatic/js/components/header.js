import { ρ, pipe } from '../fp.js';
import { ε, element, withChildren } from '../elements.js';
import { textInput } from './textinput.js';

/**
 *
 * @param props
 * @param {string} props.greeting - Greeting message for user
 * @param {string} props.value - Default value for username
 * @param {function} props.onChange - Listener for changes to username field
 * @returns HTMLElement
 */
export function header({ greeting, value, onChange }) {
  return pipe(
    element('header'),
    withChildren([
      pipe(element('h2'), withChildren([greeting ?? 'Hello', ', '])),
      textInput({ placeholder: 'your name', value, onChange }),
    ])
  );
}
