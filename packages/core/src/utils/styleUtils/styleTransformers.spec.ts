import {
  transformAlignment,
  transformBackgroundImage,
  transformBorderStyle,
  transformGridColumn,
} from './styleTransformers';

describe('transformGridColumn', () => {
  it('returns empty object if span is not defined', () => {
    expect(transformGridColumn()).toEqual({});
  });
  it('returns grid column span if span is defined', () => {
    expect(transformGridColumn('2')).toEqual({ gridColumn: 'span 2' });
  });
});
describe('transformBorderStyle', () => {
  it('returns empty object if value is not defined', () => {
    expect(transformBorderStyle()).toEqual({});
  });
  it('returns border style if value is defined', () => {
    expect(transformBorderStyle('1px solid red')).toEqual({ border: '1px solid red' });
  });
});
describe('transformAlignment', () => {
  it('returns alignment for column flex direction', () => {
    expect(transformAlignment('end', 'start')).toEqual({
      alignItems: 'start',
      justifyContent: 'end',
    });
  });

  it('returns alignment for row flex direction', () => {
    expect(transformAlignment('end', 'start', 'row')).toEqual({
      alignItems: 'end',
      justifyContent: 'start',
    });
  });

  it('safely justifies content if alignment is center', () => {
    expect(transformAlignment('center', 'start')).toEqual({
      alignItems: 'start',
      justifyContent: 'safe center',
    });
  });
});
describe('transformBackgroundImage', () => {
  it('returns background image properties', () => {
    expect(transformBackgroundImage('url("image.jpg")')).toEqual({
      backgroundImage: 'url(url("image.jpg"))',
      backgroundImage2: undefined,
      backgroundPosition: undefined,
      backgroundRepeat: 'no-repeat',
      backgroundSize: undefined,
    });
  });
  it('returns background image properties with default values', () => {
    expect(
      transformBackgroundImage('url("image.jpg")', {
        scaling: 'fit',
        alignment: 'bottom',
        targetSize: '500px',
      }),
    ).toEqual({
      backgroundImage: 'url(url("image.jpg"))',
      backgroundImage2: undefined,
      backgroundPosition: 'center bottom',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
    });
  });
});
