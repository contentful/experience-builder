jest.mock('./core/constants', () => ({
  VITE_SDK_VERSION: '0.0.0-test',
}))

describe('test', () => {
  test('should be ok', () => {
    expect(true).toBe(true)
  })
})
