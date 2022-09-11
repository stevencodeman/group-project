import { pipe, filter } from './fp.js';

export const element = (tag) => document.createElement(tag);
export const ε = element;

export function withChildren(children) {
  return (el) => {
    const filteredChildren = (
      Array.isArray(children) ? children : [children]
    ).filter((child) => !!child && typeof child !== 'function');

    el.append(...filteredChildren);
    return el;
  };
}

export function withEvent(type, listener) {
  return (el) => {
    el.addEventListener(type, listener);
    return el;
  };
}

export function withProperties(props) {
  return (el) => {
    Object.keys(props).forEach((prop) => {
      switch (prop) {
        default: {
          el.setAttribute(prop, props[prop]);
          break;
        }
        case 'class': {
          const classes = pipe(
            Array.isArray(props[prop]) ? props[prop] : [props[prop]],
            filter(Boolean)
          );
          el.classList.add(...classes);
          break;
        }
      }
    });

    return el;
  };
}

export function blurFocusSelection(el) {
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
