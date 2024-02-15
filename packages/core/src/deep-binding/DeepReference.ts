import {
  CompositionComponentNode,
  CompositionDataSource,
  CompositionNode,
  DataSourceEntryValueType,
  ExperienceEntry,
  Link,
} from '@/types';
import { isDeepPath, parseDataSourcePathWithL1DeepBindings } from '@/utils/pathSchema';
import { treeVisit } from '@/utils/treeTraversal';
import { isLink } from '@/utils/isLink';
import { EntityStoreBase } from '@/entity/EntityStoreBase';

type DeepReferenceOpts = {
  path: string;
  dataSource: CompositionDataSource;
};

export class DeepReference {
  public entityId: string;
  public entityLink: DataSourceEntryValueType;
  public field: string;
  public fieldLocaleQualifier: string | null;
  public referentField: string;
  public referentLocaleQualifier: string | null;
  public originalPath: string;

  constructor({ path, dataSource }: DeepReferenceOpts) {
    const { key, field, fieldLocaleQualifier, referentField, referentLocaleQualifier } =
      parseDataSourcePathWithL1DeepBindings(path);

    this.originalPath = path;
    this.entityId = dataSource[key].sys.id;
    this.entityLink = dataSource[key];
    this.field = field;
    this.fieldLocaleQualifier = fieldLocaleQualifier;
    this.referentField = referentField;
    this.referentLocaleQualifier = referentLocaleQualifier;
  }

  get headEntityId() {
    return this.entityId;
  }

  /**
   * Extracts referent from the path, using EntityStore as source of
   * entities during the resolution path.
   * TODO: should it be called `extractLeafReferent` ? or `followToLeafReferent`
   */
  extractReferent(entityStore: EntityStoreBase): Link<'Asset' | 'Entry'> | undefined {
    const headEntity = entityStore.getEntityFromLink(this.entityLink);

    const maybeReferentLink = headEntity!.fields[this.field] as
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
  experienceEntry: ExperienceEntry
): DeepReference[] {
  const deepReferences: Array<DeepReference> = [];
  const dataSource = experienceEntry.fields.dataSource;

  // We create "synthetic" node so that we have to make sure
  // to start with the root node which is
  // shaped consistently as rest of CompositionNodes
  const syntheticStartingNode: CompositionNode = {
    definitionId: 'root',
    variables: {},
    children: experienceEntry.fields.componentTree.children,
  };

  treeVisit(syntheticStartingNode, (node) => {
    if (!node.variables) return;

    for (const [, variableMapping] of Object.entries(node.variables)) {
      if (variableMapping.type !== 'BoundValue') continue;
      if (!isDeepPath(variableMapping.path)) continue;

      deepReferences.push(
        DeepReference.from({
          path: variableMapping.path,
          dataSource,
        })
      );
    }
  });

  return deepReferences;
}

export function gatherDeepReferencesFromTree(
  startingNode: CompositionComponentNode,
  dataSource: CompositionDataSource
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
        })
      );
    }
  });

  return deepReferences;
}
