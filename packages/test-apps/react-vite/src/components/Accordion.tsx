// import { combineClasses } from '@/utils/combineClasses';
import React, { useState } from 'react';
import { Accordion as F36Accordion } from '@contentful/f36-components';

type AccordionProps = {
  className: string;
  numberOfItems: number;
  titles: { [key: number]: string };
  accordionState: { [key: number]: boolean };
  singleExpandMode: boolean;
} & { [key: `childrenSlot${number}`]: React.ReactNode; [key: `title${number}`]: string };

const Accordion: React.FC<AccordionProps> = ({
  className,
  numberOfItems,
  singleExpandMode,
  ...props
}) => {
  // Check if the editor mode is enabled
  const isEditorMode = typeof window !== 'undefined' && (window as any).__EB__.isEditorMode;

  const initialState = Object.fromEntries(
    Array.from({ length: numberOfItems }, (_, i) => [i + 1, isEditorMode]),
  );

  // Initialize the accordion state (controlled component)
  const [accordionState, setAccordionState] = useState(initialState);

  const handleExpand = (index: number) => () => {
    if (singleExpandMode) {
      // Close all accordions except the one that is being expanded
      setAccordionState((state) =>
        Object.keys(state).reduce((acc, key) => ({ ...acc, [key]: +key === index }), {} as any),
      );
      return;
    }

    // If not using single expand mode, toggle the individual item state
    setAccordionState((state) => ({ ...state, [index]: true }));
  };

  const handleCollapse = (index: number) => () => {
    setAccordionState((state) => ({ ...state, [index]: false }));
  };

  // Filter out childrenSlot# and title# props
  const experiencesProps = Object.fromEntries(
    Object.entries(props).filter(([key]) => !/^(childrenSlot|title)\d+$/.test(key)),
  );

  return (
    <F36Accordion className={className} style={{ position: 'relative' }} {...experiencesProps}>
      {Array.from({ length: numberOfItems }, (_, i) => i + 1).map((i) => (
        <F36Accordion.Item
          title={props[`title${i}`]}
          isExpanded={accordionState[i]}
          onExpand={handleExpand(i)}
          onCollapse={handleCollapse(i)}>
          {props[`childrenSlot${i}`]}
        </F36Accordion.Item>
      ))}

      {/* <F36Accordion.Item
          title={title1}
          isExpanded={accordionState[1]}
          onExpand={handleExpand(1)}
          onCollapse={handleCollapse(1)}>
          {childrenSlot1}
        </F36Accordion.Item>
        <F36Accordion.Item
          title={title2}
          isExpanded={accordionState[2]}
          onExpand={handleExpand(2)}
          onCollapse={handleCollapse(2)}>
          {childrenSlot2}
        </F36Accordion.Item> */}
    </F36Accordion>
  );
};

export default Accordion;
