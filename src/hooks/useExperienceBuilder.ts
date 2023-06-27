import { useCompositionContext } from '../connection/CompositionContext'

// Do we still need this? I guess we still want to expose the experience
export const useExperienceBuilder = () => {
  const { experience, locale } = useCompositionContext()

  return {
    experience,
    locale,
  }
}
