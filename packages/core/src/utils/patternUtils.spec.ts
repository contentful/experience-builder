import {
  ComponentPropertyValue,
  ExperienceComponentSettings,
} from '@contentful/experiences-validators';
import { deserializePatternVariables } from './patternUtils';

const nodeVariables = {
  cfBackgroundColor: {
    type: 'ComponentValue',
    key: 'cfBackgroundColor_random_key_test_1',
  },
  cfGap: {
    type: 'ComponentValue',
    key: 'cfGap_random_key_test_1',
  },
  cfBorder: {
    type: 'DesignValue',
    valuesByBreakpoint: {
      desktop: '27px',
    },
  },
} as Record<string, ComponentPropertyValue>;

const componentInstanceProps = {
  cfBackgroundColor_random_key_test_1: {
    type: 'DesignValue',
    valuesByBreakpoint: {
      desktop: 'red',
    },
  },
} as Record<string, ComponentPropertyValue>;

const patternVariableDefinitions = {
  cfBackgroundColor_random_key_test_1: {
    type: 'Text',
    description: 'The background color of the section',
    group: 'style',
    displayName: 'Background color',
    defaultValue: {
      type: 'DesignValue',
      valuesByBreakpoint: {
        desktop: 'blue',
      },
    },
  },
  cfGap_random_key_test_1: {
    type: 'Text',
    description: 'The gap between the elements',
    group: 'style',
    displayName: 'Gap',
    defaultValue: {
      type: 'DesignValue',
      valuesByBreakpoint: {
        desktop: '27px',
      },
    },
  },
} as ExperienceComponentSettings['variableDefinitions'];

describe('deserializePatternVariables', () => {
  it('should return the correct values', () => {
    const result = deserializePatternVariables({
      nodeVariables,
      componentInstanceProps,
      componentInstanceUnboundValues: {},
      componentInstanceDataSource: {},
      assemblyVariableDefinitions: patternVariableDefinitions,
    });

    expect(result).toEqual({
      childNodeVariable: {
        cfBackgroundColor: {
          type: 'DesignValue',
          valuesByBreakpoint: {
            desktop: 'red', // got the value from componentInstanceProps
          },
        },
        cfGap: {
          type: 'DesignValue',
          valuesByBreakpoint: {
            desktop: '27px', // copied over default value
          },
        },
        cfBorder: {
          type: 'DesignValue',
          valuesByBreakpoint: {
            desktop: '27px',
          },
        },
      },
      dataSource: {},
      unboundValues: {},
    });
  });
});
