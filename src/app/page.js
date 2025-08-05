import HierarchyTree from '@/components/HierarchyTree';
import HomeNodeEditor from '@/components/HomeNodeEditor';

export default function Home() {
  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-6'>Page Hierarchy Editor</h1>
      <div className='flex gap-8'>
        <div className='w-2/3 h-[600px] border rounded-lg'>
          <HierarchyTree />
        </div>
        <div className='w-1/3 p-4 border rounded-lg'>
          <h2 className='text-lg font-semibold mb-4'>Home Page Sections</h2>
          <HomeNodeEditor />
        </div>
      </div>
    </div>
  );
}
