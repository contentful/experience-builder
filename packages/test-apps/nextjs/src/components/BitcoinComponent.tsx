import React, { useEffect } from 'react';
import { updateStoreValue /* useExperienceData */ } from '@contentful/experiences-sdk-react';
interface BitcoinComponentProps {
  bitcoinData: any;
}

const BitcoinComponent: React.FC<BitcoinComponentProps> = ({ bitcoinData, ...rest }) => {
  const { EUR, USD } = bitcoinData.bpi;

  // const count = useExperienceData('count');

  useEffect(() => {
    const interval = setInterval(() => {
      updateStoreValue('count', Math.random());
    }, 1500);

    return () => {
      clearInterval(interval);
    };
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
      <h1>Today&apos;s Bitcoin Price</h1>
      <ul>
        <li>
          <strong style={{ marginRight: 8 }}>EUR:</strong>
          &euro;{EUR.rate}
        </li>
        <li>
          <strong style={{ marginRight: 8 }}>USD:</strong>
          &#36;{USD.rate}
        </li>
      </ul>
    </div>
  );
};

export default BitcoinComponent;
