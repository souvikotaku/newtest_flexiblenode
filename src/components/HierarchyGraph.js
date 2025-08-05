import React, { useState, useCallback, useMemo, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import dagre from 'dagre';
import HomeSections from './HomeSections';
import DetailPanel from './DetailPanel';

// --- Layout Utility ---
const defaultNodeWidth = 200;
const defaultNodeHeight = 60;
const homeNodeWidth = 300;
const homeNodeHeight = 200;

export const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', ranksep: 30, nodesep: 30 });

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

// --- Custom Home Node ---
const CustomHomeNode = ({ data, id, selected }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMouseDown = (e) => {
    if (id === 'home') {
      e.stopPropagation();
    }
  };

  return (
    <div
      style={{
        padding: '15px',
        border: '2px solid #000',
        borderRadius: '8px',
        background: '#f9f9f9',
        width: '300px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        color: '#333',
      }}
      onMouseDown={handleMouseDown}
      className={selected ? 'ring-2 ring-indigo-500' : ''}
    >
      <Handle
        type='source'
        position='bottom'
        id='home-bottom'
        style={{
          bottom: '-5px',
          background: '#000',
          width: '10px',
          height: '10px',
        }}
      />
      <div style={{ fontWeight: 'bold', marginBottom: '15px' }}>
        {data.label}
      </div>
      <div className='relative'>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          className='text-gray-500 hover:text-gray-800'
        >
          ⋮
        </button>
        {menuOpen && (
          <div
            className='absolute right-0 top-full mt-1 bg-white border rounded shadow-sm text-xs z-10'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='px-3 py-1 hover:bg-gray-100 cursor-pointer'>
              Edit
            </div>
            <div className='px-3 py-1 hover:bg-gray-100 cursor-pointer'>
              Change
            </div>
            <div
              className='px-3 py-1 hover:bg-gray-100 cursor-pointer'
              onClick={() => {
                if (data.onDeleteConnection) {
                  data.onDeleteConnection(id);
                }
                setMenuOpen(false);
              }}
            >
              Delete Connection
            </div>
          </div>
        )}
      </div>
      {/* Uncomment if HomeSections is needed */}
      {/* {id === 'home' && (
        <div onMouseDown={(e) => e.stopPropagation()}>
          <HomeSections />
        </div>
      )} */}
    </div>
  );
};

// --- Custom Node ---
const CustomNode = ({ data, selected }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  return (
    <div
      ref={menuRef}
      className={`relative p-3 bg-white rounded shadow-md w-44 text-xs cursor-pointer ${
        selected ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (data.onNodeClick) {
          data.onNodeClick(data.id);
        }
      }}
    >
      <Handle
        type='target'
        position='top'
        id='top'
        style={{
          top: '-5px',
          background: '#000',
          width: '10px',
          height: '10px',
        }}
      />
      <Handle
        type='source'
        position='bottom'
        id='bottom'
        style={{
          bottom: '-5px',
          background: '#000',
          width: '10px',
          height: '10px',
        }}
      />
      <div className='flex justify-between items-start'>
        <div className='font-semibold'>{data.label}</div>
        <div className='relative'>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            className='text-gray-500 hover:text-gray-800'
          >
            ⋮
          </button>
          {menuOpen && (
            <div
              className='absolute right-0 top-full mt-1 bg-white border rounded shadow-sm text-xs z-10'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='px-3 py-1 hover:bg-gray-100 cursor-pointer'>
                Edit
              </div>
              <div className='px-3 py-1 hover:bg-gray-100 cursor-pointer'>
                Change
              </div>
              <div
                className='px-3 py-1 hover:bg-gray-100 cursor-pointer'
                onClick={() => {
                  if (data.onDeleteConnection) {
                    data.onDeleteConnection(data.id);
                  }
                  setMenuOpen(false);
                }}
              >
                Delete Connection
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Node Types ---
const nodeTypes = {
  customHome: CustomHomeNode,
  custom: CustomNode,
};

// --- SidebarItem Component ---
const SidebarItem = ({ type, label }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-item-${type}-${label}`,
    data: { type, label },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-2 mb-2 bg-white rounded border cursor-move text-sm ${
        isDragging ? 'opacity-50 border-blue-500' : ''
      }`}
    >
      {label}
    </div>
  );
};

// --- Droppable Canvas Wrapper ---
const DroppableCanvas = ({ children, id }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div ref={setNodeRef} className='flex-1 h-[600px] rounded-lg shadow-lg'>
      {children}
    </div>
  );
};

// --- Main HierarchyGraph Component ---
export default function HierarchyGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const onNodeClick = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const onDeleteConnection = useCallback(
    (nodeId) => {
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setEdges]
  );

  // Initial nodes with only 'home'
  const initialNodes = useMemo(
    () => [
      {
        id: 'home',
        type: 'customHome',
        data: { label: 'Trigger', onNodeClick, onDeleteConnection, id: 'home' },
        position: { x: 0, y: 0 },
      },
    ],
    [onNodeClick, onDeleteConnection]
  );

  // Initial edges (empty for now)
  const initialEdges = useMemo(() => [], []);

  // Apply layout on initial load
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements([...initialNodes], initialEdges);
  }, [initialNodes, initialEdges]);

  useMemo(() => {
    setNodes(layoutedNodes);
  }, [layoutedNodes]);

  const onConnect = useCallback(
    (params) => {
      const newEdge = {
        ...params,
        style: {
          stroke: '#D000E5',
          strokeWidth: 2,
          filter: 'drop-shadow(0 0 5px rgba(208, 0, 229, 0.7))',
        },
        animated: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const handleDragStart = useCallback((event) => {
    setActiveItem(event.active.data.current);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      setActiveItem(null);

      if (event.over?.id !== 'reactflow-canvas') return;

      const { label, type } = event.active.data.current;

      const newNodeId = uuidv4();

      const newNode = {
        id: newNodeId,
        type: 'custom',
        data: {
          label,
          type,
          id: newNodeId,
          onNodeClick,
          onDeleteConnection,
        },
        position: { x: 0, y: 0 },
      };

      const lastNode =
        nodes.length > 0 ? nodes[nodes.length - 1] : initialNodes[0];
      const newEdge = {
        id: `e${lastNode.id}-${newNode.id}`,
        source: lastNode.id,
        target: newNode.id,
        style: {
          stroke: '#D000E5',
          strokeWidth: 2,
          filter: 'drop-shadow(0 0 5px rgba(208, 0, 229, 0.7))',
        },
        animated: true,
      };

      setNodes((nds) => {
        const updatedNodes = [...nds, newNode];
        const { nodes: layoutedNodes, edges: layoutedEdges } =
          getLayoutedElements(updatedNodes, [...edges, newEdge]);
        return layoutedNodes;
      });
      setEdges((eds) => [...eds, newEdge]);
    },
    [
      nodes,
      initialNodes,
      edges,
      setNodes,
      setEdges,
      onNodeClick,
      onDeleteConnection,
    ]
  );

  const handleDragCancel = useCallback(() => {
    setActiveItem(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className='flex gap-4'>
        {/* Sidebar */}
        <div className='w-60 bg-white border rounded p-4 flex-shrink-0'>
          <div className='font-bold mb-2'>Flow Elements</div>
          <div className='text-xs text-gray-500 mb-2'>Action</div>
          <SidebarItem type='send' label='Send Email' />
          <SidebarItem type='tags' label='Tags' />
          <div className='text-xs text-gray-500 my-2'>Delay</div>
          <SidebarItem type='time' label='Time Delay' />
          <SidebarItem type='wait' label='Wait Until' />
          <div className='text-xs text-gray-500 my-2'>Flow Condition</div>
          <SidebarItem type='branch' label='True/False Branch' />
          <SidebarItem type='multi' label='Multi Split' />
          <SidebarItem type='percent' label='Percentage Split' />
          <SidebarItem type='exit' label='Exit' />
        </div>

        {/* Canvas */}
        <DroppableCanvas id='reactflow-canvas'>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(e, node) => onNodeClick(node)}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background color='#aaa' gap={16} />
          </ReactFlow>
        </DroppableCanvas>

        {/* Right Detail Panel */}
        <div className='w-72'>
          <DetailPanel node={selectedNode} />
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeItem ? (
            <div className='p-2 bg-white rounded border shadow-lg cursor-grabbing text-sm'>
              {activeItem.label}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
