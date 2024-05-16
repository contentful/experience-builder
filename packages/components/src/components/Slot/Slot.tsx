import React, { CSSProperties } from 'react';
import { ExperienceTreeNode, RenderDropzoneFunction } from '@contentful/experiences-core/types';
import './Slot.css';
import { CONTENTFUL_COMPONENTS } from '@contentful/experiences-core/constants';
import { combineClasses } from '@/utils/combineClasses';

interface SlotProps {
  slotId: string;
  cfSlotProps?: {
    editorMode: boolean;
    node: ExperienceTreeNode;
    renderDropzone: RenderDropzoneFunction;
  };
  children?: React.ReactNode;
  style?: CSSProperties;
}

export const Slot: React.FC<SlotProps> = ({ slotId, cfSlotProps, children, style }) => {
  // console.log('[DEBUG] Slot', { slotId, cfSlotProps, children, style });

  if (cfSlotProps?.editorMode) {
    const content = cfSlotProps.node.children.filter((node) => node.data.slotId === slotId);
    const className = content.length
      ? CONTENTFUL_COMPONENTS.slot.id
      : combineClasses(CONTENTFUL_COMPONENTS.slot.id, 'contentful-slot--empty');

    const renderDropzoneComponent = () => {
      return cfSlotProps.renderDropzone(cfSlotProps.node, {
        'data-test-id': CONTENTFUL_COMPONENTS.slot.id,
        className,
        wrapperProps: {
          style,
        },
        slotId,
        zoneId: [cfSlotProps.node.data.id, slotId].join('|'),
        // NOTE: Changing the entire WrapperComponent breaks DND (we would need to set all of the DND props here, which seems ugly)
        // WrapperComponent: () => (
        //   <div data-test-id={CONTENTFUL_COMPONENTS.slot.id} className={CONTENTFUL_COMPONENTS.slot.id} style={style}>
        //     {children}
        //   </div>
        // ),
      });
    };

    return content.length ? (
      renderDropzoneComponent()
    ) : (
      <div className="cf-slot-wrapper" data-ctfl-draggable-id={cfSlotProps.node.data.id}>
        <div className="cf-slot-label">{CONTENTFUL_COMPONENTS.slot.name}</div>
        {renderDropzoneComponent()}
      </div>
    );
  }

  return (
    <div
      data-test-id={CONTENTFUL_COMPONENTS.slot.id}
      className={CONTENTFUL_COMPONENTS.slot.id}
      style={style}>
      {children}
    </div>
  );
};
