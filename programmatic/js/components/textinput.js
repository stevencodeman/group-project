import { ρ } from '../fp.js';
import { ε, withProperties, withEvent } from '../elements.js';

/**
 *
 * @param props
 * @param {string} props.value - Initial value for text input
 * @param {string} props.placeholder - Placeholder for text input
 * @param {function} props.onChange - Callback receiving updated input text value
 * @returns HTMLInputElement
 */
export function textInput({ placeholder, value, onChange }) {
  return ρ(
    ε('input'),
    withProperties({ type: 'text', value: value ?? '', placeholder }),
    withEvent('change', (e) => {
      e.preventDefault();
      onChange?.(e.currentTarget.value);
    })
  );
}
