import React from 'react';

export default function DetailPanel({ node }) {
  if (!node)
    return (
      <div className='w-72 bg-white border rounded p-4'>
        <div className='text-sm font-medium'>Select a step</div>
        <div className='text-gray-500 mt-2'>
          Click a node to edit its settings.
        </div>
      </div>
    );
  return (
    <div className='w-72 bg-white border rounded p-4 flex flex-col'>
      <div className='flex justify-between items-center mb-2'>
        <div className='font-semibold'>
          {node.data.type === 'trigger' ? 'Trigger:' : ''} {node.data.label}
        </div>
        <div className='text-xs text-blue-600 cursor-pointer'>Change</div>
      </div>
      <div className='text-sm mb-4'>When trigger condition start</div>
      <select className='border rounded p-2 mb-2'>
        <option>Select Condition</option>
      </select>
      <div className='mt-auto flex gap-2'>
        <button className='flex-1 border rounded px-3 py-1 text-sm'>
          Cancel
        </button>
        <button className='flex-1 bg-indigo-600 text-white rounded px-3 py-1 text-sm'>
          Save
        </button>
      </div>
    </div>
  );
}
