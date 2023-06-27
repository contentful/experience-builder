import { Experience } from '../types'

export const useValidatedExperienceConfig = (experience?: Experience | null) => {
  if (!experience) {
    return
  }
  if (!experience.config.token) {
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
}
