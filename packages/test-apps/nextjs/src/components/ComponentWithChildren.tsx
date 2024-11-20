import React from 'react';

interface ComponentWithChildrenProps {
  children: React.ReactNode;
  heading: string;
}

const ComponentWithChildren: React.FC<ComponentWithChildrenProps> = async ({
  children,
  heading,
  ...rest
}) => {
  const { fact } = await fetch('https://catfact.ninja/fact').then((res) => res.json());

  return (
    <div
      {...rest}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: 50,
        justifyContent: 'center',
      }}>
      <div
        style={{
          width: '100%',
          gap: 75,
          display: 'flex',
          alignItems: 'center',
          maxWidth: 1200,
          flexDirection: 'row',
        }}>
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: 0,
            }}>
            {heading}
          </h1>
          <strong>Cat Fact from a React Server Component:</strong>
          <p>{fact}</p>
          {children}
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: 'lightblue',
            minHeight: 300,
          }}>
          <img src="" alt="" />
        </div>
      </div>
    </div>
  );
};

export default ComponentWithChildren;
