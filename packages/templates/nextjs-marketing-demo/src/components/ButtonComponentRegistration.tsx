import { Button } from 'antd';
import Icon from './Icon';

type ButtonComponentProps = Omit<React.ComponentProps<typeof Button>, 'children' | 'icon'> & {
  text: string;
  icon?: React.ComponentProps<typeof Icon>['icon'];
};

export const ButtonComponentRegistration = {
  component: (props: ButtonComponentProps) => {
    const { color, icon, variant, text, ...rest } = props;
    return (
      <Button
        color={color?.length ? color : undefined}
        variant={variant?.length ? variant : undefined}
        icon={icon && <Icon icon={icon} />}
        {...rest}>
        {text}
      </Button>
    );
  },
  definition: {
    id: 'custom-button',
    name: 'Button',
    category: 'Custom Components',
    variables: {
      href: {
        displayName: 'Link',
        type: 'Text',
      },
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
      icon: {
        displayName: 'Icon',
        type: 'Text',
        group: 'style',
        defaultValue: '',
        validations: {
          in: [
            {
              value: '',
              displayName: 'None',
            },
            {
              value: 'CheckOutlined',
              displayName: 'Check',
            },
            {
              value: 'NotificationOutlined',
              displayName: 'Notification',
            },
            {
              value: 'SearchOutlined',
              displayName: 'Search',
            },
          ],
        },
      },
    },
  },
};
