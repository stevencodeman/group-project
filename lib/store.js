import { nanoid } from 'https://cdn.jsdelivr.net/npm/nanoid/nanoid.js';

const callbacks = [];
let state = null;

export function createStore(reducer, initialState) {
  state = initialState;

  return {
    dispatch: (action = {}) => {
      const nextState = reducer(state, action);

      if (state !== nextState) {
        state = nextState;
        callbacks.forEach((cb) => cb.func(state));
      }
    },
    getState: () => state,
    subscribe: (callback) => {
      const subscriptionId = nanoid();

      callbacks.push({
        id: subscriptionId,
        func: callback,
      });

      return function unsubscribe() {
        callbacks = callbacks.filter((cb) => cb.id !== subscriptionId);
      };
    },
  };
}
