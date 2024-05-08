import React from 'react';
import './fullwidth.css';

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
      id="div-no-wrapper"
      style={
        {
          // width: '100px',
          // border: '1px solid black',
          // backgroundColor: 'cornflowerblue',
          // padding: '1rem',
          // margin: '4px',
          // textAlign: 'center',
        }
      }
      className={`${className} full-width-div-no-wrapper`}
      {...props}>
      Awesome full width <b>no</b> wrapped component {text}
    </div>
  );
};
