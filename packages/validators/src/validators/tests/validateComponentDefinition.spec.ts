import { validateComponentDefinition } from '../validateComponentDefinition';
import { componentDefinition } from '../../test/__fixtures__/componentDefinition';
import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentDefinitionType } from '../../schemas/componentDefinition';

describe('validateComponentDefinition', () => {
  it('should validate the component definition successfully', () => {
    const result = validateComponentDefinition(componentDefinition);

    expect(result.success).toBe(true);
  });

  it('should return an error if component definition id is longer than max length', () => {
    const updatedComponentDefinition = {
      ...componentDefinition,
      id: componentDefinition.id.repeat(10),
    };

    const result = validateComponentDefinition(updatedComponentDefinition);

    expect(result.success).toBe(false);
    expect(result.errors?.[0].name).toBe('regex');
    expect(result.errors?.[0].path).toEqual(['id']);
    expect(result.errors?.[0].details).toBe('Property needs to match: /^[a-zA-Z0-9-_]{1,32}$/');
  });

  it('should return an error if component variable key is longer than max length', () => {
    const updatedComponentDefinition = {
      ...componentDefinition,
      variables: {
        ['testVar'.repeat(10)]: {
          type: 'Boolean',
        },
      },
    };

    const result = validateComponentDefinition(updatedComponentDefinition);

    expect(result.success).toBe(false);
    expect(result.errors?.[0].name).toBe('regex');
    expect(result.errors?.[0].path).toEqual(['variables', 'testVar'.repeat(10)]);
    expect(result.errors?.[0].details).toBe('Property needs to match: /^[a-zA-Z0-9-_]{1,32}$/');
  });

  it('should return an error if component variable type is not in the valid list of types supported', () => {
    const updatedComponentDefinition = {
      ...componentDefinition,
      variables: {
        testVar: {
          type: 'InvalidType',
        },
      },
    };

    const result = validateComponentDefinition(updatedComponentDefinition);

    expect(result.success).toBe(false);
    expect(result.errors?.[0].name).toBe('in');
    expect(result.errors?.[0].path).toEqual(['variables', 'testVar', 'type']);
    expect(result.errors?.[0].expected).toEqual([
      'Text',
      'RichText',
      'Number',
      'Date',
      'Boolean',
      'Location',
      'Media',
      'Object',
      'Hyperlink',
      'Array',
      'Link',
    ]);
  });

  describe('type of defaultValue is determined by type property', () => {
    let updatedComponentDefinition: Partial<ComponentDefinitionType> = {};
    beforeEach(() => {
      updatedComponentDefinition = {
        ...componentDefinition,
        variables: {
          testVar: {
            type: 'Text',
            defaultValue: undefined,
          },
        },
      };
    });

    describe('when type is "Array"', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'Array';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is defined', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 'test';

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue is not supported for "Array" type for variables.testVar',
        );
      });
    });

    describe('when type is "Text"', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'Text';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should pass when defaultValue is a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 'test';
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is not a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 123;

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a string when type is "Text" for variables.testVar, got number instead',
        );
      });

      it('should return an error if defaultValue is a falsey value thats not a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = false;

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a string when type is "Text" for variables.testVar, got boolean instead',
        );
      });
    });

    describe('when type is Number', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'Number';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should pass when defaultValue is a number', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 123;
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is not a number', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 'test';

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a number when type is "Number" for variables.testVar, got string instead',
        );
      });

      it('should return an error if defaultValue is a falsey value not a number', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = false;

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a number when type is "Number" for variables.testVar, got boolean instead',
        );
      });
    });

    describe('when type is Boolean', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'Boolean';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should pass when defaultValue is a boolean', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = true;
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is not a boolean', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 'test';

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a boolean when type is "Boolean" for variables.testVar, got string instead',
        );
      });

      it('should return an error if defaultValue is a falsey value not a boolean', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 0;

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a boolean when type is "Boolean" for variables.testVar, got number instead',
        );
      });
    });

    describe('when type is Hyperlink', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'Hyperlink';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should pass when defaultValue is a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 'https://example.com';
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is not a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 123;

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a string when type is "Hyperlink" for variables.testVar, got number instead',
        );
      });

      it('should return an error if defaultValue is a falsey value thats not a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = false;

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a string when type is "Hyperlink" for variables.testVar, got boolean instead',
        );
      });
    });

    describe('when type is Link', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'Link';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is defined', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 'test';

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue is not supported for "Link" type for variables.testVar',
        );
      });
    });

    describe('when type is RichText', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'RichText';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should pass when defaultValue is an object', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = {
          nodeType: 'document',
          data: {},
          content: [
            {
              nodeType: 'paragraph',
              data: {},
              content: [{ nodeType: 'text', value: 'abc', marks: [], data: {} }],
            },
          ],
        };
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is not an object', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 'test';

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be an object when type is "RichText" for variables.testVar, got string instead',
        );
      });
    });

    describe('when type is Object', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'Object';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should pass when defaultValue is an object', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = { test: 'test' };
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is not an object', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 'test';

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be an object when type is "Object" for variables.testVar, got string instead',
        );
      });
    });

    describe('when type is Date', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'Date';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should pass when defaultValue is a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = '2022-01-01';
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is not a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 123;

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a string when type is "Date" for variables.testVar, got number instead',
        );
      });

      it('should return an error if defaultValue is a falsey value thats not a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = false;

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a string when type is "Date" for variables.testVar, got boolean instead',
        );
      });
    });

    describe('when type is Media', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'Media';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should pass when defaultValue is a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 'https://mycdn.com/image.jpg';
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is not a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 123;

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a string when type is "Media" for variables.testVar, got number instead',
        );
      });

      it('should return an error if defaultValue is a falsey value thats not a string', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = false;

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be a string when type is "Media" for variables.testVar, got boolean instead',
        );
      });
    });

    describe('when type is Location', () => {
      beforeEach(() => {
        updatedComponentDefinition.variables!.testVar.type = 'Location';
      });

      it('should pass when defaultValue is undefined', () => {
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should pass when defaultValue is an object', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = { lat: 0, lon: 0 };
        const result = validateComponentDefinition(updatedComponentDefinition);
        expect(result.success).toBe(true);
      });

      it('should return an error if defaultValue is not an object', () => {
        updatedComponentDefinition.variables!.testVar.defaultValue = 'test';

        const result = validateComponentDefinition(updatedComponentDefinition);

        expect(result.success).toBe(false);
        expect(result.errors?.[0].details).toBe(
          'defaultValue must be an object when type is "Location" for variables.testVar, got string instead',
        );
      });
    });
  });
});
