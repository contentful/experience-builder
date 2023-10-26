import { renderHook } from '@testing-library/react'
import { useExperienceBuilder } from './useExperienceBuilder'
import type { ContentfulClientApi } from 'contentful'

const clientMock = {
  getEntries: jest.fn(),
  getAssets: jest.fn(),
} as unknown as ContentfulClientApi<undefined>

const experienceTypeId = 'books'

jest.mock('../core/constants', () => ({
  SDK_VERSION: '0.0.0-test',
  __esModule: true,
}))

describe('useExperienceBuilder', () => {
  it('should return experience and defineComponents and set delivery mode by default', () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId,
        client: clientMock,
      },
    })

    const output = res.result.current

    expect(output.experience).toEqual({
      client: clientMock,
      experienceTypeId,
      mode: 'delivery',
    })

    expect(output.defineComponents).toBeDefined()
  })
})
