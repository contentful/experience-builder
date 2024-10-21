import React from 'react';
import { CheckOutlined, SearchOutlined, NotificationOutlined } from '@ant-design/icons';

interface IconProps {
  icon?: 'CheckOutlined' | 'SearchOutlined' | 'NotificationOutlined';
}

const Icon: React.FC<IconProps> = ({ icon }) => {
  switch (icon) {
    case 'CheckOutlined':
      return <CheckOutlined />;
    case 'NotificationOutlined':
      return <NotificationOutlined />;
    case 'SearchOutlined':
      return <SearchOutlined />;
    default:
      return null;
  }
};

export default Icon;
