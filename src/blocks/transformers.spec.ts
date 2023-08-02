import { transformBackgroundImage, transformBorderStyle, transformFill } from './transformers'

describe('transformFill', () => {
  it('returns "100%" when passed "fill"', () => {
    expect(transformFill('fill')).toEqual('100%')
  })

  it('returns the same value when passed a non-"fill" string', () => {
    expect(transformFill('red')).toEqual('red')
  })
})

describe('transformBorderStyle', () => {
  it('returns an empty object when passed no value', () => {
    expect(transformBorderStyle()).toEqual({})
  })

  it('returns a border and boxSizing styles when passed a valid border string', () => {
    expect(transformBorderStyle('1px solid red')).toEqual({
      border: '1px solid red',
      boxSizing: 'content-box',
    })
  })

  it('returns box-sizing "border-box" when border placement is "inside"', () => {
    expect(transformBorderStyle('1px inside red')).toEqual({
      border: '1px solid red',
      boxSizing: 'border-box',
    })
  })

  it('returns box-sizing "content-box" when border placement is "outside"', () => {
    expect(transformBorderStyle('1px outside red')).toEqual({
      border: '1px solid red',
      boxSizing: 'content-box',
    })
  })
})

describe('transformBackgroundImage', () => {
  it(`returns empty {} upon undefined or empty (falsy) backgroundImageUrl`, () => {
    expect(transformBackgroundImage('', 'fill', 'left')).toEqual(undefined)
    expect(transformBackgroundImage(null, 'fill', 'left')).toEqual(undefined)
    expect(transformBackgroundImage(undefined, 'fill', 'left')).toEqual(undefined)
  })
  it(`Specifying 'backgroundImageScaling.tile' adds 'backgroundRepeat: repeat'`, () => {
    expect(transformBackgroundImage('https://picsum.photos/200/300', 'tile', 'left')).toEqual({
      backgroundImage: 'url(https://picsum.photos/200/300)',
      backgroundPosition: 'left',
      backgroundRepeat: 'repeat',
      backgroundSize: undefined,
    })
  })
  it(`Specifying 'backgroundImageScaling.not(tile)' adds 'backgroundRepeat: no-repeat'`, () => {
    expect(
      transformBackgroundImage(
        'https://picsum.photos/200/300',
        'fill', // not 'tile'
        'left'
      )
    ).toEqual({
      backgroundImage: 'url(https://picsum.photos/200/300)',
      backgroundPosition: 'left',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    })
  })
})
