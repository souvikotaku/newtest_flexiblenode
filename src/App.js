import { useState } from 'react';
import HierarchyGraph from './components/HierarchyGraph';

export default function App() {
  return (
    <div className='p-6 min-h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold mb-6'>Website Structure</h1>
      <HierarchyGraph />
    </div>
  );
}
