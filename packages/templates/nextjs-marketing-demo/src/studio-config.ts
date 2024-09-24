import { defineComponents } from '@contentful/experiences-sdk-react';
import { ButtonComponentRegistration } from './components/ButtonComponentRegistration';
import { CustomRatingComponentRegistration } from '@/components/CustomRatingComponentRegistration';

defineComponents([ButtonComponentRegistration, CustomRatingComponentRegistration], {
  enabledBuiltInComponents: [],
});
