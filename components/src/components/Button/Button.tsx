import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    React.PropsWithChildren {
  targetUrl?: string;
  onNavigate?: (url: string) => void;
  label?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  label,
  onClick,
  onNavigate,
  ...props
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onNavigate && props.targetUrl) {
      onNavigate(props.targetUrl);
    }
    onClick && onClick(event);
  };
  return (
    <button onClick={handleClick} {...props}>
      {children || label}
    </button>
  );
};

export default Button;
