type Props = {
  buttonTitle: string;
  className: string;
};

export default function Button(props: Props) {
  const { buttonTitle, className, ...rest } = props;
  // console.log('rest', rest)

  return (
    <div className={className} {...rest}>
      <div style={{ backgroundColor: 'blue' }}>{buttonTitle}</div>
    </div>
  );
}

export const buttonDefinition = {
  id: 'ryuns-button',
  name: 'ryuns-button',
  category: 'buttons',
  // thumbnailUrl: string | undefined;
  variables: {
    buttonTitle: {
      type: 'Text',
      displayName: 'Button Title',
      defaultValue: 'Click Me',
    },
  },
  builtInStyles: [
    'cfHorizontalAlignment',
    'cfVerticalAlignment',
    'cfMargin',
    'cfPadding',
    'cfBackgroundImageAlignment',
    'cfBackgroundColor',
    'cfWidth',
    'cfHeight',
    'cfMaxWidth',
    'cfFlexDirection',
    'cfFlexWrap',
    'cfBorder',
    'cfGap',
    'cfBackgroundImageUrl',
    'cfBackgroundImageScaling',
    'cfBackgroundImageAlignment',
  ],
  // children?: boolean | undefined,
};
