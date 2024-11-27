import React from 'react';

interface MyServerComponentProps {
  text: string;
}

const MyServerComponent: React.FC<MyServerComponentProps> = ({ text = 'default text' }) => {
  return <div>{text}</div>;
};

export default MyServerComponent;
