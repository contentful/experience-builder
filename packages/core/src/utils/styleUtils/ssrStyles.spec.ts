import { Asset, Entry } from 'contentful';
import { CF_STYLE_ATTRIBUTES } from '@/constants';
import { builtInStyles } from '@/definitions';
import {
  ComponentPropertyValue,
  DesignTokensDefinition,
  ExperienceComponentSettings,
} from '@/types';
import {
  flattenDesignTokenRegistry,
  indexByBreakpoint,
  isCfStyleAttribute,
  maybePopulateDesignTokenValue,
  resolveBackgroundImageBinding,
  toMediaQuery,
} from './ssrStyles';

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

    expect(res).toBe(`${builtInStyles.cfBackgroundColor?.defaultValue}`);
  });

  it('should replace design token variables with their values', () => {
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
describe('resolveBackgroundImageBinding with image optimization', () => {
  it('should return optimized image URL when width and options are provided', () => {
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
          details: {
            image: {
              width: 2000,
            },
          },
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
      options: {
        targetSize: '1000px',
        scaling: 'fit',
        alignment: 'left',
      },
      width: '1000px',
    });

    expect(res).toStrictEqual({
      file: {
        details: {
          image: {
            width: 2000,
          },
        },
        url: 'https://www.contentful.com/image1.png',
      },
      srcSet: [
        'url(https://www.contentful.com/image1.png?w=1000) 1x',
        'url(https://www.contentful.com/image1.png?w=2000) 2x',
      ],
      url: 'https://www.contentful.com/image1.png?w=2000',
    });
  });

  it('should return srcSet for responsive images when multiple widths are provided', () => {
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
          details: {
            image: {
              width: 2000,
            },
          },
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
      options: {
        scaling: 'fit',
        alignment: 'left',
        format: 'webp',
        targetSize: '300px',
      },
    });

    expect(res).toEqual({
      file: {
        details: {
          image: {
            width: 2000,
          },
        },
        url: 'https://www.contentful.com/image1.png',
      },
      srcSet: [
        'url(https://www.contentful.com/image1.png?w=300&fm=webp) 1x',
        'url(https://www.contentful.com/image1.png?w=600&fm=webp) 2x',
      ],
      url: 'https://www.contentful.com/image1.png?w=600&fm=webp',
    });
  });

  it('should return original image URL if no optimization options are provided', () => {
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

    expect(res).toBe('https://www.contentful.com/image1.png');
  });

  it('should handle cases where target width exceeds original image width', () => {
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
          details: {
            image: {
              width: 800,
            },
          },
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
      options: {
        quality: '80%',
        format: 'webp',
        targetSize: '300px',
        scaling: 'fill',
        alignment: 'left',
      },
      width: '1000px',
    });

    expect(res).toStrictEqual({
      file: {
        details: {
          image: {
            width: 800,
          },
        },
        url: 'https://www.contentful.com/image1.png',
      },
      srcSet: [
        'url(https://www.contentful.com/image1.png?w=300&q=80&fm=webp) 1x',
        'url(https://www.contentful.com/image1.png?w=600&q=80&fm=webp) 2x',
      ],
      url: 'https://www.contentful.com/image1.png?w=600&q=80&fm=webp',
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
        locale: 'en-US',
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
        locale: 'en-US',
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

  it('should return the image url for a pattern from default value', () => {
    const componentSettings: ExperienceComponentSettings = {
      variableDefinitions: {
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          displayName: 'Background Image',
          type: 'Text',
          defaultValue: {
            key: '9Ew1GTxkZvOXiBZxKPCSC',
            type: 'UnboundValue',
          },
          description: 'Background image for section or container',
        },
      },
    };

    const res = resolveBackgroundImageBinding({
      variableData: {
        key: 'cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88',
        type: 'ComponentValue',
      },
      getBoundEntityById: () => undefined,
      unboundValues: {
        '9Ew1GTxkZvOXiBZxKPCSC': {
          value: 'https://www.contentful.com/image1.png',
        },
      },
      componentSettings,
    });

    expect(res).toBe('https://www.contentful.com/image1.png');
  });

  it('should return the image url for a pattern from a binding to an asset', () => {
    const componentSettings: ExperienceComponentSettings = {
      variableDefinitions: {
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          displayName: 'Background Image',
          type: 'Text',
          defaultValue: {
            key: '9Ew1GTxkZvOXiBZxKPCSC',
            type: 'UnboundValue',
          },
          description: 'Background image for section or container',
        },
      },
    };

    const boundAsset: Asset = {
      sys: {
        id: 'bound-asset-id',
        type: 'Asset',
        locale: 'en-US',
      },
      fields: {
        file: {
          url: 'https://www.contentful.com/bound-image.png',
        },
      },
    } as unknown as Asset;

    const res = resolveBackgroundImageBinding({
      variableData: {
        key: 'cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88',
        type: 'ComponentValue',
      },
      getBoundEntityById: () => boundAsset,
      unboundValues: {
        '9Ew1GTxkZvOXiBZxKPCSC': {
          value: 'https://www.contentful.com/image1.png',
        },
      },
      dataSource: {
        vOXiBZxKPCSC9Ew1GTxkZ: {
          sys: { type: 'Link', linkType: 'Asset', id: boundAsset.sys.id },
        },
      },
      componentSettings,
      componentVariablesOverwrites: {
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          type: 'BoundValue',
          path: '/vOXiBZxKPCSC9Ew1GTxkZ/fields/file/url/~locale',
        },
      },
    });

    expect(res).toBe('https://www.contentful.com/bound-image.png');
  });

  it('should return the image url for a pattern from a deep binding to an entry', () => {
    const componentSettings: ExperienceComponentSettings = {
      variableDefinitions: {
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          displayName: 'Background Image',
          type: 'Text',
          defaultValue: {
            key: '9Ew1GTxkZvOXiBZxKPCSC',
            type: 'UnboundValue',
          },
          description: 'Background image for section or container',
        },
      },
    };

    const referencedAsset: Asset = {
      sys: {
        id: 'bound-asset-id',
        type: 'Asset',
        locale: 'en-US',
      },
      fields: {
        file: {
          url: 'https://www.contentful.com/bound-image.png',
        },
      },
    } as unknown as Asset;

    const boundEntry: Entry = {
      sys: {
        id: 'bound-entry-id',
        type: 'Entry',
      },
      fields: {
        image: {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: referencedAsset.sys.id,
          },
        },
      },
    } as unknown as Entry;

    const res = resolveBackgroundImageBinding({
      variableData: {
        key: 'cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88',
        type: 'ComponentValue',
      },
      getBoundEntityById: (id) => (id === boundEntry.sys.id ? boundEntry : referencedAsset),
      unboundValues: {
        '9Ew1GTxkZvOXiBZxKPCSC': {
          value: 'https://www.contentful.com/image1.png',
        },
      },
      dataSource: {
        vOXiBZxKPCSC9Ew1GTxkZ: {
          sys: { type: 'Link', linkType: 'Entry', id: boundEntry.sys.id },
        },
      },
      componentSettings,
      componentVariablesOverwrites: {
        cfBackgroundImageUrl_Tdhixzp1Gt91aI9uc5p88: {
          type: 'BoundValue',
          path: '/vOXiBZxKPCSC9Ew1GTxkZ/fields/image/~locale/file/url/~locale',
        },
      },
    });

    expect(res).toBe('https://www.contentful.com/bound-image.png');
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
      cfBackgroundImageOptions: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: {
            scaling: 'fit',
            alignment: 'left',
            targetSize: '300px',
          },
        },
      },
    };

    const asset: Asset = {
      sys: {
        id: '789ghi',
        type: 'Asset',
        locale: 'en-US',
      },
      fields: {
        file: {
          url: 'https://www.contentful.com/image1.png',
          details: {
            image: {
              width: 2000,
            },
          },
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
        cfBackgroundImageUrl: {
          file: {
            details: {
              image: {
                width: 2000,
              },
            },
            url: 'https://www.contentful.com/image1.png',
          },
          srcSet: [
            'url(https://www.contentful.com/image1.png?w=300) 1x',
            'url(https://www.contentful.com/image1.png?w=600) 2x',
          ],
          url: 'https://www.contentful.com/image1.png?w=600',
        },
        cfBackgroundImageOptions: {
          alignment: 'left',
          scaling: 'fit',
          targetSize: '300px',
        },
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
      cfBackgroundImageOptions: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: {
            scaling: 'fit',
            alignment: 'left',
            targetSize: '300px',
          },
        },
      },
    };

    const res = indexByBreakpoint({
      variables,
      breakpointIds: ['desktop', 'tablet', 'mobile'],
      getBoundEntityById: () => undefined,
      unboundValues: {
        '456def': {
          value: 'https://www.contentful.com/unboundImage1.png',
        },
      },
    });

    expect(res).toEqual({
      desktop: {
        cfBackgroundColor: 'red',
        cfMargin: '${spacing.l}',
        cfBackgroundImageOptions: {
          alignment: 'left',
          scaling: 'fit',
          targetSize: '300px',
        },
        cfBackgroundImageUrl: 'https://www.contentful.com/unboundImage1.png',
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

  it('resolves background image for a pattern from default value', () => {
    const componentSettings: ExperienceComponentSettings = {
      variableDefinitions: {
        randomHashValue: {
          displayName: 'Background Image',
          type: 'Text',
          defaultValue: {
            key: '9Ew1GTxkZvOXiBZxKPCSC',
            type: 'UnboundValue',
          },
          description: 'Background image for section or container',
        },
        randomHashValue2: {
          displayName: 'Background Image Options',
          type: 'Text',
          group: 'style',
          description: 'Background image options',
          defaultValue: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              desktop: {
                scaling: 'fit',
                alignment: 'left',
                targetSize: '300px',
              },
            },
          },
        },
      },
    };

    const patternVariables = {
      cfMargin: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '0 Auto 0 Auto',
        },
      },
      cfWidth: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: 'fill',
        },
      },
      cfMaxWidth: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '1192px',
        },
      },
      cfPadding: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '10px 10px 10px 10px',
        },
      },
      cfBackgroundImageUrl: {
        key: 'randomHashValue',
        type: 'ComponentValue',
      },
      cfBackgroundImageOptions: {
        key: 'randomHashValue2',
        type: 'ComponentValue',
      },
    } as Record<string, ComponentPropertyValue>;

    const res = indexByBreakpoint({
      variables: patternVariables,
      breakpointIds: ['desktop'],
      getBoundEntityById: () => undefined,
      unboundValues: {
        '9Ew1GTxkZvOXiBZxKPCSC': {
          value: 'https://www.contentful.com/image1.png',
        },
      },
      componentSettings,
    });

    expect(res).toEqual({
      desktop: {
        cfMargin: '0 Auto 0 Auto',
        cfWidth: 'fill',
        cfMaxWidth: '1192px',
        cfPadding: '10px 10px 10px 10px',
        cfBackgroundImageUrl: 'https://www.contentful.com/image1.png',
        cfBackgroundImageOptions: {
          alignment: 'left',
          scaling: 'fit',
          targetSize: '300px',
        },
      },
    });
  });

  it('resolves background image for a pattern from a binding to an asset', () => {
    const componentSettings: ExperienceComponentSettings = {
      variableDefinitions: {
        randomHashValue: {
          displayName: 'Background Image',
          type: 'Text',
          defaultValue: {
            key: '9Ew1GTxkZvOXiBZxKPCSC',
            type: 'UnboundValue',
          },
          description: 'Background image for section or container',
        },
        randomHashValue2: {
          displayName: 'Background Image Options',
          type: 'Text',
          group: 'style',
          description: 'Background image options',
          defaultValue: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              desktop: {
                scaling: 'fit',
                alignment: 'left',
                targetSize: '300px',
              },
            },
          },
        },
      },
    };

    const patternVariables = {
      cfMargin: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '0 Auto 0 Auto',
        },
      },
      cfWidth: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: 'fill',
        },
      },
      cfMaxWidth: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '1192px',
        },
      },
      cfPadding: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '10px 10px 10px 10px',
        },
      },
      cfBackgroundImageUrl: {
        key: 'randomHashValue',
        type: 'ComponentValue',
      },
      cfBackgroundImageOptions: {
        key: 'randomHashValue2',
        type: 'ComponentValue',
      },
    } as Record<string, ComponentPropertyValue>;

    const boundAsset: Asset = {
      sys: {
        id: 'bound-asset-id',
        type: 'Asset',
        locale: 'en-US',
      },
      fields: {
        file: {
          url: 'https://www.contentful.com/bound-image.png',
          details: {
            image: {
              width: 2000,
            },
          },
        },
      },
    } as unknown as Asset;

    const res = indexByBreakpoint({
      variables: patternVariables,
      breakpointIds: ['desktop'],
      getBoundEntityById: () => boundAsset,
      unboundValues: {
        '9Ew1GTxkZvOXiBZxKPCSC': {
          value: 'https://www.contentful.com/image1.png',
        },
      },
      dataSource: {
        vOXiBZxKPCSC9Ew1GTxkZ: {
          sys: { type: 'Link', linkType: 'Asset', id: boundAsset.sys.id },
        },
      },
      componentSettings,
      componentVariablesOverwrites: {
        randomHashValue: {
          type: 'BoundValue',
          path: '/vOXiBZxKPCSC9Ew1GTxkZ/fields/file/url/~locale',
        },
      },
    });

    expect(res).toEqual({
      desktop: {
        cfMargin: '0 Auto 0 Auto',
        cfWidth: 'fill',
        cfMaxWidth: '1192px',
        cfPadding: '10px 10px 10px 10px',
        cfBackgroundImageUrl: {
          file: {
            details: {
              image: {
                width: 2000,
              },
            },
            url: 'https://www.contentful.com/bound-image.png',
          },
          srcSet: [
            'url(https://www.contentful.com/bound-image.png?w=300) 1x',
            'url(https://www.contentful.com/bound-image.png?w=600) 2x',
          ],
          url: 'https://www.contentful.com/bound-image.png?w=600',
        },
        cfBackgroundImageOptions: {
          alignment: 'left',
          scaling: 'fit',
          targetSize: '300px',
        },
      },
    });
  });

  it('resolves background image for a pattern from a deep binding to an entry', () => {
    const componentSettings: ExperienceComponentSettings = {
      variableDefinitions: {
        randomHashValue: {
          displayName: 'Background Image',
          type: 'Text',
          defaultValue: {
            key: '9Ew1GTxkZvOXiBZxKPCSC',
            type: 'UnboundValue',
          },
          description: 'Background image for section or container',
        },
        randomHashValue2: {
          displayName: 'Background Image Options',
          type: 'Text',
          group: 'style',
          description: 'Background image options',
          defaultValue: {
            type: 'DesignValue',
            valuesByBreakpoint: {
              desktop: {
                scaling: 'fit',
                alignment: 'left',
                targetSize: '300px',
              },
            },
          },
        },
      },
    };

    const patternVariables = {
      cfMargin: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '0 Auto 0 Auto',
        },
      },
      cfWidth: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: 'fill',
        },
      },
      cfMaxWidth: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '1192px',
        },
      },
      cfPadding: {
        type: 'DesignValue',
        valuesByBreakpoint: {
          desktop: '10px 10px 10px 10px',
        },
      },
      cfBackgroundImageUrl: {
        key: 'randomHashValue',
        type: 'ComponentValue',
      },
      cfBackgroundImageOptions: {
        key: 'randomHashValue2',
        type: 'ComponentValue',
      },
    } as Record<string, ComponentPropertyValue>;

    const referencedAsset: Asset = {
      sys: {
        id: 'bound-asset-id',
        type: 'Asset',
        locale: 'en-US',
      },
      fields: {
        file: {
          url: 'https://www.contentful.com/bound-image.png',
          details: {
            image: {
              width: 1000,
            },
          },
        },
      },
    } as unknown as Asset;

    const boundEntry: Entry = {
      sys: {
        id: 'bound-entry-id',
        type: 'Entry',
      },
      fields: {
        image: {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: referencedAsset.sys.id,
          },
        },
      },
    } as unknown as Entry;

    const res = indexByBreakpoint({
      variables: patternVariables,
      breakpointIds: ['desktop'],
      getBoundEntityById: (id) => (id === boundEntry.sys.id ? boundEntry : referencedAsset),
      unboundValues: {
        '9Ew1GTxkZvOXiBZxKPCSC': {
          value: 'https://www.contentful.com/image1.png',
        },
      },
      dataSource: {
        vOXiBZxKPCSC9Ew1GTxkZ: {
          sys: { type: 'Link', linkType: 'Entry', id: boundEntry.sys.id },
        },
      },
      componentSettings,
      componentVariablesOverwrites: {
        randomHashValue: {
          type: 'BoundValue',
          path: '/vOXiBZxKPCSC9Ew1GTxkZ/fields/image/~locale/file/url/~locale',
        },
      },
    });

    expect(res).toEqual({
      desktop: {
        cfMargin: '0 Auto 0 Auto',
        cfWidth: 'fill',
        cfMaxWidth: '1192px',
        cfPadding: '10px 10px 10px 10px',
        cfBackgroundImageUrl: {
          file: {
            details: {
              image: {
                width: 1000,
              },
            },
            url: 'https://www.contentful.com/bound-image.png',
          },
          srcSet: [
            'url(https://www.contentful.com/bound-image.png?w=300) 1x',
            'url(https://www.contentful.com/bound-image.png?w=600) 2x',
          ],
          url: 'https://www.contentful.com/bound-image.png?w=600',
        },
        cfBackgroundImageOptions: {
          alignment: 'left',
          scaling: 'fit',
          targetSize: '300px',
        },
      },
    });
  });
});

describe('flattenDesignTokenRegistry', () => {
  it('should flatten the design token registry', () => {
    const designTokenRegistry: DesignTokensDefinition = {
      color: {
        bg: 'white',
        font: 'black',
        danger: 'red',
        warning: 'orange',
        success: 'green',
      },
      spacing: {
        xs: '0.5 rem',
        s: '1rem',
        m: '1.5rem',
        l: '2rem',
      },
      sizing: {
        quarter: '25%',
        half: '50%',
        threeQuarters: '75%',
        full: '100%',
      },
      border: {
        default: {
          width: '1px',
          style: 'solid',
          color: 'black',
        },
        bold: {
          width: '3px',
          style: 'solid',
          color: 'black',
        },
      },
      fontSize: {
        default: '1rem',
        small: '0.75rem',
        large: '1.5rem',
      },
      lineHeight: {
        default: '1.5',
        small: '1.25',
        large: '2',
      },
      letterSpacing: {
        default: 'normal',
        tight: '0.5px',
        wide: '2px',
      },
      textColor: {
        default: 'black',
        muted: 'gray',
        accent: 'blue',
      },
    };
    const res = flattenDesignTokenRegistry(designTokenRegistry);

    expect(res).toEqual({
      'color.bg': 'white',
      'color.font': 'black',
      'color.danger': 'red',
      'color.warning': 'orange',
      'color.success': 'green',
      'spacing.xs': '0.5 rem',
      'spacing.s': '1rem',
      'spacing.m': '1.5rem',
      'spacing.l': '2rem',
      'sizing.quarter': '25%',
      'sizing.half': '50%',
      'sizing.threeQuarters': '75%',
      'sizing.full': '100%',
      'border.default': {
        width: '1px',
        style: 'solid',
        color: 'black',
      },
      'border.bold': {
        width: '3px',
        style: 'solid',
        color: 'black',
      },
      'fontSize.default': '1rem',
      'fontSize.small': '0.75rem',
      'fontSize.large': '1.5rem',
      'lineHeight.default': '1.5',
      'lineHeight.small': '1.25',
      'lineHeight.large': '2',
      'letterSpacing.default': 'normal',
      'letterSpacing.tight': '0.5px',
      'letterSpacing.wide': '2px',
      'textColor.default': 'black',
      'textColor.muted': 'gray',
      'textColor.accent': 'blue',
    });
  });
});

describe('toMediaQuery', () => {
  it('should return css for default breakpoint without wrapping it into a media query', () => {
    const res = toMediaQuery({
      condition: '*',
      cssByClassName: {
        className1: 'background:green;color:white;font-size:1rem;',
        className2: 'background:red;color:black;font-size:1.5rem;',
      },
    });

    expect(res).toBe(
      '.className1{background:green;color:white;font-size:1rem;}.className2{background:red;color:black;font-size:1.5rem;}',
    );
  });

  it('should wrap styles for non default breakpoint into a media query', () => {
    const res = toMediaQuery({
      condition: '<950px',
      cssByClassName: {
        className1: 'background:green;color:white;font-size:1rem;',
        className2: 'background:red;color:black;font-size:1.5rem;',
      },
    });

    expect(res).toBe(
      '@media(max-width:950px){.className1{background:green;color:white;font-size:1rem;}.className2{background:red;color:black;font-size:1.5rem;}}',
    );
  });

  it('should support min-width media query rule', () => {
    const res = toMediaQuery({
      condition: '>950px',
      cssByClassName: {
        className1: 'background:green;color:white;font-size:1rem;',
        className2: 'background:red;color:black;font-size:1.5rem;',
      },
    });

    expect(res).toBe(
      '@media(min-width:950px){.className1{background:green;color:white;font-size:1rem;}.className2{background:red;color:black;font-size:1.5rem;}}',
    );
  });
});
