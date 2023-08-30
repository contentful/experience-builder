import { renderHook } from "@testing-library/react";
import { useExperienceBuilder } from "./useExperienceBuilder";

describe('useExperienceBuilder', () => {
  it.skip('should return settings, experience and defineComponent', () => {
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
