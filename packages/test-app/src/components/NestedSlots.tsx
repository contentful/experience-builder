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

interface NestedSlotsProps {
  childrenSlot1: React.ReactNode;
  childrenSlot2: React.ReactNode;
}

const NestedSlots: React.FC<NestedSlotsProps> = ({ childrenSlot1, childrenSlot2, ...props }) => {
  return (
    <div id="NestedSlots" style={style.container} {...props}>
      <div style={style.row}>
        <div style={style.column}>
          <h3 style={style.heading}>First Slot</h3>
          {childrenSlot1}
        </div>
        <div style={style.column}>
          <h3 style={style.heading}>Second Slot</h3>
          {childrenSlot2}
        </div>
      </div>
    </div>
  );
};

export default NestedSlots;
