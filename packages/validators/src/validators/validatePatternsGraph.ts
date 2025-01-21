import Graph from 'graphology';
import { hasCycle, topologicalSort } from 'graphology-dag';
import { ValidatorReturnValue } from './ValidatorReturnValue';
import { CodeNames as ErrorCodes, ContentfulErrorDetails } from '../utils/zodToContentfulError';

interface Link<T extends string> {
  sys: {
    type: 'Link';
    linkType: T;
    id: string;
  };
}

const createGraph = (patternsById: Map<string, any>, localeCode: string): Graph => {
  const graph = new Graph();
  for (const [id, pattern] of patternsById.entries()) {
    const usedComponents = (pattern.fields.usedComponents?.[localeCode] as Link<'Entry'>[]) || [];
    const usedComponentIds = usedComponents.map((component) => component.sys.id);
    graph.addNode(id);
    for (const usedId of usedComponentIds) {
      graph.addEdge(id, usedId, { directed: true });
    }
  }
  return graph;
};

const calculateMaxDepth = (graph: Graph): number => {
  // Step 1: Perform a topological sort
  const sortedNodes = topologicalSort(graph);

  // Step 2: Compute the maximum depth
  const depths: Record<string, number> = {}; // Store the depth of each node
  sortedNodes.forEach((node) => {
    depths[node] = 0; // Initialize all depths to 0
  });

  sortedNodes.forEach((node) => {
    const neighbors = graph.outNeighbors(node); // Get outgoing neighbors
    neighbors.forEach((neighbor) => {
      depths[neighbor] = Math.max(depths[neighbor], depths[node] + 1);
    });
  });

  // The maximum depth is the highest value in the depths object
  return Math.max(...Object.values(depths));
};

export const validatePatternsGraph = (
  patternsById: Map<string, any>,
  localeCode: string,
): ValidatorReturnValue => {
  const errors: ContentfulErrorDetails[] = [];

  const graph = createGraph(patternsById, localeCode);

  // Check for cycles
  if (hasCycle(graph)) {
    errors.push({
      details: 'Pattern entry causes a direct or transitive recursion on other pattern entries.',
      name: ErrorCodes.Custom,
      path: ['usedComponents'],
    });
    return { success: false, errors };
  }

  if (calculateMaxDepth(graph) > 3) {
    errors.push({
      details:
        'Pattern entry exceeds the maximum nesting depth when referencing other pattern entries.',
      name: ErrorCodes.Custom,
      path: ['usedComponents'],
    });
    return { success: false, errors };
  }

  return { success: true };
};
