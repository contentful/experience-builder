import { defineComponents, defineDesignTokens } from '@contentful/experiences-sdk-react';
import { ButtonComponentRegistration } from './components/ButtonComponentRegistration';
import { RatingStarsComponentRegistration } from '@/components/RatingStarsComponentRegistration';
import { CardComponentRegistration } from './components/CardComponentRegistration';
import { MovieCardRegistration } from './components/MovieCardRegistration';

defineComponents([
  ButtonComponentRegistration,
  RatingStarsComponentRegistration,
  CardComponentRegistration,
  MovieCardRegistration,
]);

const textColorTokens = {
  Primary: '#1890ff',
  Heading: '#262626',
  HeadingInverse: '#ffffff',
  Paragraph: '#262626',
  ParagraphLight: '#878787',
  ParagraphInverse: '#ffffff',
};

const fontSizeTokens = {
  XS: '14px',
  S: '16px',
  M: '20px',
  L: '24px',
  XL: '32px',
  '2XL': '48px',
  '3XL': '64px',
  '4XL': '84px',
};

const lineHeightTokens = {
  Paragraph: '150%',
  Heading: '125%',
};

defineDesignTokens({
  textColor: textColorTokens,
  fontSize: fontSizeTokens,
  lineHeight: lineHeightTokens,
  color: {
    Neutral: '#fafafa',
    Warm: '#faf4f3',
    Red: '#fff1f0',
    Orange: '#fff7e6',
    Gold: '#fffbe6',
    Lime: '#fcffe6',
    Cyan: '#e6fffb',
    Blue: '#e6f7ff',
    Purple: '#f9f0ff',
    Magenta: '#fff0f6',
  },
  spacing: {
    XXS: '8px',
    XS: '12px',
    S: '16px',
    M: '24px',
    L: '32px',
    XL: '40px',
    '2XL': '48px',
    '3XL': '64px',
    '4XL': '128px',
  },
  sizing: {
    Layout: '960px',
    'Content Block': '480px',
  },
  border: {
    Card: {
      width: '1px',
      style: 'solid',
      color: '#fafafa',
    },
    'Card Bold': {
      width: '2px',
      style: 'solid',
      color: '#f0f0f0',
    },
  },
  borderRadius: {
    M: '8px',
  },
  text: {
    'Hero H1': {
      fontSize: fontSizeTokens['3XL'],
      fontWeight: '600',
      lineHeight: lineHeightTokens.Heading,
      color: textColorTokens.ParagraphInverse,
    },
    'Hero Paragraph': {
      fontSize: fontSizeTokens.S,
      fontWeight: '500',
      lineHeight: lineHeightTokens.Paragraph,
      color: textColorTokens.ParagraphInverse,
    },
    H1: {
      fontSize: fontSizeTokens['3XL'],
      fontWeight: '600',
      lineHeight: lineHeightTokens.Heading,
      color: textColorTokens.Heading,
    },
    H2: {
      fontSize: fontSizeTokens.XL,
      fontWeight: '600',
      lineHeight: lineHeightTokens.Heading,
      color: textColorTokens.Heading,
    },
    H3: {
      fontSize: fontSizeTokens.L,
      fontWeight: '600',
      lineHeight: lineHeightTokens.Heading,
      color: textColorTokens.Heading,
    },
    H4: {
      fontSize: fontSizeTokens.M,
      fontWeight: '600',
      lineHeight: lineHeightTokens.Heading,
      color: textColorTokens.Heading,
    },
    H5: {
      fontSize: fontSizeTokens.S,
      fontWeight: '600',
      lineHeight: lineHeightTokens.Heading,
      color: textColorTokens.Heading,
    },
    Paragraph: {
      fontSize: fontSizeTokens.S,
      fontWeight: '500',
      lineHeight: lineHeightTokens.Paragraph,
      color: textColorTokens.Paragraph,
    },
    'Paragraph Large': {
      fontSize: fontSizeTokens.M,
      fontWeight: '500',
      lineHeight: lineHeightTokens.Paragraph,
      color: textColorTokens.Paragraph,
    },
  },
});
