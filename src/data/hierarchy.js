export const pageHierarchy = [
  { id: 'home', label: 'Home', parent: null },
  { id: 'about', label: 'About', parent: 'home' },
  { id: 'services', label: 'Services', parent: 'home' },
  { id: 'blog', label: 'Blog', parent: 'home' },
  { id: 'contact', label: 'Contact', parent: 'home' },
  { id: 'service1', label: 'Service Detail 1', parent: 'services' },
  { id: 'service2', label: 'Service Detail 2', parent: 'services' },
  { id: 'blog1', label: 'Blog Post 1', parent: 'blog' },
  { id: 'blog2', label: 'Blog Post 2', parent: 'blog' },
  { id: 'author', label: 'Author Page', parent: 'blog' },
  { id: 'location', label: 'Location Info', parent: 'contact' },
  { id: 'support', label: 'Support Page', parent: 'contact' },
];
