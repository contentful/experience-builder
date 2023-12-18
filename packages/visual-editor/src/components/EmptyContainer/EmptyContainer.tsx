import React from 'react';
import styles from './EmptyContainer.module.css';
import classNames from 'classnames';

export interface EmptyContainerProps {
  isFirst?: boolean;
  isDragging?: boolean;
  isHoveringOnRoot?: boolean;
}

export const EmptyEditorContainer = ({ isDragging }: EmptyContainerProps) => {
  return (
    <div
      className={classNames(styles.container, {
        [styles.highlight]: isDragging,
      })}
      data-type="empty-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="37" height="36" fill="none">
        <rect
          width="11.676"
          height="11.676"
          x="18.512"
          y=".153"
          fill="#CFD9E0"
          rx="1.621"
          transform="rotate(45 18.512 .153)"
        />
        <rect
          width="11.676"
          height="11.676"
          x="9.254"
          y="9.139"
          fill="#CFD9E0"
          rx="1.621"
          transform="rotate(45 9.254 9.139)"
        />
        <rect
          width="11.676"
          height="11.676"
          x="18.011"
          y="18.625"
          fill="#CFD9E0"
          rx="1.621"
          transform="rotate(45 18.01 18.625)"
        />
        <rect
          width="11.676"
          height="11.676"
          x="30.557"
          y="10.131"
          fill="#CFD9E0"
          rx="1.621"
          transform="rotate(60 30.557 10.13)"
        />
        <path
          fill="#fff"
          stroke="#fff"
          stroke-width=".243"
          d="M31.113 17.038a.463.463 0 0 0-.683-.517l-1.763 1.032-1.033-1.763a.464.464 0 0 0-.8.469l1.034 1.763-1.763 1.033a.463.463 0 1 0 .468.8l1.763-1.033 1.033 1.763a.463.463 0 1 0 .8-.469l-1.033-1.763 1.763-1.033a.463.463 0 0 0 .214-.282Z"
        />
      </svg>

      <span className={styles.icon}>Add components to begin</span>
    </div>
  );
};
