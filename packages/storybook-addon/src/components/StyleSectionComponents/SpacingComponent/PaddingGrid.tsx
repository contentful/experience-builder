import React, { KeyboardEventHandler } from 'react';
import { styles } from './styles';
import { css, cx } from 'emotion';
import { TextInput } from '@contentful/f36-components';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';
import { useSpacingValue } from './useSpacingValue';

type PaddingGridProps = {
  padding?: ComponentDefinitionVariable<'Text'>;
  onKeyUp: KeyboardEventHandler<HTMLInputElement>;
  standalone?: boolean;
};

export const PaddingGrid = ({ padding, onKeyUp, standalone = false }: PaddingGridProps) => {
  const {
    onBlur,
    onValueChange,
    spacingBufferValue: paddingBufferValue,
  } = useSpacingValue({
    variableName: 'cfPadding',
    variableDefinition: padding,
  });

  return (
    <div
      className={cx(
        standalone ? styles.paddingGridStandalone : styles.paddingGrid,
        css({ gridArea: 'paddingGrid' })
      )}>
      <div className={cx(styles.cellWithText, css({ gridArea: 'text' }))}>Padding</div>
      <div className={css({ gridArea: 'paddingTop' })}>
        <TextInput
          className={styles.input}
          name="cfPaddingTop"
          aria-label="paddingTop"
          size="small"
          type="text"
          value={paddingBufferValue.top}
          onChange={onValueChange}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
        />
      </div>
      <div className={css({ gridArea: 'paddingLeft' })}>
        <TextInput
          className={styles.input}
          name="cfPaddingLeft"
          aria-label="paddingLeft"
          size="small"
          type="text"
          value={paddingBufferValue.left}
          onChange={onValueChange}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
        />
      </div>
      <div className={cx(styles.centralCell, css({ gridArea: 'centralCell' }))} />
      <div className={css({ gridArea: 'paddingRight' })}>
        <TextInput
          className={styles.input}
          name="cfPaddingRight"
          aria-label="paddingRight"
          size="small"
          type="text"
          value={paddingBufferValue.right}
          onChange={onValueChange}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
        />
      </div>
      <div className={css({ gridArea: 'paddingBottom' })}>
        <TextInput
          className={styles.input}
          name="cfPaddingBottom"
          aria-label="paddingBottom"
          size="small"
          type="text"
          value={paddingBufferValue.bottom}
          onChange={onValueChange}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
        />
      </div>
    </div>
  );
};
