import { Button } from 'antd';

type ButtonComponentProps = Omit<React.ComponentProps<typeof Button>, 'children'> & {
  text: string;
};

export const ButtonComponentRegistration = {
  component: (props: ButtonComponentProps) => {
    const { color, variant, text, ...rest } = props;
    return (
      <>
        <Button color={color ? color : undefined} variant={variant ? variant : undefined} {...rest}>
          {text}
        </Button>
        <Button>test</Button>
      </>
    );
  },
  definition: {
    id: 'custom-button',
    name: 'Button',
    category: 'Custom Components',
    variables: {
      text: {
        displayName: 'Text',
        type: 'Text',
        defaultValue: 'Click me',
      },
      color: {
        displayName: 'Color',
        type: 'Text',
        defaultValue: 'primary',
        group: 'style',
        validations: {
          in: [
            {
              value: '',
              displayName: 'Default',
            },
            {
              value: 'primary',
              displayName: 'Primary',
            },
            {
              value: 'danger',
              displayName: 'Danger',
            },
          ],
        },
      },
      variant: {
        displayName: 'Variant',
        type: 'Text',
        defaultValue: 'solid',
        group: 'style',
        validations: {
          in: [
            {
              value: '',
              displayName: 'None',
            },
            {
              value: 'outline',
              displayName: 'Outline',
            },
            {
              value: 'dashed',
              displayName: 'Dashed',
            },
            {
              value: 'solid',
              displayName: 'Solid',
            },
            {
              value: 'filled',
              displayName: 'Filled',
            },
            {
              value: 'text',
              displayName: 'Text',
            },
            {
              value: 'link',
              displayName: 'Link',
            },
          ],
        },
      },
    },
  },
};
