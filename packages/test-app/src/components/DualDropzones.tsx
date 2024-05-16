import React, { CSSProperties } from 'react';
import { Slot } from '@contentful/experiences-components-react';

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

const DualDropzones: React.FC = ({ cfSlotProps, ...props }: any) => {
  return (
    <div id="DualDropzones" style={style.container} {...props}>
      <div className="DualDropzones-row" style={style.row}>
        <div className="DualDropzones-column" style={style.column}>
          <h3 style={style.heading}>Zone 1</h3>
          {/* {zone1} */}

          <Slot
            slotId="zone1"
            style={{ backgroundColor: 'rgba(0,255,0,0.25)' }}
            cfSlotProps={cfSlotProps}
          />
        </div>
        <div className="DualDropzones-column" style={style.column}>
          <h3 style={style.heading}>Zone 2</h3>
          {/* {zone2} */}
          <Slot
            slotId="zone2"
            style={{ backgroundColor: 'rgba(0,255,255,0.25)' }}
            cfSlotProps={cfSlotProps}
          />
        </div>
      </div>
    </div>
  );
};

export default DualDropzones;
