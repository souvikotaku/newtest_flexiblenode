import React from 'react';
import { pageHierarchy } from '../data/hierarchy';

export default function ControlPanel({ sections, setSections }) {
  const handleSave = () => {
    const data = {
      hierarchy: pageHierarchy,
      homeSections: sections,
    };
    localStorage.setItem('site-structure', JSON.stringify(data));
    alert('Structure saved to localStorage.');
  };

  const handleLoad = () => {
    const stored = localStorage.getItem('site-structure');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.homeSections) {
        setSections(parsed.homeSections);
        alert('Structure loaded from localStorage.');
      }
    } else {
      alert('No saved structure found.');
    }
  };

  const handleExport = () => {
    const data = localStorage.getItem('site-structure');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'site-structure.json';
      link.click();
    } else {
      alert('No data found to export.');
    }
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    fontFamily: '"VCR OSD Mono", monospace, sans-serif',
    fontSize: '1rem',
    color: '#FFF',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
  };

  return (
    <div className='mt-6 flex gap-4'>
      <button
        style={{
          ...buttonStyle,
          background: 'linear-gradient(145deg, #FF2A6D, #D000E5)', // Pink to purple gradient
          borderColor: '#05D9E8',
          boxShadow: '0 0 12px rgba(255, 42, 109, 0.7)',
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = '0 0 20px rgba(5, 217, 232, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = '0 0 12px rgba(255, 42, 109, 0.7)';
        }}
        onClick={handleSave}
      >
        Save
      </button>
      <button
        style={{
          ...buttonStyle,
          background: 'linear-gradient(145deg, #05D9E8, #FF2A6D)', // Blue to pink gradient
          borderColor: '#D000E5',
          boxShadow: '0 0 12px rgba(5, 217, 232, 0.7)',
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = '0 0 20px rgba(208, 0, 229, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = '0 0 12px rgba(5, 217, 232, 0.7)';
        }}
        onClick={handleLoad}
      >
        Load
      </button>
      <button
        style={{
          ...buttonStyle,
          background: 'linear-gradient(145deg, #D000E5, #05D9E8)', // Purple to blue gradient
          borderColor: '#FF2A6D',
          boxShadow: '0 0 12px rgba(208, 0, 229, 0.7)',
        }}
        onMouseEnter={(e) => {
          e.target.style.boxShadow = '0 0 20px rgba(255, 42, 109, 0.9)';
        }}
        onMouseLeave={(e) => {
          e.target.style.boxShadow = '0 0 12px rgba(208, 0, 229, 0.7)';
        }}
        onClick={handleExport}
      >
        Export JSON
      </button>
    </div>
  );
}
