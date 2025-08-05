import dagre from 'dagre';

const defaultNodeWidth = 200;
const defaultNodeHeight = 60;
const homeNodeWidth = 300;
const homeNodeHeight = 200;

export const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 100, nodesep: 50 });

  nodes.forEach((node) => {
    if (node.id === 'home') {
      dagreGraph.setNode(node.id, {
        width: homeNodeWidth,
        height: homeNodeHeight,
      });
    } else {
      dagreGraph.setNode(node.id, {
        width: defaultNodeWidth,
        height: defaultNodeHeight,
      });
    }
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x:
        nodeWithPosition.x -
        (node.id === 'home' ? homeNodeWidth : defaultNodeWidth) / 2,
      y:
        nodeWithPosition.y -
        (node.id === 'home' ? homeNodeHeight : defaultNodeHeight) / 2,
    };
  });

  return { nodes, edges };
};
