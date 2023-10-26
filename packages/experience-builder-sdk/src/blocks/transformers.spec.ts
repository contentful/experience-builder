import { StyleProps } from '../types';
import { transformBackgroundImage, transformBorderStyle, transformFill } from './transformers';

type CompositeAlignment = StyleProps['cfBackgroundImageAlignment'];

describe('transformFill', () => {
  it('returns "100%" when passed "fill"', () => {
    expect(transformFill('fill')).toEqual('100%');
  });

  it('returns the same value when passed a non-"fill" string', () => {
    expect(transformFill('red')).toEqual('red');
  });
});

describe('transformBorderStyle', () => {
  it('returns an empty object when passed no value', () => {
    expect(transformBorderStyle()).toEqual({});
  });

  it('returns a border and boxSizing styles when passed a valid border string', () => {
    expect(transformBorderStyle('1px solid red')).toEqual({
      border: '1px solid red',
      boxSizing: 'content-box',
    });
  });

  it('returns box-sizing "border-box" when border placement is "inside"', () => {
    expect(transformBorderStyle('1px inside red')).toEqual({
      border: '1px solid red',
      boxSizing: 'border-box',
    });
  });

  it('returns box-sizing "content-box" when border placement is "outside"', () => {
    expect(transformBorderStyle('1px outside red')).toEqual({
      border: '1px solid red',
      boxSizing: 'content-box',
    });
  });
});

describe('transformBackgroundImage', () => {
  it(`returns undefined upon supplying undefined or empty (falsy) backgroundImageUrl`, () => {
    expect(transformBackgroundImage('', 'fill', 'left top')).toEqual(undefined);
    expect(transformBackgroundImage(null, 'fill', 'left top')).toEqual(undefined);
    expect(transformBackgroundImage(undefined, 'fill', 'left top')).toEqual(undefined);
  });

  it(`Specifying 'backgroundImageScaling.tile' adds 'backgroundRepeat: repeat'`, () => {
    expect(
      transformBackgroundImage('https://picsum.photos/200/300', 'tile', 'left bottom')
    ).toEqual({
      backgroundImage: 'url(https://picsum.photos/200/300)',
      backgroundPosition: 'left bottom',
      backgroundRepeat: 'repeat',
      backgroundSize: undefined,
    });
  });

  it(`Specifying 'backgroundImageScaling.not(tile)' adds 'backgroundRepeat: no-repeat'`, () => {
    expect(
      transformBackgroundImage(
        'https://picsum.photos/200/300',
        'fill', // not 'tile'
        'left bottom'
      )
    ).toEqual({
      backgroundImage: 'url(https://picsum.photos/200/300)',
      backgroundPosition: 'left bottom',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    });
  });
  (
    [
      'left bottom',
      'right bottom',
      'center bottom',
      'left top',
      'left bottom',
      'left center',
    ] as Array<CompositeAlignment>
  ).forEach((compositeAlignment) => {
    it(`Specifying 'backgroundImageAlignment(${compositeAlignment}) goes to CSS property backgroundPosition`, () => {
      expect(
        transformBackgroundImage(
          'https://picsum.photos/200/300',
          'fill', // not 'tile'
          compositeAlignment
        )
      ).toEqual({
        backgroundImage: 'url(https://picsum.photos/200/300)',
        backgroundPosition: compositeAlignment,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      });
    });
  });
  (
    [
      ['left', 'left center'],
      ['right', 'right center'],
      ['center', 'center center'],
      ['top', 'center top'],
      ['bottom', 'center bottom'],
    ] as Array<[CompositeAlignment, string]>
  ).forEach(([nonCompositeAlignment, expectedCSS]) => {
    it(`Specifying non-composite value of 'cfBackgroundImageAlignment(${nonCompositeAlignment}) is expanded to composite CSS value backgroundPosition: '${expectedCSS}'`, () => {
      expect(
        transformBackgroundImage(
          'https://picsum.photos/200/300',
          'fill', // not 'tile'
          nonCompositeAlignment
        )
      ).toEqual({
        backgroundImage: 'url(https://picsum.photos/200/300)',
        backgroundPosition: expectedCSS,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      });
    });
  });
});
