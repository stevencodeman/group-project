// αβγδεζηθικλμνξοπρσςτυφχψω

export function pipe(val, ...funs) {
  return funs.reduce((acc, fun) => fun(acc), val);
}

export const ρ = pipe;

function Nothing() {
  map: () => Nothing;
}

function Just(something) {
  return {
    map: (fun) => Just(fun(something)),
  };
}

export function maybe(anything) {
  return typeof anything === 'undefined' || anything === null
    ? Nothing()
    : Just(anything);
}

export function map(fun) {
  return (mappable) => {
    if (typeof mappable.map !== 'function') {
      throw new Error('Mappable should implement the map interface');
    }

    return mappable.map(fun);
  };
}

export function filter(predicate) {
  return (filterable) => {
    if (typeof filterable.filter !== 'function') {
      throw new Error('Filterable should implement the filter interface');
    }

    return filterable.filter(predicate);
  };
}
