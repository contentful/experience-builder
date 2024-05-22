import React, { CSSProperties } from 'react';

const style: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  column: {
    flex: 1,
    textAlign: 'center',
  },
  heading: {
    marginTop: 0,
    fontFamily: 'sans-serif',
  },
};

interface DualDropzoneProps {
  zone1: React.ReactNode;
  zone2: React.ReactNode;
}

const DualDropzones: React.FC<DualDropzoneProps> = ({ zone1, zone2, ...props }) => {
  return (
    <div id="DualDropzones" style={style.container} {...props}>
      <div style={style.row}>
        <div style={style.column}>
          <h3 style={style.heading}>Drop zone 1</h3>
          {zone1}
        </div>
        <div style={style.column}>
          <h3 style={style.heading}>Drop zone 2</h3>
          {zone2}
        </div>
      </div>
    </div>
  );
};

export default DualDropzones;
