import { Experience } from '../types'

export const useCheckForExperienceConfig = (experience: Experience) => {
  if (!experience.config.accessToken) {
    throw new Error(
      'When outside the editor mode you must define either a Preview or Delivery Token in the experience initialization'
    )
  }

  if (!experience.config.spaceId) {
    throw new Error(
      'When outside the editor mode you must define a SpaceId in the experience initialization'
    )
  }

  if (!experience.config.locale) {
    throw new Error(
      'When outside the editor mode you must define a locale in the experience initialization'
    )
  }

  if (!experience.config.environmentId) {
    throw new Error(
      'When outside the editor mode you must define a EnvironmentId in the experience initialization'
    )
  }
  if (!experience.config.slug) {
    throw new Error(
      'When outside the editor mode you must define a slug in the experience initialization'
    )
  }

  return experience.config
}
