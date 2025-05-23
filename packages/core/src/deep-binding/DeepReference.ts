import {
  ExperienceTreeNode,
  ExperienceDataSource,
  DataSourceEntryValueType,
  ExperienceEntry,
  ComponentTreeNode,
  Link,
} from '@/types';
import { isDeepPath, parseDataSourcePathWithL1DeepBindings } from '@/utils/pathSchema';
import { treeVisit } from '@/utils/treeTraversal';
import { isLink } from '@/utils/isLink';
import type { EntityFromLink } from '@/entity';

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
    this.entityId = dataSource[key].sys.id;
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

      for (const [, variableMapping] of Object.entries(node.variables)) {
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

export function gatherDeepReferencesFromTree(
  startingNode: ExperienceTreeNode,
  dataSource: ExperienceDataSource,
): DeepReference[] {
  const deepReferences: Array<DeepReference> = [];

  treeVisit(startingNode, (node) => {
    if (!node.data.props) return;

    for (const [, variableMapping] of Object.entries(node.data.props)) {
      if (variableMapping.type !== 'BoundValue') continue;
      if (!isDeepPath(variableMapping.path)) continue;

      deepReferences.push(
        DeepReference.from({
          path: variableMapping.path,
          dataSource,
        }),
      );
    }
  });

  return deepReferences;
}
