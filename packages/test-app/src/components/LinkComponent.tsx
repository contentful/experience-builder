import React from 'react';

export function LinkComponent(props) {
  console.log({ props });
  return <a href={props.href}>{props.text}</a>;
}
