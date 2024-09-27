import { defineComponents } from '@contentful/experiences-sdk-react';
import { ButtonComponentRegistration } from './components/ButtonComponentRegistration';
import { RatingStarsComponentRegistration } from '@/components/RatingStarsComponentRegistration';
import { CardComponentRegistration } from './components/CardComponentRegistration';

defineComponents([
  ButtonComponentRegistration,
  RatingStarsComponentRegistration,
  CardComponentRegistration,
]);
