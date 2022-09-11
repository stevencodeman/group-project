import { ρ, pipe } from '../fp.js';
import {
  ε,
  element,
  withEvent,
  withChildren,
  blurFocusSelection,
  withProperties,
} from '../elements.js';
import { textInput } from './textinput.js';

/**
 *
 * @param props
 * @param {string} props.name
 * @param {string} props.caption
 * @param {string} props.placeholder
 * @param {string} props.value
 * @param {string} props.class - class name for input element
 * @param {boolean} props.required
 * @param {funtion} props.onChange
 * @returns
 */
export function formLabelInput({
  placeholder,
  caption,
  name,
  value,
  onChange,
  required,
  ...props // have to use rest so class can be used as a property
}) {
  return pipe(
    element('label'),
    withChildren([
      pipe(element('span'), withChildren(caption)),
      pipe(
        textInput({ placeholder, onChange, value }),
        withProperties({ class: props.class, name, required: !!required }),
        blurFocusSelection
      ),
    ])
  );
}

/**
 *
 * @param props
 * @param {string} props.name
 * @param {string} props.caption
 * @param {string} props.placeholder
 * @param {string} props.value
 * @param {string} props.class - class name for textarea element
 * @param {boolean} props.required
 * @param {funtion} props.onChange
 * @returns
 */
export function formLabelTextarea({
  placeholder,
  caption,
  name,
  value,
  onChange,
  required,
  ...props // have to use rest so class can be used as a property
}) {
  return pipe(
    element('label'),
    withChildren([
      pipe(element('span'), withChildren(caption)),
      pipe(
        element('textarea'),
        withProperties({
          class: props.class,
          placeholder,
          name,
          required: !!required,
        })
      ),
    ])
  );
}
