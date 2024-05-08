import React from 'react';
import './fullwidth.css';

interface FullWidthWrappedProps {
  text?: string;
}

export const FullWidthWrapped: React.FC<FullWidthWrappedProps> = ({ text }) => {
  return (
    <div
      style={
        {
          // width: '100%',
          // border: '1px solid black',
          // backgroundColor: 'cornflowerblue',
          // padding: '1rem',
          // textAlign: 'center',
        }
      }
      className={`full-width-div-wrapper`}>
      Awesome full width wrapped component {text}
    </div>
  );
};
