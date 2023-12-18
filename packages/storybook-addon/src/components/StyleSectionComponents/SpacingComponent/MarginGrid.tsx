import { css, cx } from 'emotion';
import React, { KeyboardEventHandler } from 'react';
import { styles } from './styles';
import { TextInput } from '@contentful/f36-components';
import { useSpacingValue } from './useSpacingValue';
import { ComponentDefinitionVariable } from '@contentful/experience-builder';

type MarginGridProps = {
  margin: ComponentDefinitionVariable<'Text'>;
  onKeyUp: KeyboardEventHandler<HTMLInputElement>;
};

export const MarginGrid = ({
  margin,
  onKeyUp,
  children,
}: React.PropsWithChildren<MarginGridProps>) => {
  const {
    onBlur,
    onValueChange,
    spacingBufferValue: marginBufferValue,
  } = useSpacingValue({
    variableName: 'cfMargin',
    variableDefinition: margin,
  });

  return (
    <div className={children ? styles.marginGrid : styles.marginGridStandalone}>
      <div className={styles.cellWithText}>Margin</div>
      <div className={css({ gridArea: 'marginTop' })}>
        <TextInput
          className={styles.input}
          aria-label="marginTop"
          name="cfMarginTop"
          size="small"
          type="text"
          value={marginBufferValue.top}
          onChange={onValueChange}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
        />
      </div>
      <div className={css({ gridArea: 'marginLeft' })}>
        <TextInput
          className={styles.input}
          name="cfMarginLeft"
          aria-label="marginLeft"
          size="small"
          type="text"
          value={marginBufferValue.left}
          onChange={onValueChange}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
        />
      </div>
      <div className={css({ gridArea: 'marginRight' })}>
        <TextInput
          className={styles.input}
          name="cfMarginRight"
          aria-label="marginRight"
          size="small"
          type="text"
          value={marginBufferValue.right}
          onChange={onValueChange}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
        />
      </div>
      <div className={css({ gridArea: 'marginBottom' })}>
        <TextInput
          className={styles.input}
          name="cfMarginBottom"
          aria-label="marginBottom"
          size="small"
          type="text"
          value={marginBufferValue.bottom}
          onChange={onValueChange}
          onBlur={onBlur}
          onKeyUp={onKeyUp}
        />
      </div>
      {!children && <div className={cx(styles.centralCell, css({ gridArea: 'centralCell' }))} />}
      {children}
    </div>
  );
};
