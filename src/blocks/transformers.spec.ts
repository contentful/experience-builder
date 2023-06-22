import { transformBorderStyle, transformFill } from './transformers'

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
