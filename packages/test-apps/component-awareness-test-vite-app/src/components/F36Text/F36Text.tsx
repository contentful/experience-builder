import React from 'react';
import { Text, Heading } from '@contentful/f36-components';
import tokens from '@contentful/f36-tokens';

interface F36TextProps {
  content: string;
  element: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'a';
  size?: 'fontSizeS' | 'fontSizeM' | 'fontSizeL' | 'fontSizeXl';
  color?:
    | 'colorBlack'
    | 'gray500'
    | 'colorPrimary'
    | 'colorPositive'
    | 'colorNegative'
    | 'colorWarning';
  fontWeight?: 'fontWeightNormal' | 'fontWeightMedium' | 'fontWeightDemiBold';
  marginBottom?: 'none' | 'spacingXs' | 'spacingS' | 'spacingM' | 'spacingL' | 'spacingXl';
  // New: render as a tag / pill
  asTag?: boolean;
  tagTone?: 'default' | 'primary' | 'positive' | 'negative' | 'warning' | 'muted';
  // Anchor support
  href?: string;
  openInNewTab?: boolean;
  relNoFollow?: boolean;
}

export const F36Text: React.FC<F36TextProps> = ({
  content,
  element = 'p',
  asTag = false,
  tagTone = 'default',
  href,
  openInNewTab = false,
  relNoFollow = false,
  ...rest
}) => {
  if (asTag) {
    // Simple tone style mapping leveraging F36 tokens
    const toneStyles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: tokens.gray200,
        color: tokens.gray700,
      },
      primary: {
        backgroundColor: tokens.blue100,
        color: tokens.blue700,
      },
      positive: {
        backgroundColor: tokens.green300,
        color: tokens.colorPositive,
      },
      negative: {
        backgroundColor: tokens.red300,
        color: tokens.colorNegative,
      },
      warning: {
        backgroundColor: tokens.orange300,
        color: tokens.colorWarning,
      },
      muted: {
        backgroundColor: tokens.gray100,
        color: tokens.gray500,
      },
    };

    return (
      <span
        // Tag ignores heading semantics and always renders inline-block span
        style={{
          display: 'inline-block',
          padding: '0 8px',
          lineHeight: '20px',
          fontSize: '12px',
          fontWeight: 500,
          borderRadius: tokens.borderRadiusSmall,
          verticalAlign: 'middle',
          ...toneStyles[tagTone] || toneStyles.default,
        }}
      >
        {content}
      </span>
    );
  }

  // If it's a heading element, use Heading component
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(element)) {
    return (
      <Heading as={element as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'} {...rest}>
        {content}
      </Heading>
    );
  }

  // Anchor rendering (either explicitly selected or href provided)
  if (element === 'a' || href) {
    const relParts: string[] = [];
    if (openInNewTab) relParts.push('noopener', 'noreferrer');
    if (relNoFollow) relParts.push('nofollow');
    const rel = relParts.length ? relParts.join(' ') : undefined;
  // Extract style if passed so we can merge without using any
  const { style, ...other } = rest as { style?: React.CSSProperties } & Record<string, unknown>;
    return (
      <Text
        as={'a'}
    {...other}
        href={href}
        target={openInNewTab ? '_blank' : undefined}
        rel={rel}
    style={{ textDecoration: 'underline', cursor: 'pointer', ...style }}
      >
        {content}
      </Text>
    );
  }

  // For other elements, use Text component
  return (
    <Text as={element as 'p' | 'span'} {...rest}>
      {content}
    </Text>
  );
};

export default F36Text;
