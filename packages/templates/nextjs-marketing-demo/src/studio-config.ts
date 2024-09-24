import { defineComponents } from '@contentful/experiences-sdk-react';
import { ButtonComponentRegistration } from './components/ButtonComponentRegistration';
import { CustomRatingComponentRegistration } from '@/components/CustomRatingComponentRegistration';
import { FormLoginComponentRegistration } from '@/components/FormLoginComponentRegistration';

defineComponents(
  [ButtonComponentRegistration, CustomRatingComponentRegistration, FormLoginComponentRegistration],
  {
    enabledBuiltInComponents: [],
  },
);
