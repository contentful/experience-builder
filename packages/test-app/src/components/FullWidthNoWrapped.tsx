import React from 'react';

interface FullWidthNoWrappedProps {
  className?: string;
  text?: string;
}

export const FullWidthNoWrapped: React.FC<FullWidthNoWrappedProps> = ({
  className,
  text,
  ...props
}) => {
  return (
    <div
      style={{
        width: '100%',
        border: '1px solid black',
        backgroundColor: 'cornflowerblue',
        padding: '1rem',
        textAlign: 'center',
      }}
      className={`${className} full-width-div`}
      {...props}>
      Awesome full width <b>no</b> wrapped component {text}
    </div>
  );
};
