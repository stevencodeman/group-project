import { ρ, pipe } from '../fp.js';
import {
  ε,
  element,
  withEvent,
  withChildren,
  blurFocusSelection,
  withProperties,
} from '../elements.js';

export function formRadioSet({
  caption,
  name,
  buttonClass,
  buttons,
  ...props // have to use rest so class can be used as a property
}) {
  if (!Array.isArray(buttons)) {
    throw new Error(
      `fromRadioSet buttons property must be an array of button configurations: { value: string; caption: string; checked?: boolean; class?: string }`
    );
  }

  return pipe(
    element('fieldset'),
    withProperties({ class: props.class }),
    withChildren([
      pipe(element('legend'), withChildren(caption)),
      ...buttons.map((button) =>
        pipe(
          element('label'),
          withProperties({
            class: button.class,
          }),
          withChildren([
            pipe(element('span'), withChildren(button.caption)),
            pipe(
              element('input'),
              withProperties({
                type: 'radio',
                value: button.value,
                name: name,
                checked: button.checked,
              })
            ),
          ])
        )
      ),
    ])
  );
}
