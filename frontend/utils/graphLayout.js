/**
 * Calculate 3D positions for graph nodes using force-directed layout
 */

/**
 * Generate spherical positions for related nodes around a center
 * @param {number} count - Number of nodes to position
 * @param {number} radius - Sphere radius
 * @param {Array} centerPos - [x, y, z] center position
 */
export const sphericalLayout = (count, radius = 4, centerPos = [0, 0, 0]) => {
  const positions = [];
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / count);
    const phi = (2 * Math.PI * i) / goldenRatio;

    const x = centerPos[0] + radius * Math.sin(theta) * Math.cos(phi);
    const y = centerPos[1] + radius * Math.sin(theta) * Math.sin(phi);
    const z = centerPos[2] + radius * Math.cos(theta);

    positions.push([x, y, z]);
  }

  return positions;
};

/**
 * Generate random positions in a sphere
 */
export const randomSpherePositions = (count, radius = 5) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = radius * Math.cbrt(Math.random());

    positions.push([
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    ]);
  }
  return positions;
};

/**
 * Assign 3D positions to nodes
 * @param {Array} nodes - Graph nodes
 * @param {string|null} centralNodeId - ID of the center node
 */
export const assignNodePositions = (nodes, centralNodeId = null) => {
  const positioned = {};

  // Find center node
  const centerNode = centralNodeId
    ? nodes.find(n => n.id === centralNodeId)
    : nodes[0];

  if (!centerNode) return positioned;

  // Center node at origin or its existing position
  positioned[centerNode.id] = centerNode.position || [0, 0, 0];

  // Position related nodes
  const relatedNodes = nodes.filter(n => n.id !== centerNode.id);
  const positions = sphericalLayout(relatedNodes.length, 5, positioned[centerNode.id]);

  relatedNodes.forEach((node, i) => {
    positioned[node.id] = node.position || positions[i];
  });

  return positioned;
};

/**
 * Get color for a category
 */
export const getCategoryColor = (category) => {
  const colors = {
    science: '#00D4FF',
    technology: '#4A9EFF',
    history: '#FFB347',
    philosophy: '#DDA0DD',
    arts: '#FF6B9D',
    nature: '#50C878',
    society: '#FF8C69',
    mathematics: '#00CED1',
    other: '#A8A8FF'
  };
  return colors[category] || colors.other;
};

/**
 * Lerp between two values
 */
export const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Calculate distance between two 3D points
 */
export const distance3D = (p1, p2) => {
  return Math.sqrt(
    Math.pow(p2[0] - p1[0], 2) +
    Math.pow(p2[1] - p1[1], 2) +
    Math.pow(p2[2] - p1[2], 2)
  );
};
