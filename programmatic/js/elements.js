export const element = (tag) => document.createElement(tag);
export const ε = element;

export function withChildren(children) {
  return (el) => {
    el.append(...(Array.isArray(children) ? children : [children]));
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
      if (Array.isArray(props[prop])) {
        switch (prop) {
          case 'class':
            return el.setAttribute(prop, props[prop].join(' '));
        }
      }
      el.setAttribute(prop, props[prop]);
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
