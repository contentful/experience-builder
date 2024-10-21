import React from 'react';
import styles from './ColorfulBox.module.css';
import { combineClasses } from '../utils/combineClasses';

type Props = { className?: string };

const ColorfulBox: React.FC<Props> = ({ className, ...rest }) => {
  return (
    <div className={combineClasses('colorful-box', styles.container, className)} {...rest}>
      Colorful Box
    </div>
  );
};

export default ColorfulBox;
