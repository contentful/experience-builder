import { Typography } from 'antd';

// type ButtonComponentProps = React.ComponentProps<typeof Typography> & {
//   text: string;
//   code?: boolean;
// };

export const TextComponentRegistration = {
  component: Typography.Text,
  // component: (props: ButtonComponentProps) => {
  //   const { text, ...rest } = props;
  //   return <Typography.Text {...rest}>{text}</Typography.Text>;
  // },
  definition: {
    id: 'custom-text',
    name: 'Text',
    category: 'Custom Components',
    builtInStyles: ['cfMargin', 'cfPadding', 'cfWidth', 'cfHeight', 'cfMaxWidth'],
    variables: {
      children: {
        displayName: 'Text',
        type: 'Text',
        defaultValue: 'Add your text here...',
      },
      // code: {
      //   displayName: 'Code style',
      //   group: 'style',
      //   type: 'Boolean',
      //   defaultValue: false,
      // },
      // strong: {
      //   displayName: 'Bold style',
      //   group: 'style',
      //   type: 'Boolean',
      //   defaultValue: false,
      // },
      // italic: {
      //   displayName: 'Italic style',
      //   group: 'style',
      //   type: 'Boolean',
      //   defaultValue: false,
      // },
      // keyboard: {
      //   displayName: 'Keyboard style',
      //   group: 'style',
      //   type: 'Boolean',
      //   defaultValue: false,
      // },
      // mark: {
      //   displayName: 'Mark style',
      //   group: 'style',
      //   type: 'Boolean',
      //   defaultValue: false,
      // },
    },
  },
  // options: {
  //   wrapComponent: false,
  // },
};
