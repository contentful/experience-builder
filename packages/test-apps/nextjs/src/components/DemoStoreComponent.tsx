import React, { useEffect } from 'react';
import { watchStoreValue } from '@contentful/experiences-sdk-react';

interface DemoStoreComponentProps {
  initialCount: number;
}
const DemoStoreComponent: React.FC<DemoStoreComponentProps> = ({ initialCount, ...rest }) => {
  const [count, setCount] = React.useState(initialCount);

  useEffect(() => {
    watchStoreValue('count', (newValue) => {
      setCount(newValue as number);
    });
  }, []);

  return (
    <div
      {...rest}
      style={{
        width: '90%',
        border: '1px solid black',
        padding: 50,
        margin: 50,
      }}>
      <h1>Today&apos;s Count</h1>
      <ul>{count}</ul>
    </div>
  );
};

export default DemoStoreComponent;
