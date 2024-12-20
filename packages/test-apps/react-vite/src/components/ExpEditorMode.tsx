import React from 'react';

interface ExpEditorModeProps {
  isInExpEditorMode?: boolean;
  myValue: string;
  className?: string;
}

const ExpEditorMode: React.FC<ExpEditorModeProps> = (props) => {
  const { isInExpEditorMode, myValue, className } = props;
  console.log('eee', { props });
  return (
    <section className={className}>
      <div>isInExpEditorMode {isInExpEditorMode ? 'true' : 'false'}</div>
      <div>myValue {myValue}</div>
    </section>
  );
};

export default ExpEditorMode;
