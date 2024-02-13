import {
  CompositionComponentNode,
  CompositionDataSource,
  CompositionNode,
  DataSourceEntryValueType,
  ExperienceEntry,
} from '@/types';
import { isDeepPath, parseDataSourcePathWithL1DeepBindings } from '@/utils/schema';
import { treeVisit } from '@/utils/treeTraversal';

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

  constructor({ path, dataSource }: DeepReferenceOpts) {
    const { key, field, fieldLocaleQualifier, referentField, referentLocaleQualifier } =
      parseDataSourcePathWithL1DeepBindings(path);

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
  static from(opt: DeepReferenceOpts) {
    return new DeepReference(opt);
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
