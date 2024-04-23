import { CF_STYLE_ATTRIBUTES } from '@contentful/experiences-core/constants';
import {
  indexByBreakpoint,
  isCfStyleAttribute,
  maybePopulateDesignTokenValue,
  resolveBackgroundImageBinding,
} from './ssrStyles';
import { builtInStyles } from '@contentful/experiences-core';
import { ComponentPropertyValue } from '@contentful/experiences-core/types';
import { Asset, Entry } from 'contentful';

describe('isCfStyleAttribute', () => {
  it('should return true for each value from CF_STYLE_ATTRIBUTES', () => {
    for (const attribute of CF_STYLE_ATTRIBUTES) {
      expect(isCfStyleAttribute(attribute)).toBe(true);
    }

    expect(isCfStyleAttribute('invalid')).toBe(false);
  });
});

describe('maybePopulateDesignTokenValue', () => {
  it('should ignore CF_STYLE_ATTRIBUTES values of variables', () => {
    const mapOfDesignVariableKeys = {
      'color.black': '#000000',
    };

    expect(maybePopulateDesignTokenValue('numberOfRows', 1, mapOfDesignVariableKeys)).toBe(1);

    expect(maybePopulateDesignTokenValue('numberOfRows', undefined, mapOfDesignVariableKeys)).toBe(
      undefined,
    );

    expect(maybePopulateDesignTokenValue('numberOfRows', null, mapOfDesignVariableKeys)).toBe(null);

    expect(
      maybePopulateDesignTokenValue('cfRandomName', '${color.black}', mapOfDesignVariableKeys),
    ).toBe('${color.black}');
  });

  it('should not change variables which do not have a design token value', () => {
    const res = maybePopulateDesignTokenValue('cfBackgroundColor', 'yellow', {
      'color.black': '#000000',
    });

    expect(res).toBe('yellow');
  });

  it('should use builtInStyles.defaultValue for variables with design token pattern where no design tokens match the pattern', () => {
    const res = maybePopulateDesignTokenValue('cfBackgroundColor', '${color.yellow}', {
      'color.black': '#000000',
    });

    expect(res).toBe(builtInStyles.cfBackgroundColor?.defaultValue);
  });

  it('should repalce design token variables with their values', () => {
    const res = maybePopulateDesignTokenValue('cfBackgroundColor', '${color.black}', {
      'color.black': '#000000',
    });

    expect(res).toBe('#000000');
  });

  describe('cfBorder variable', () => {
    it('should return default value if no design tokens were found', () => {
      const res = maybePopulateDesignTokenValue('cfBorder', '${border.small}', {
        'color.black': '#000000',
      });

      expect(res).toBe(builtInStyles.cfBorder?.defaultValue);
    });

    it('should replace values which have design tokens', () => {
      const res = maybePopulateDesignTokenValue('cfBorder', '${border.small}', {
        'border.small': {
          width: '1px',
          style: 'solid',
          color: '#000000',
        },
      });

      expect(res).toBe('1px solid #000000');
    });
  });
});

describe('resolveBackgroundImageBinding', () => {
  it('should return undefined if bound entity is not available in entityStore', () => {
    const variableData: ComponentPropertyValue = {
      type: 'BoundValue',
      path: '/123abc/fields/image/~locale',
    };

    const res = resolveBackgroundImageBinding({
      variableData,
      getBoundEntityById: () => undefined,
      dataSource: {
        '123abc': {
          sys: { type: 'Link', linkType: 'Asset', id: '456def' },
        },
      },
    });

    expect(res).toBe(undefined);
  });

  it('should return undefined if reference to an asset (deep binding) within the entry does not exist', () => {
    const variableData: ComponentPropertyValue = {
      type: 'BoundValue',
      path: '/123abc/fields/image/~locale/fields/url/~locale',
    };

    const entry: Entry = {
      sys: {
        id: '456def',
        type: 'Entry',
      },
      fields: {
        image: {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: '789ghi',
          },
        },
      },
    } as unknown as Entry;

    const res = resolveBackgroundImageBinding({
      variableData,
      getBoundEntityById: (id) => (id === entry.sys.id ? entry : undefined),
      dataSource: {
        '123abc': {
          sys: { type: 'Link', linkType: 'Entry', id: '456def' },
        },
      },
    });

    expect(res).toBe(undefined);
  });

  it('should return image url from manual binding', () => {
    const variableData: ComponentPropertyValue = {
      type: 'UnboundValue',
      key: '123abc',
    };

    const res = resolveBackgroundImageBinding({
      variableData,
      getBoundEntityById: () => undefined,
      unboundValues: {
        '123abc': { value: 'https://www.contentful.com/image1.png' },
      },
    });

    expect(res).toBe('https://www.contentful.com/image1.png');
  });

  it('should return image url from direct asset binding', () => {
    const variableData: ComponentPropertyValue = {
      type: 'BoundValue',
      path: '/123abc/fields/image/~locale',
    };

    const asset: Asset = {
      sys: {
        id: '456def',
        type: 'Asset',
      },
      fields: {
        file: {
          url: 'https://www.contentful.com/image1.png',
        },
      },
    } as unknown as Asset;

    const res = resolveBackgroundImageBinding({
      variableData,
      getBoundEntityById: (id) => (id === asset.sys.id ? asset : undefined),
      dataSource: {
        '123abc': {
          sys: { type: 'Link', linkType: 'Asset', id: '456def' },
        },
      },
    });

    expect(res).toBe(asset.fields.file?.url);
  });

  it('should return image url from deep binding via entry', () => {
    const variableData: ComponentPropertyValue = {
      type: 'BoundValue',
      path: '/123abc/fields/image/~locale/fields/url/~locale',
    };

    const asset: Asset = {
      sys: {
        type: 'Asset',
        id: '789ghi',
      },
      fields: {
        file: {
          url: 'https://www.contentful.com/image1.png',
        },
      },
    } as unknown as Asset;

    const entry: Entry = {
      sys: {
        id: '456def',
        type: 'Entry',
      },
      fields: {
        image: {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: asset.sys.id,
          },
        },
      },
    } as unknown as Entry;

    const res = resolveBackgroundImageBinding({
      variableData,
      getBoundEntityById: (id) => {
        if (id === entry.sys.id) return entry;

        if (id === asset.sys.id) return asset;

        return undefined;
      },
      dataSource: {
        '123abc': {
          sys: { type: 'Link', linkType: 'Entry', id: '456def' },
        },
      },
    });

    expect(res).toBe(asset.fields.file?.url);
  });
});

describe('indexByBreakpoint', () => {
  it('should return a map of properties for each breakpoint', () => {
    const variables: Record<string, ComponentPropertyValue> = {
      cfBackgroundColor: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: 'red',
          tablet: 'green',
          mobile: 'blue',
        },
      },
      cfMargin: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '${spacing.l}',
          tablet: '${spacing.m}',
          mobile: '${spacing.s}',
        },
      },
      boundVariable: {
        type: 'BoundValue',
        path: '/123abc/fields/image/~locale',
      },
    };

    const res = indexByBreakpoint({
      variables,
      breakpointIds: ['desktop', 'tablet', 'mobile'],
      getBoundEntityById: () => undefined,
      dataSource: {},
      unboundValues: {},
    });

    expect(res).toEqual({
      desktop: {
        cfBackgroundColor: 'red',
        cfMargin: '${spacing.l}',
      },
      tablet: {
        cfBackgroundColor: 'green',
        cfMargin: '${spacing.m}',
      },
      mobile: {
        cfBackgroundColor: 'blue',
        cfMargin: '${spacing.s}',
      },
    });
  });

  it('should resolve background image binding and set it as cfBackgroundImageUrl variable for default breakpoint', () => {
    const variables: Record<string, ComponentPropertyValue> = {
      cfBackgroundColor: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: 'red',
          tablet: 'green',
          mobile: 'blue',
        },
      },
      cfMargin: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '${spacing.l}',
          tablet: '${spacing.m}',
          mobile: '${spacing.s}',
        },
      },
      boundVariable: {
        type: 'BoundValue',
        path: '/123abc/fields/image/~locale',
      },
      cfBackgroundImageUrl: {
        type: 'BoundValue',
        path: '/456def/fields/file/url/~locale',
      },
    };

    const asset: Asset = {
      sys: {
        id: '789ghi',
        type: 'Asset',
      },
      fields: {
        file: {
          url: 'https://www.contentful.com/image1.png',
        },
      },
    } as unknown as Asset;

    const res = indexByBreakpoint({
      variables,
      breakpointIds: ['desktop', 'tablet', 'mobile'],
      getBoundEntityById: () => asset,
      dataSource: {
        '456def': {
          sys: { type: 'Link', linkType: 'Asset', id: asset.sys.id },
        },
      },
      unboundValues: {},
    });

    expect(res).toEqual({
      desktop: {
        cfBackgroundColor: 'red',
        cfMargin: '${spacing.l}',
        cfBackgroundImageUrl: 'https://www.contentful.com/image1.png',
      },
      tablet: {
        cfBackgroundColor: 'green',
        cfMargin: '${spacing.m}',
      },
      mobile: {
        cfBackgroundColor: 'blue',
        cfMargin: '${spacing.s}',
      },
    });
  });

  it('should resolve background manual value and set it as cfBackgroundImageUrl variable for default breakpoint', () => {
    const variables: Record<string, ComponentPropertyValue> = {
      cfBackgroundColor: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: 'red',
          tablet: 'green',
          mobile: 'blue',
        },
      },
      cfMargin: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '${spacing.l}',
          tablet: '${spacing.m}',
          mobile: '${spacing.s}',
        },
      },
      boundVariable: {
        type: 'BoundValue',
        path: '/123abc/fields/image/~locale',
      },
      cfBackgroundImageUrl: {
        type: 'UnboundValue',
        key: '456def',
      },
    };

    const res = indexByBreakpoint({
      variables,
      breakpointIds: ['desktop', 'tablet', 'mobile'],
      getBoundEntityById: () => undefined,
      unboundValues: {
        '456def': {
          value: 'https://www.contentful.com/image1.png',
        },
      },
    });

    expect(res).toEqual({
      desktop: {
        cfBackgroundColor: 'red',
        cfMargin: '${spacing.l}',
        cfBackgroundImageUrl: 'https://www.contentful.com/image1.png',
      },
      tablet: {
        cfBackgroundColor: 'green',
        cfMargin: '${spacing.m}',
      },
      mobile: {
        cfBackgroundColor: 'blue',
        cfMargin: '${spacing.s}',
      },
    });
  });
});
