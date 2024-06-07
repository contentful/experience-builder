import { Rect, getTooltipPositions } from '@components/Draggable/canvasToolsUtils';
import classNames from 'classnames';
import React, { useMemo, useRef } from 'react';
import styles from './styles.module.css';

interface Props {
  coordinates: Rect | null;
  id: string;
  label: string;
  isContainer: boolean;
  isAssemblyBlock: boolean;
}

const Tooltip: React.FC<Props> = ({ coordinates, id, label, isAssemblyBlock, isContainer }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);

  const previewSize = '100%'; // This should be based on breakpoints and added to usememo dependency array

  const tooltipStyles = useMemo(() => {
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();

    const draggableRect = document
      .querySelector(`[data-ctfl-draggable-id="${id}"]`)
      ?.getBoundingClientRect();

    const newTooltipStyles = getTooltipPositions({
      previewSize,
      tooltipRect,
      coordinates: draggableRect,
    });
    return newTooltipStyles;

    // Ignore eslint because we intentionally want to trigger this whenever a user clicks on a container/component which is tracked by these coordinates of the component being clicked being changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates, id, tooltipRef.current]);

  return (
    <div
      ref={tooltipRef}
      style={tooltipStyles}
      className={classNames(styles.overlay, {
        [styles.overlayContainer]: isContainer,
        [styles.overlayAssembly]: isAssemblyBlock,
      })}>
      {label}
    </div>
  );
};

export default Tooltip;
