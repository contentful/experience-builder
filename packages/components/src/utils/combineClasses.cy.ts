import { combineClasses } from './combineClasses';

describe('combineClasses', () => {
  it('should combine classes', () => {
    const classes = combineClasses('foo', 'bar', 'baz');
    expect(classes).equals('foo bar baz');
  });

  it('should ignore undefined classes', () => {
    const classes = combineClasses('foo', undefined, 'bar', undefined, 'baz');
    expect(classes).equals('foo bar baz');
  });

  it('should ignore empty strings', () => {
    const classes = combineClasses('foo', '', 'bar', '', 'baz');
    expect(classes).equals('foo bar baz');
  });

  it('should ignore null', () => {
    const classes = combineClasses('foo', null, 'bar', null, 'baz');
    expect(classes).equals('foo bar baz');
  });

  it('a single value should not have an empty string as the end', () => {
    const classes = combineClasses('foo');
    expect(classes).equals('foo');
  });

  it('when combined with a string that contains multiple classes, should combine them properly', () => {
    const classes = combineClasses('foo', 'bar baz ');
    expect(classes).equals('foo bar baz');
  });
});
