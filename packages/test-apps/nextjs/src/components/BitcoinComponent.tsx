import React from 'react';

interface BitcoinComponentProps {
  metadata: Record<string, any>;
}

const BitcoinComponent: React.FC<BitcoinComponentProps> = ({ metadata, ...rest }) => {
  const { EUR, USD } = metadata.bitcoinData.bpi;

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
