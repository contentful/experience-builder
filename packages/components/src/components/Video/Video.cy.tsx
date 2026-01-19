import React from 'react';
import { Video } from './Video';

describe('Video', () => {
  it('renders a video element with the correct src', () => {
    cy.mount(<Video src="/test.mp4" data-testid="video" />);
    cy.get('video[data-testid="video"]').should('have.attr', 'src', '/test.mp4');
  });

  it('applies the className prop', () => {
    cy.mount(<Video src="/test.mp4" className="custom-class" data-testid="video" />);
    cy.get('video[data-testid="video"]').should('have.class', 'custom-class');
  });

  it('passes additional props to the video element', () => {
    cy.mount(<Video src="/test.mp4" controls data-testid="video" />);
    cy.get('video[data-testid="video"]').should('have.attr', 'controls');
  });
});
