import { createExperience, detachExperienceStyles } from '../index';
import {
  ComponentTreeNode,
  DesignValue,
  ExperienceDataSource,
  ExperienceEntry,
  ExperienceUnboundValues,
} from '@contentful/experiences-core/types';
import { Asset, Entry } from 'contentful';

const getExperienceEntryWithNode = ({
  node,
  unboundValues = {},
  dataSource = {},
}: {
  node: ComponentTreeNode;
  unboundValues?: ExperienceUnboundValues;
  dataSource?: ExperienceDataSource;
}): ExperienceEntry => {
  return {
    sys: {
      id: 'test-id',
      type: 'Entry',
      contentType: {
        sys: {
          id: 'test-content-type-id',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      space: {
        sys: {
          id: 'test-space-id',
          type: 'Link',
          linkType: 'Space',
        },
      },
      environment: {
        sys: {
          id: 'test-environmnet-id',
          type: 'Link',
          linkType: 'Environment',
        },
      },
      revision: 1,
      createdAt: '2021-07-07T00:00:00Z',
      updatedAt: '2021-07-07T00:00:00Z',
    },
    fields: {
      title: 'GlaDOS',
      slug: '/test-entry',
      componentTree: {
        breakpoints: [
          {
            id: 'desktop',
            query: '*',
            displayName: 'All Sizes',
            previewSize: '100%',
          },
          {
            id: 'tablet',
            query: '<992px',
            displayName: 'Tablet',
            previewSize: '820px',
          },
          {
            id: 'mobile',
            query: '<576px',
            displayName: 'Mobile',
            previewSize: '390px',
          },
        ],
        schemaVersion: '2023-09-28',
        children: [node],
      },
      dataSource,
      unboundValues,
    },
    metadata: {
      tags: [],
    },
  };
};

describe('section component', () => {
  it('should extract media query css', () => {
    const sectionNode: ComponentTreeNode = {
      definitionId: 'contentful-section',
      variables: {
        cfVerticalAlignment: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'center' } },
        cfHorizontalAlignment: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'center' } },
        cfMargin: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '0 0 0 0', tablet: '0 0 0 0' },
        },
        cfPadding: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '0 0 0 0', tablet: '0 0 0 0' },
        },
        cfBackgroundColor: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: 'rgba(255, 255, 255, 0)' },
        },
        cfWidth: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'fill' } },
        cfHeight: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'fit-content' } },
        cfMaxWidth: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'none' } },
        cfFlexDirection: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'column' } },
        cfFlexWrap: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'nowrap' } },
        cfBorder: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: 'black 1px solid', tablet: 'black 2px solid' },
        },
        cfGap: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '0px 0px', tablet: '0px 0px' },
        },
        cfHyperlink: { type: 'UnboundValue', key: '1NFr9fZD0VHQhe6lQVAkl' },
        cfOpenInNewTab: { type: 'UnboundValue', key: 'A9_d62d6LSFNC-JgW6Sgi' },
        cfBorderRadius: { type: 'DesignValue', valuesByBreakpoint: { desktop: '0px' } },
        cfBackgroundImageOptions: {
          type: 'DesignValue',
          valuesByBreakpoint: {
            desktop: { scaling: 'fill', alignment: 'left top', targetSize: '2000px' },
          },
        },
      },
      children: [],
    };

    const experienceEntry = getExperienceEntryWithNode({
      node: sectionNode,
      unboundValues: {
        '1NFr9fZD0VHQhe6lQVAkl': { value: 'https://www.contentful.com/' },
        'A9_d62d6LSFNC-JgW6Sgi': { value: true },
      },
    });

    const experience = createExperience({
      experienceEntry: experienceEntry as Entry,
      locale: 'en-US',
      referencedEntries: [],
      referencedAssets: [],
    });

    const styles = detachExperienceStyles(experience);

    const section = experienceEntry.fields.componentTree.children[0];
    expect(section.variables.cfSsrClassName).toBeDefined();
    expect(section.variables.cfSsrClassName.type).toBe('DesignValue');
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.desktop,
    ).toBeDefined();
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.desktop as string,
    ).toEqual(
      'cf-d26d75efcadc8b3fc5a51bfc4595d7bb cf-a6e5b3ca363cc489fda34f3f6ba4e194 cf-ef482b7371f2497a86df1fe909795008',
    );
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.tablet,
    ).not.toBeDefined();
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.mobile,
    ).not.toBeDefined();

    expect(styles).toBe(
      '.cf-d26d75efcadc8b3fc5a51bfc4595d7bb{margin:0 0 0 0;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);width:100%;height:fit-content;max-width:none;border:black 1px solid;border-radius:0px;gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;font-family:Arial;font-style:normal;text-decoration:none;box-sizing:border-box;}@media(max-width:992px){.cf-a6e5b3ca363cc489fda34f3f6ba4e194{margin:0 0 0 0;padding:0 0 0 0;border:black 2px solid;gap:0px 0px;font-family:Arial;font-style:normal;text-decoration:none;box-sizing:border-box;}}@media(max-width:576px){.cf-ef482b7371f2497a86df1fe909795008{font-family:Arial;font-style:normal;text-decoration:none;box-sizing:border-box;}}',
    );
  });

  it('should resolve binding to an asset and get background-image in extracted css', () => {
    const sectionNode: ComponentTreeNode = {
      definitionId: 'contentful-section',
      variables: {
        cfVerticalAlignment: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'center' } },
        cfHorizontalAlignment: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'center' } },
        cfMargin: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '0 0 0 0', tablet: '0 0 0 0' },
        },
        cfPadding: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '0 0 0 0', tablet: '0 0 0 0' },
        },
        cfBackgroundColor: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: 'rgba(255, 255, 255, 0)' },
        },
        cfWidth: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'fill' } },
        cfHeight: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'fit-content' } },
        cfMaxWidth: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'none' } },
        cfFlexDirection: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'column' } },
        cfFlexWrap: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'nowrap' } },
        cfBorder: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: 'black 1px solid', tablet: 'black 2px solid' },
        },
        cfGap: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '0px 0px', tablet: '0px 0px' },
        },
        cfHyperlink: { type: 'UnboundValue', key: '1NFr9fZD0VHQhe6lQVAkl' },
        cfOpenInNewTab: { type: 'UnboundValue', key: 'A9_d62d6LSFNC-JgW6Sgi' },
        cfBorderRadius: { type: 'DesignValue', valuesByBreakpoint: { desktop: '0px' } },
        cfBackgroundImageUrl: {
          type: 'BoundValue',
          path: '/iNB7E-aJxWgp7aVkvQ3ko/fields/file/url/~locale',
        },
        cfBackgroundImageOptions: {
          type: 'DesignValue',
          valuesByBreakpoint: {
            desktop: { scaling: 'fill', alignment: 'left top', targetSize: '2000px' },
          },
        },
      },
      children: [],
    };

    const boundAset: Asset = {
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

    const experienceEntry = getExperienceEntryWithNode({
      node: sectionNode,
      unboundValues: {
        '1NFr9fZD0VHQhe6lQVAkl': { value: 'https://www.contentful.com/' },
        'A9_d62d6LSFNC-JgW6Sgi': { value: true },
      },
      dataSource: {
        'iNB7E-aJxWgp7aVkvQ3ko': {
          sys: {
            id: boundAset.sys.id,
            type: 'Link',
            linkType: 'Asset',
          },
        },
      },
    });

    const experience = createExperience({
      experienceEntry: experienceEntry as Entry,
      locale: 'en-US',
      referencedEntries: [],
      referencedAssets: [boundAset],
    });

    const styles = detachExperienceStyles(experience);

    const section = experienceEntry.fields.componentTree.children[0];
    expect(section.variables.cfSsrClassName).toBeDefined();
    expect(section.variables.cfSsrClassName.type).toBe('DesignValue');
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.desktop,
    ).toBeDefined();
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.desktop as string,
    ).toEqual(
      'cf-2e2514c40088d43d9e885dddbdddd245 cf-a6e5b3ca363cc489fda34f3f6ba4e194 cf-ef482b7371f2497a86df1fe909795008',
    );
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.tablet,
    ).not.toBeDefined();
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.mobile,
    ).not.toBeDefined();

    expect(styles).toBe(
      '.cf-2e2514c40088d43d9e885dddbdddd245{margin:0 0 0 0;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);width:100%;height:fit-content;max-width:none;border:black 1px solid;border-radius:0px;gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;background-image:url(https://www.contentful.com/image1.png);background-repeat:no-repeat;background-position:left top;background-size:cover;font-family:Arial;font-style:normal;text-decoration:none;box-sizing:border-box;}@media(max-width:992px){.cf-a6e5b3ca363cc489fda34f3f6ba4e194{margin:0 0 0 0;padding:0 0 0 0;border:black 2px solid;gap:0px 0px;font-family:Arial;font-style:normal;text-decoration:none;box-sizing:border-box;}}@media(max-width:576px){.cf-ef482b7371f2497a86df1fe909795008{font-family:Arial;font-style:normal;text-decoration:none;box-sizing:border-box;}}',
    );
    expect(styles).toContain('background-image:url(https://www.contentful.com/image1.png);');
  });

  it('should resolve deep binding to an asset and get background-image in extracted css', () => {
    const sectionNode: ComponentTreeNode = {
      definitionId: 'contentful-section',
      variables: {
        cfVerticalAlignment: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'center' } },
        cfHorizontalAlignment: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'center' } },
        cfMargin: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '0 0 0 0', tablet: '0 0 0 0' },
        },
        cfPadding: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '0 0 0 0', tablet: '0 0 0 0' },
        },
        cfBackgroundColor: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: 'rgba(255, 255, 255, 0)' },
        },
        cfWidth: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'fill' } },
        cfHeight: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'fit-content' } },
        cfMaxWidth: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'none' } },
        cfFlexDirection: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'column' } },
        cfFlexWrap: { type: 'DesignValue', valuesByBreakpoint: { desktop: 'nowrap' } },
        cfBorder: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: 'black 1px solid', tablet: 'black 2px solid' },
        },
        cfGap: {
          type: 'DesignValue',
          valuesByBreakpoint: { desktop: '0px 0px', tablet: '0px 0px' },
        },
        cfHyperlink: { type: 'UnboundValue', key: '1NFr9fZD0VHQhe6lQVAkl' },
        cfOpenInNewTab: { type: 'UnboundValue', key: 'A9_d62d6LSFNC-JgW6Sgi' },
        cfBorderRadius: { type: 'DesignValue', valuesByBreakpoint: { desktop: '0px' } },
        cfBackgroundImageUrl: {
          type: 'BoundValue',
          path: '/iNB7E-aJxWgp7aVkvQ3ko/fields/assetReference/~locale/file/url/~locale',
        },
        cfBackgroundImageOptions: {
          type: 'DesignValue',
          valuesByBreakpoint: {
            desktop: { scaling: 'fill', alignment: 'left top', targetSize: '2000px' },
          },
        },
      },
      children: [],
    };

    const referencedAsset: Asset = {
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

    const boundEntry: Entry = {
      sys: {
        id: '789ghi',
        type: 'Entry',
      },
      fields: {
        assetReference: {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: referencedAsset.sys.id,
          },
        },
      },
    } as unknown as Entry;

    const experienceEntry = getExperienceEntryWithNode({
      node: sectionNode,
      unboundValues: {
        '1NFr9fZD0VHQhe6lQVAkl': { value: 'https://www.contentful.com/' },
        'A9_d62d6LSFNC-JgW6Sgi': { value: true },
      },
      dataSource: {
        'iNB7E-aJxWgp7aVkvQ3ko': {
          sys: {
            id: boundEntry.sys.id,
            type: 'Link',
            linkType: 'Entry',
          },
        },
      },
    });

    const experience = createExperience({
      experienceEntry: experienceEntry as Entry,
      locale: 'en-US',
      referencedEntries: [boundEntry],
      referencedAssets: [referencedAsset],
    });

    const styles = detachExperienceStyles(experience);

    const section = experienceEntry.fields.componentTree.children[0];
    expect(section.variables.cfSsrClassName).toBeDefined();
    expect(section.variables.cfSsrClassName.type).toBe('DesignValue');
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.desktop,
    ).toBeDefined();
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.desktop as string,
    ).toEqual(
      'cf-2e2514c40088d43d9e885dddbdddd245 cf-a6e5b3ca363cc489fda34f3f6ba4e194 cf-ef482b7371f2497a86df1fe909795008',
    );
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.tablet,
    ).not.toBeDefined();
    expect(
      (section.variables.cfSsrClassName as DesignValue).valuesByBreakpoint.mobile,
    ).not.toBeDefined();

    expect(styles).toBe(
      '.cf-2e2514c40088d43d9e885dddbdddd245{margin:0 0 0 0;padding:0 0 0 0;background-color:rgba(255, 255, 255, 0);width:100%;height:fit-content;max-width:none;border:black 1px solid;border-radius:0px;gap:0px 0px;align-items:center;justify-content:safe center;flex-direction:column;flex-wrap:nowrap;background-image:url(https://www.contentful.com/image1.png);background-repeat:no-repeat;background-position:left top;background-size:cover;font-family:Arial;font-style:normal;text-decoration:none;box-sizing:border-box;}@media(max-width:992px){.cf-a6e5b3ca363cc489fda34f3f6ba4e194{margin:0 0 0 0;padding:0 0 0 0;border:black 2px solid;gap:0px 0px;font-family:Arial;font-style:normal;text-decoration:none;box-sizing:border-box;}}@media(max-width:576px){.cf-ef482b7371f2497a86df1fe909795008{font-family:Arial;font-style:normal;text-decoration:none;box-sizing:border-box;}}',
    );

    expect(styles).toContain('background-image:url(https://www.contentful.com/image1.png);');
  });
});
