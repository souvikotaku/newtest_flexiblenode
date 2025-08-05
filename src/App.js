import { useState } from 'react';
import HierarchyGraph from './components/HierarchyGraph';
import ControlPanel from './components/ControlPanel';

export default function App() {
  const [sections, setSections] = useState([
    'Testimonials',
    'Features',
    'CTA',
    'Hero',
    'Footer',
  ]);

  return (
    <div className='p-6 min-h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold mb-6'>Website Structure</h1>
      <HierarchyGraph sections={sections} setSections={setSections} />
      <ControlPanel sections={sections} setSections={setSections} />
    </div>
  );
}
