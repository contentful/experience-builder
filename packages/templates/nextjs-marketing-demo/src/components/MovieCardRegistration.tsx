import dynamic from 'next/dynamic';

import { ComponentRegistration } from '@contentful/experiences-sdk-react';

const MovieCard = dynamic(() => import('@/components/MovieCard/MovieCard'));

export const MovieCardRegistration: ComponentRegistration = {
  component: MovieCard,
  definition: {
    id: 'custom-movie-card',
    name: 'Movie Card',
    category: 'Custom Components',
    variables: {
      movieId: {
        displayName: 'Movie ID',
        type: 'Text',
        defaultValue: 'tt0111161', // Default movie ID (The Shawshank Redemption)
      },
    },
  },
};
