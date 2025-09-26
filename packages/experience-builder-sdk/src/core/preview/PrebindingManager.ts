import {
  ExperienceComponentSettings,
  ParameterDefinition,
  VariableMapping,
} from '@contentful/experiences-core/types';

const NODE_ID_SEPARATOR = '---'; // separator used to separate pattern levels in deseralizePatternNode

export type ParameterDefinitionWithParameterId = {
  parameterId: string;
  parameter: ParameterDefinition;
};
type ParameterOverride = {
  overwrittenByParamId: string;
  originalNodeIdToOverride: string;
  indexedParentPatternNodeId: string;
};

/**
 * PrebindingManager utility class for resolving parameter bindings across nested patterns.
 *
 * The core approach is to first resolve the top-level parameterId using `getParameterIdByNodeId`,
 * which uses the paramIdToOverwriteIdMap, set when storing pre-binding based on the passToNodes chain to determine which parameter in the parent pattern
 * overrides a given parameterId (with some additionally workaround due to node ID renaming for patterns).
 * Once the owning top-level `parameterId` is found, we can follow the `passToNodes` chain back
 * down to retrieve all nested overrides — including parameter definitions, allowed content types,
 * and default sources — up to three levels deep.
 *
 * ## Lifecycle
 * This utility class currently uses static state, with Zustand stores supplementing the “latest” data
 * for root-level patterns data — for example, when overwriting content types on nested patterns or binding
 * fields on simple patterns. If we need the override mappings to be reactive, we could easily move
 * the full override chain tracking into Zustand but currently we can rely on the pattern definition
 * stores we have currently.
 *
 * The state is populated during deserialization, where we call `storePrebindingDefinitions` for each
 * pattern node. It is ready to be consumed at each level as nodes are deserialized top-down:
 * 1. Pattern C (Template Pattern)
 * 2. Pattern B (Nested Pattern)
 * 3. Pattern A (Simple Pattern)
 *
 * At each level, accessing overrides is possible:
 * - Pattern C has everything it needs once deserialized with its own parameters
 * - Pattern B has everything it needs once deserialized, with its own parameters possibly overridden by C
 * - Pattern A has its own parameters and possiblle overrites by B and/or C
 *
 * After actions that modify patterns without re-deserializing the tree — such as duplication,
 * deletion, or detachment — this state must be kept up to date via storePrebindingDefinitions
 * or storeParameterDefinitions if only parameter definitions are updated.
 *
 * ## Core Data Structures
 *
 *  - prebindingDefinitions           - A collection of all prebinding definitions aggregated
 *                                       from the parent pattern down to all nested patterns.
 *
 *  - prebindingDefinitionIdsByNodeId - Same as above, but indexed by `nodeId`. This allows us
 *                                       to easily find the prebinding definition id for a given node ID.
 *
 *  - parameterDefinitionsById        - A collection of all parameter definitions aggregated
 *                                       from the parent pattern down to nested patterns.
 *
 *  - variableMappingByPatternId      - A collection of all variable mappings aggregated from
 *                                       the parent pattern down to nested patterns, indexed by
 *                                       `patternId` for efficient access.
 *
 *  - newToOriginalNodeIdMap          - When deserializing pattern child nodes, we replace their
 *                                       node IDs with new ones based on their location inside the
 *                                       pattern. This prevents conflicts when multiple instances
 *                                       of the same pattern exist. The issue is that prebinding
 *                                       `passToNodes` resolution requires the original node ID.
 *                                       This map allows us to retrieve it to follow the chain.
 *
 *  - paramIdToOverwriteIdMap         - Tracks parameter ID overrides through the `passToNodes`
 *                                       chain, allowing us to resolve overrides correctly from
 *                                       the top-level parameter down to the lowest-level.
 */
export class PrebindingManager {
  private static prebindingDefinitions: Map<
    string,
    NonNullable<ExperienceComponentSettings['prebindingDefinitions']>[number]
  > = new Map();
  private static prebindingDefinitionIdsByNodeId: Map<string, string[]> = new Map();
  private static parameterDefinitionsById: Map<string, ParameterDefinitionWithParameterId> =
    new Map();
  private static parameterDefinitionsByNodeId: Map<string, ParameterDefinitionWithParameterId[]> =
    new Map();
  private static variableMappingByPatternId: Map<string, Record<string, VariableMapping>> =
    new Map();
  private static newToOriginalNodeIdMap = new Map<string, string>();
  private static paramIdToOverwriteIdMap = new Map<string, Array<ParameterOverride>>();

  /**
   * Links new node IDs to original node IDs
   * - This is used to track the original node IDs for pattern instances as we change them when deserializing pattern nodes.
   * @param newNodeId
   * @param originalNodeId
   */
  public static linkOriginalNodeIds(newNodeId: string, originalNodeId: string) {
    PrebindingManager.newToOriginalNodeIdMap.set(newNodeId, originalNodeId);
  }

  /**
   * Initializes the pattern editor manager by storing the definitions during deserialization
   * for the root pattern and all nested patterns.
   *
   * @param nodeId - The ID of the pattern node.
   * @param patternEntryId - The ID of the pattern entry from the patterns store.
   * @param prebindingDefinitions - The prebinding definitions from the current pattern's component settings.
   */
  public static storePrebindingDefinitions(
    nodeId: string,
    patternEntryId: string,
    prebindingDefinitions: NonNullable<ExperienceComponentSettings['prebindingDefinitions']>,
  ) {
    for (const definition of prebindingDefinitions ?? []) {
      PrebindingManager.prebindingDefinitions.set(definition.id, { ...definition });
      PrebindingManager.prebindingDefinitionIdsByNodeId.set(nodeId, [definition.id]); // can only be one right now

      if (definition.variableMappings) {
        PrebindingManager.variableMappingByPatternId.set(
          patternEntryId,
          definition.variableMappings,
        );
      }
      // Store the parameter definitions for the node
      PrebindingManager.storeParameterDefinitions(nodeId, definition.parameterDefinitions || {});
    }
  }

  /**
   * Stores parameter definitions for a given nodeId.
   * @param nodeId - The ID of the node to store parameter definitions for.
   * @param parameterDefinitions - The parameter definitions to store.
   */
  public static storeParameterDefinitions(
    nodeId: string,
    parameterDefinitions?: Record<string, ParameterDefinition>,
  ) {
    // Reset the list of parameter definitions for the nodeId
    PrebindingManager.parameterDefinitionsByNodeId.set(nodeId, []);
    const updatedParameterDefinitionsByNodeId: ParameterDefinitionWithParameterId[] = [];

    for (const [parameterId, parameter] of Object.entries(parameterDefinitions || {})) {
      PrebindingManager.parameterDefinitionsById.set(parameterId, {
        parameterId,
        parameter,
      });

      if (parameter.passToNodes) {
        const { parameterId: paramIdToOverwrite, nodeId: targetNodeId } =
          parameter.passToNodes[0] ?? {};

        if (paramIdToOverwrite) {
          const existing = PrebindingManager.paramIdToOverwriteIdMap.get(paramIdToOverwrite) ?? [];
          const hasMatchingOverride = existing.some(
            (it) =>
              it.overwrittenByParamId === parameterId &&
              it.originalNodeIdToOverride === targetNodeId &&
              it.indexedParentPatternNodeId === nodeId,
          );

          // Only add the override if it doesn't already exist to save duplicates
          if (!hasMatchingOverride) {
            PrebindingManager.paramIdToOverwriteIdMap.set(paramIdToOverwrite, [
              ...existing,
              {
                overwrittenByParamId: parameterId,
                originalNodeIdToOverride: targetNodeId,
                indexedParentPatternNodeId: nodeId,
              },
            ]);
          }
        }
      }
      updatedParameterDefinitionsByNodeId.push({ parameterId, parameter });
    }
    PrebindingManager.parameterDefinitionsByNodeId.set(nodeId, updatedParameterDefinitionsByNodeId);
  }

  /**
   * Resolves the top-level parameterId for a given nodeId.
   *
   * @param nodeId - The nodeId to resolve the parameterId for
   * @param useStoreParameters - Whether to use the zustand store parameters or not
   * @returns string | undefined - The resolved parameterId or undefined if not found
   **/
  public static getParameterIdByNodeId(nodeId: string): string | undefined {
    const nativeParameterDefinitionForNodeId =
      PrebindingManager.getNativeParameterDefinitionByNodeId(nodeId);

    if (!nativeParameterDefinitionForNodeId) {
      return undefined;
    }
    const hoistedParameterId = PrebindingManager.getHoistedIdForParameterId(
      nativeParameterDefinitionForNodeId?.parameterId,
      nodeId,
    );

    return hoistedParameterId;
  }

  /* Returns the parameter definitions from a parameterId
   * @param parameterId - The parameter to resolve all levels for
   * @param useStoreParameters - Whether to use the zustand store parameters or not
   * @returns [l1ParameterDefinitions, l2ParameterDefinitions, l3ParameterDefinitions]: Array of parameter definitions for each level
   */
  public static getParameterDefinitionsByParameterId(
    parameterId: string,
  ): (ParameterDefinitionWithParameterId | undefined)[] | undefined {
    const l1Definition = PrebindingManager.parameterDefinitionsById.get(parameterId);

    const l1PassToNode = (l1Definition?.parameter?.passToNodes || [])[0];
    // Level 2
    const l2Definition = PrebindingManager.parameterDefinitionsById.get(l1PassToNode?.parameterId);
    const l2PassToNode = (l2Definition?.parameter?.passToNodes || [])[0];
    let l3Definition: ParameterDefinitionWithParameterId | undefined;
    // Level 3
    if (l2PassToNode) {
      // If the child definition has passToNodes, we can look up the child parameter definition by its composite key
      l3Definition = PrebindingManager.parameterDefinitionsById.get(l2PassToNode?.parameterId);
    }
    // Return the definitions for all three levels unless they are all empty
    const definitions = [l1Definition, l2Definition, l3Definition];
    if (!definitions || !definitions.filter(Boolean).length) {
      return undefined; // No definitions found
    }
    return definitions;
  }

  /**
   * Returns all parameter definitions defined on the pattern of the given nodeId OR the pattern, wrapping the given nodeId
   */
  public static getAllParameterDefinitionsForNodeId(nodeId: string) {
    return Object.fromEntries(
      (PrebindingManager.parameterDefinitionsByNodeId.get(nodeId) ?? []).map(
        ({ parameterId, parameter }) => [parameterId, parameter],
      ),
    );
  }

  /**
   * Return all parameter ID's on a pattern by NodeId
   * @param nodeId - The nodeId to return params for
   * @returns string[] An array of parameter IDs or undefined
   */
  public static getAllParameterIdsByNodeId(nodeId: string): string[] | undefined {
    return Object.keys(PrebindingManager.getAllParameterDefinitionsForNodeId(nodeId));
  }

  /**
   * Get the highest level overriding parameterId for a given parameterId + nodeId combination
   * @param parameterId - The parameter to resolve
   * @param indexedNodeId - The indexed node ID to resolve the parameterId for
   * @returns string - The resolved parameterId - will be from "root" in patterns or the parent pattern node in experiences
   */
  public static getHoistedIdForParameterId(parameterId: string, indexedNodeId: string): string {
    let currentParamId = parameterId;
    let currentIndexedNodeId = indexedNodeId;
    let currentOriginalNodeId: string | undefined =
      PrebindingManager.newToOriginalNodeIdMap.get(indexedNodeId) ?? indexedNodeId;
    let override: ParameterOverride | undefined;

    do {
      const overrides = PrebindingManager.paramIdToOverwriteIdMap.get(currentParamId) ?? [];
      const splitByDash = currentIndexedNodeId.split(NODE_ID_SEPARATOR);
      override = overrides.find(
        (it) =>
          it.originalNodeIdToOverride === currentOriginalNodeId &&
          ((splitByDash.length > 1 &&
            currentIndexedNodeId.includes(it.indexedParentPatternNodeId)) ||
            (splitByDash.length === 1 && it.indexedParentPatternNodeId === 'root')),
      );
      if (override) {
        const { overwrittenByParamId, indexedParentPatternNodeId } = override;
        currentParamId = overwrittenByParamId;
        currentIndexedNodeId = indexedParentPatternNodeId;
        currentOriginalNodeId =
          PrebindingManager.newToOriginalNodeIdMap.get(indexedParentPatternNodeId) ??
          indexedParentPatternNodeId;
      }
    } while (override);

    return currentParamId;
  }

  /**
   * Retrieves the native parameter definition for a given nodeId. ie one without passToNodes on the node.
   * @param nodeId - The nodeId to retrieve the native parameter definition for
   * @returns The native parameter definition for the given nodeId, or undefined if not found
   */
  public static getNativeParameterDefinitionByNodeId(
    nodeId: string,
  ): ParameterDefinitionWithParameterId | undefined {
    const parameterDefinitionsForNodeId =
      PrebindingManager.parameterDefinitionsByNodeId.get(nodeId);
    return PrebindingManager.extractNativeParameterDefinition(parameterDefinitionsForNodeId);
  }

  private static extractNativeParameterDefinition(
    parameterDefinitions: ParameterDefinitionWithParameterId[] | undefined,
  ): ParameterDefinitionWithParameterId | undefined {
    const { parameterId, parameter } =
      parameterDefinitions?.find((it) => !it.parameter.passToNodes?.length) || {};
    if (!parameterId || !parameter) return;
    return {
      parameterId,
      parameter,
    };
  }

  /**
   * Resets all properties of the PrebindingManager class
   * triggered when we leave ExperienceBuilder back to experience folder view.
   **/
  public static reset() {
    PrebindingManager.prebindingDefinitions = new Map();
    PrebindingManager.parameterDefinitionsById = new Map();
    PrebindingManager.parameterDefinitionsByNodeId = new Map();
    PrebindingManager.variableMappingByPatternId = new Map();
    PrebindingManager.newToOriginalNodeIdMap = new Map();
    PrebindingManager.paramIdToOverwriteIdMap = new Map();
  }
}
