import {
  ExperienceTreeNode,
  ExperienceDataSource,
  DataSourceEntryValueType,
  ExperienceEntry,
  ComponentTreeNode,
  Link,
} from '@/types';
import {
  getPrebindingPathBySourceEntry,
  isDeepPath,
  isDeepPrebinding,
  isPreboundProp,
  parseDataSourcePathWithL1DeepBindings,
} from '@/utils/pathSchema';
import { treeVisit } from '@/utils/treeTraversal';
import { isLink } from '@/utils/isLink';
import type { EntityFromLink, EntityStoreBase } from '@/entity';
import { Entry } from 'contentful';
import {
  generateDefaultDataSourceForPrebindingDefinition,
  getTargetPatternMappingsForParameter,
  PrebindingData,
} from '@/utils';

type DeepReferenceOpts = {
  path: string;
  dataSource: ExperienceDataSource;
};

export class DeepReference {
  public entityId: string;
  public entityLink: DataSourceEntryValueType;
  public field: string;
  public referentField: string;
  public originalPath: string;

  constructor({ path, dataSource }: DeepReferenceOpts) {
    const { key, field, referentField } = parseDataSourcePathWithL1DeepBindings(path);

    this.originalPath = path;
    this.entityId = dataSource[key]?.sys.id;
    this.entityLink = dataSource[key];
    this.field = field;
    this.referentField = referentField;
  }

  get headEntityId() {
    return this.entityId;
  }

  /**
   * Extracts referent from the path, using EntityStore as source of
   * entities during the resolution path.
   */
  extractReferent(entityStore: EntityFromLink): Link<'Asset' | 'Entry'> | undefined {
    const headEntity = entityStore.getEntityFromLink(this.entityLink);

    const maybeReferentLink = headEntity?.fields[this.field] as
      | Link<'Entry'>
      | Link<'Asset'>
      | undefined
      | unknown;

    if (undefined === maybeReferentLink) {
      // field references nothing (or even field doesn't exist)
      return undefined;
    }

    if (!isLink(maybeReferentLink)) {
      // Scenario of "impostor referent", where one of the deepPath's segments is not a Link but some other type
      // Under normal circumstance we expect field to be a Link, but it could be an "impostor"
      // eg. `Text` or `Number` or anything like that; could be due to CT changes or manual path creation via CMA
      return undefined;
    }

    return maybeReferentLink;
  }

  static from(opt: DeepReferenceOpts) {
    return new DeepReference(opt);
  }
}

export function gatherDeepReferencesFromExperienceEntry(
  experienceEntry: ExperienceEntry,
): DeepReference[] {
  const deepReferences: Array<DeepReference> = [];
  const dataSource = experienceEntry.fields.dataSource;
  const { children } = experienceEntry.fields.componentTree;

  treeVisit(
    {
      definitionId: 'root',
      variables: {},
      children,
    } as ComponentTreeNode,
    (node) => {
      if (!node.variables) return;

      for (const variableMapping of Object.values(node.variables)) {
        if (variableMapping.type !== 'BoundValue') continue;
        if (!isDeepPath(variableMapping.path)) continue;

        deepReferences.push(
          DeepReference.from({
            path: variableMapping.path,
            dataSource,
          }),
        );
      }
    },
  );

  return deepReferences;
}

export function gatherDeepPrebindingReferencesFromExperienceEntry({
  experienceEntry,
  fetchedPatterns,
  prebindingDataByPatternId,
  fetchedLevel1Entries,
}: {
  // can be an Experience or can be a Pattern
  experienceEntry: ExperienceEntry;
  fetchedPatterns: Array<ExperienceEntry>;
  prebindingDataByPatternId: Record<string, PrebindingData>;
  fetchedLevel1Entries: Array<Entry>;
}) {
  const deepPrebindingReferences: Array<DeepReference> = [];
  const dataSource = experienceEntry.fields.dataSource;
  const { children } = experienceEntry.fields.componentTree;

  treeVisit(
    {
      definitionId: 'root',
      parameters: {},
      children,
    } as ComponentTreeNode,
    (node) => {
      if (!node.parameters) return;

      for (const [parameterId, parameterValue] of Object.entries(node.parameters)) {
        const dataSourceKey = parameterValue.path.split('/')[1];
        const headEntryLink = dataSource[dataSourceKey];
        if (!headEntryLink) continue;
        if (headEntryLink.sys.linkType !== 'Entry') continue;
        const headEntry = fetchedLevel1Entries.find(
          (entry) => entry.sys.id === headEntryLink.sys.id,
        );
        if (!headEntry) continue;

        const headEntryContentTypeId = headEntry.sys.contentType.sys.id;

        // if experience, we don't have any hoisted data on the given experienceEntry
        // and we have to lookup the pattern instead
        const variableMappings = getTargetPatternMappingsForParameter({
          fetchedPatterns,
          prebindingDataByPatternId,
          patternNodeDefinitionId: node.definitionId,
          parameterId,
        });

        if (!variableMappings) continue;

        for (const mappingData of Object.values(variableMappings)) {
          const targetMapping = mappingData.pathsByContentType[headEntryContentTypeId];
          if (!targetMapping) continue;
          // mapping doesn't start with /uuid, but instead starts with /fields
          // so we add /uuid to make it match the binding path format
          const path = `/${dataSourceKey}${targetMapping.path}`;
          if (!isDeepPath(path)) continue;

          deepPrebindingReferences.push(
            DeepReference.from({
              path,
              dataSource,
            }),
          );
        }
      }
    },
  );

  return deepPrebindingReferences;
}

export function gatherDeepPrebindingReferencesFromPatternEntry({
  patternEntry,
  fetchedPatterns,
  prebindingDataByPatternId,
  fetchedLevel1Entries,
}: {
  patternEntry: ExperienceEntry;
  fetchedPatterns: Array<ExperienceEntry>;
  prebindingDataByPatternId: Record<string, PrebindingData>;
  fetchedLevel1Entries: Array<Entry>;
}) {
  const deepPrebindingReferences: Array<DeepReference> = [];
  // patterns can't have parameters in their CDA/CMA JSON, so we can generate random ids here
  const { dataSource, parameters } = generateDefaultDataSourceForPrebindingDefinition(
    patternEntry.fields.componentSettings?.prebindingDefinitions,
  );

  for (const [parameterId, parameterValue] of Object.entries(parameters)) {
    const dataSourceKey = parameterValue.path.split('/')[1];
    const headEntryLink = dataSource[dataSourceKey];
    if (!headEntryLink) continue;
    if (headEntryLink.sys.linkType !== 'Entry') continue;

    const headEntry = fetchedLevel1Entries.find((entry) => entry.sys.id === headEntryLink.sys.id);
    if (!headEntry) continue;

    const headEntryContentTypeId = headEntry.sys.contentType.sys.id;

    const variableMappings = getTargetPatternMappingsForParameter({
      fetchedPatterns,
      prebindingDataByPatternId,
      patternNodeDefinitionId: patternEntry.sys.id,
      parameterId,
    });

    if (!variableMappings) continue;

    for (const mappingData of Object.values(variableMappings)) {
      const targetMapping = mappingData.pathsByContentType[headEntryContentTypeId];
      if (!targetMapping) continue;
      // mapping doesn't start with /uuid, but instead starts with /fields
      // so we add /uuid to make it match the binding path format
      const path = `/${dataSourceKey}${targetMapping.path}`;
      if (!isDeepPath(path)) continue;

      deepPrebindingReferences.push(
        DeepReference.from({
          path,
          dataSource,
        }),
      );
    }
  }
  return deepPrebindingReferences;
}

/**
 * used in editor mode. for delivery mode see `gatherDeepReferencesFromExperienceEntry`
 */
export function gatherDeepReferencesFromTree(
  startingNode: ExperienceTreeNode,
  dataSource: ExperienceDataSource,
  getEntityFromLink: EntityStoreBase['getEntityFromLink'],
): DeepReference[] {
  const deepReferences: Array<DeepReference> = [];

  treeVisit(startingNode, (node) => {
    if (!node.data.props) return;

    for (const [, variableMapping] of Object.entries(node.data.props)) {
      if (variableMapping.type !== 'BoundValue') continue;

      if (isDeepPath(variableMapping.path)) {
        deepReferences.push(
          DeepReference.from({
            path: variableMapping.path,
            dataSource,
          }),
        );
      } else if (isPreboundProp(variableMapping) && isDeepPrebinding(variableMapping)) {
        const getEntityByDataSourceKey = (dataSourceKey: string) => {
          const entityLink = dataSource[dataSourceKey];
          if (!entityLink) return undefined;
          return getEntityFromLink(entityLink);
        };

        const deepPrebindingPath = getPrebindingPathBySourceEntry(
          variableMapping,
          getEntityByDataSourceKey,
        );
        if (!deepPrebindingPath) continue;
        deepReferences.push(
          DeepReference.from({
            path: deepPrebindingPath,
            dataSource,
          }),
        );
      }
    }
  });

  return deepReferences;
}
