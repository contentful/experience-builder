import {
  CompositionComponentNode,
  CompositionDataSource,
  CompositionNode,
  DataSourceEntryValueType,
  ExperienceEntry,
} from '@/types';
import { parseDataSourcePathWithDeepBindings } from '@/utils/schema';
import { treeVisit } from '@/utils/treeTraversal';

type DeepReferenceOpts = {
  path: string;
  dataSource: CompositionDataSource;
};

export class DeepReference {
  public entityId: string;
  public entityLink: DataSourceEntryValueType;
  public field: string;
  public referentField: string;
  public referentLocaleQualifier: string;

  constructor({ path, dataSource }: DeepReferenceOpts) {
    const { key, field, referentField, referentLocaleQualifier } =
      parseDataSourcePathWithDeepBindings(path);

    this.entityId = dataSource[key].sys.id;
    this.entityLink = dataSource[key];
    this.field = field;
    this.referentField = referentField;
    this.referentLocaleQualifier = referentLocaleQualifier;
  }

  get headEntityId() {
    return this.entityId;
  }

  get fqid() {
    return `cf://${this.entityId}/${this.field}->${this.referentField}/${this.referentLocaleQualifier}`;
  }

  static from(opt: DeepReferenceOpts) {
    return new DeepReference(opt);
  }

  static isDeepPath(path: string) {
    return path.includes('->');
  }
}

export function gatherDeepReferencesFromExperienceEntry(
  experienceEntry: ExperienceEntry
): DeepReference[] {
  // We create "synthetic" node so that we have to make sure
  // to start with the root node which is
  // shaped consistently as rest of CompositionNodes
  const syntheticStartingNode: CompositionNode = {
    definitionId: 'root',
    variables: {},
    children: experienceEntry.fields.componentTree.children,
  };
  return gatherDeepReferencesFromComposition(
    syntheticStartingNode,
    experienceEntry.fields.dataSource
  );
}

export function gatherDeepReferencesFromComposition(
  startingNode: CompositionNode,
  dataSource: CompositionDataSource
): DeepReference[] {
  const deepReferences: Array<DeepReference> = [];

  treeVisit(startingNode, (node) => {
    if (!node.variables) return;

    for (const [, variableMapping] of Object.entries(node.variables)) {
      if (variableMapping.type !== 'BoundValue') continue;
      if (!DeepReference.isDeepPath(variableMapping.path)) continue;

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
      if (!DeepReference.isDeepPath(variableMapping.path)) continue;

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
