

export const createComponentInstance = (options, ) => {
  const { setup } = options;

  let res;
  if (typeof setup === 'function') {
    res = setup();
  }

  return {
    $el: null,
    render: options.render
  }
}