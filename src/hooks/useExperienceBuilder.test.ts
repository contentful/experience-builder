import { renderHook } from "@testing-library/react";
import { useExperienceBuilder } from "./useExperienceBuilder";

jest.mock('../core/constants', () => ({
  SDK_VERSION: '0.0.0-test',
  __esModule: true
}))

describe('useExperienceBuilder', () => {
  it('should return settings, experience and defineComponent', () => {
    const res = renderHook((props) => useExperienceBuilder(props), {
      initialProps: {
        experienceTypeId: 'books',
        accessToken: 'CFFakeToken',
        defaultLocale: 'en-US',
        environmentId: 'master',
        spaceId: 'space-id',
        slug: 'hello-world',
      }
    })

    const output = res.result.current;

    expect(output.defineComponent).toBeDefined();
  })
});
