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

  const { data, type } = node;

  console.log('data', data);

  return (
    <div className='w-72 bg-white border rounded p-4 flex flex-col'>
      {/* Header */}
      <div className='flex justify-between items-center mb-2'>
        {/* <div className='font-semibold'>{data.label}</div> */}
        <div className='text-xs text-blue-600 cursor-pointer'>Change</div>
      </div>

      {/* Config UI based on type */}
      {type === 'customHome' && (
        <>
          <div className='text-sm mb-2'>When trigger condition starts</div>
          <select className='border rounded p-2 mb-4'>
            <option>Select Condition</option>
            <option>User Subscribed</option>
            <option>Email Opened</option>
          </select>
        </>
      )}

      {type === 'custom' && (
        <>
          <div className='text-sm mb-2'>Configure Step</div>
          {data.type === 'tags' && (
            <>
              <label className='text-xs mb-1'>Choose tag:</label>
              <select className='border rounded p-2 mb-4'>
                <option>Select Tag</option>
                <option>New User</option>
                <option>VIP</option>
              </select>
            </>
          )}
          {data.type === 'send' && (
            <>
              <label className='text-xs mb-1'>Email Content:</label>
              <textarea
                className='border rounded p-2 mb-4'
                rows={4}
                placeholder='Write email...'
              />
            </>
          )}
          {data.type === 'time' && (
            <>
              <label className='text-xs mb-1'>Delay (minutes):</label>
              <input
                type='number'
                className='border rounded p-2 mb-4'
                placeholder='Enter minutes'
              />
            </>
          )}
          {/* Add more node types if needed */}
        </>
      )}

      {/* Footer */}
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
