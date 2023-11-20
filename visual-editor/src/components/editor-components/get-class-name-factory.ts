import classnames from 'classnames';

export const getGlobalClassName = (rootClass: any, options: any) => {
  if (typeof options === 'string') {
    return `${rootClass}-${options}`;
  } else {
    const mappedOptions: any = {};
    for (const option in options) {
      mappedOptions[`${rootClass}--${option}`] = options[option];
    }

    return classnames({
      [rootClass]: true,
      ...mappedOptions,
    });
  }
};

const getClassNameFactory =
  (rootClass: any, styles: any, { baseClass = '' } = {}) =>
  (options = {}) => {
    let descendant: any = false;
    let modifiers: any = false;

    if (typeof options === 'string') {
      descendant = options;
    } else if (typeof options === 'object') {
      modifiers = options;
    }

    if (descendant) {
      return baseClass + styles[`${rootClass}-${descendant}`] || '';
    } else if (modifiers) {
      const prefixedModifiers: any = {};

      for (const modifier in modifiers) {
        prefixedModifiers[styles[`${rootClass}--${modifier}`]] = modifiers[modifier];
      }

      const c = styles[rootClass];

      return (
        baseClass +
        classnames({
          [c]: !!c, // only apply the class if it exists
          ...prefixedModifiers,
        })
      );
    } else {
      return baseClass + styles[rootClass] || '';
    }
  };

export default getClassNameFactory;
