import React from 'react';

export function LinkComponent(props) {
  return <a href={props.href}>{props.text}</a>;
}
