export const initialCategories = [
  { name: 'Application', count: 4 },
  { name: 'Data', count: 3 },
  { name: 'Technology', count: 5 },
  { name: 'Software', count: 4 },
  { name: 'Architecture', count: 2 },
  { name: 'Cybersecurity', count: 3 }
];

export const initialTags = [
  'React',
  'Nextjs',
  'Tailwind',
  'Technology',
  'Software',
  'Silicon',
  'Node.js',
  'Architecture',
  'AI & ML'
];

export const initialPosts = [
  {
    id: 'post-1',
    title: 'How to build an Application with modern Technology',
    slug: 'how-to-build-an-application-with-modern-technology',
    author: 'John Doe',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    categories: ['Application', 'Data'],
    tags: ['React', 'Technology', 'Software'],
    date: '04 Apr, 2026',
    published: true,
    views: 1420,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1000&auto=format&fit=crop&q=80',
    excerpt: 'Nemo vel ad consectetur namut rutrum ex, venenatis sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum sem. Ut bibendum lacus vestibulum maximus suscipit.',
    content: `
      <h2>The Shift Towards Modern Web Architectures</h2>
      <p>Modern application engineering requires a blend of high-performance rendering, secure authentication, and resilient state management. As user expectations rise, modular designs with sleek aesthetics and robust backends become paramount.</p>
      
      <h2>Key Components of Next-Gen Apps</h2>
      <p>Building scalable web software begins with selecting the right core foundation. Modern component frameworks combined with streamlined API communication enable seamless real-time experiences for users across desktop and mobile devices.</p>

      <blockquote>"Design is not just what it looks like and feels like. Design is how it works." – Steve Jobs</blockquote>

      <p>By leveraging dynamic dark mode interfaces, declarative UI frameworks, and robust analytics pipelines, developers can construct state-of-the-art platforms that engage users while keeping systems secure.</p>
    `
  },
  {
    id: 'post-2',
    title: 'Architecting Scalable Microservices and Cloud Infrastructures',
    slug: 'architecting-scalable-microservices-and-cloud-infrastructures',
    author: 'Sam Wilson',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    categories: ['Technology', 'Data'],
    tags: ['Architecture', 'Technology', 'Silicon'],
    date: '04 Apr, 2026',
    published: true,
    views: 980,
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
    excerpt: 'Nemo vel ad consectetur namut rutrum ex, venenatis sollicitudin urna. Aliquam erat volutpat. Integer eu ipsum sem. Ut bibendum lacus vestibulum maximus suscipit.',
    content: `
      <h2>Deconstructing Monoliths into Microservices</h2>
      <p>Transitioning from monolithic applications to microservice-oriented systems drastically improves deployment agility and fault tolerance. Each microservice manages its domain boundaries while communicating over low-latency protocols.</p>

      <h2>Resilience and Load Balancing</h2>
      <p>In a distributed ecosystem, zero-downtime deployments and intelligent traffic routing guarantee consistent client uptime even during traffic surges.</p>
    `
  },
  {
    id: 'post-3',
    title: 'Mastering Full-Stack Security and User Authentication',
    slug: 'mastering-full-stack-security-and-user-authentication',
    author: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    categories: ['Cybersecurity', 'Software'],
    tags: ['Software', 'Architecture', 'AI & ML'],
    date: '02 Apr, 2026',
    published: true,
    views: 2150,
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1000&auto=format&fit=crop&q=80',
    excerpt: 'Security is paramount in contemporary applications. Learn how token-based authentication and role-based access control protect critical application data.',
    content: `
      <h2>Implementing Defense in Depth</h2>
      <p>Securing enterprise applications requires defense at every layer: transport encryption, secure HTTP headers, token storage, and strict sanitization of user input.</p>

      <h2>Role-Based Access Control (RBAC)</h2>
      <p>By enforcing strict RBAC guards across frontend routes and API endpoints, unauthorized access attempts are neutralized before reaching sensitive resources.</p>
    `
  },
  {
    id: 'post-4',
    title: 'Exploring AI Integration in Modern Web Experiences',
    slug: 'exploring-ai-integration-in-modern-web-experiences',
    author: 'John Doe',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    categories: ['Technology', 'Software'],
    tags: ['AI & ML', 'Technology', 'Nextjs'],
    date: '30 Mar, 2026',
    published: true,
    views: 3100,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    excerpt: 'Artificial intelligence is redefining web interaction. From smart search to autonomous agents, explore how AI empowers web applications.',
    content: `
      <h2>Real-Time Natural Language Assistants</h2>
      <p>Integrating direct AI capabilities directly into browser applications enables instant content summarization, automated code generation, and intelligent search functionality.</p>
    `
  },
  {
    id: 'post-5',
    title: 'Optimizing Database Queries for High-Traffic Applications',
    slug: 'optimizing-database-queries-for-high-traffic-applications',
    author: 'Sam Wilson',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    categories: ['Data', 'Architecture'],
    tags: ['Data', 'Node.js', 'Architecture'],
    date: '28 Mar, 2026',
    published: true,
    views: 890,
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1000&auto=format&fit=crop&q=80',
    excerpt: 'Database bottlenecks can degrade application performance. Discover strategies for indexing, query caching, and connection pooling.',
    content: `
      <h2>The Importance of Strategic Indexing</h2>
      <p>Creating targeted indexes on frequently queried columns dramatically speeds up join and filter operations, keeping query execution times in milliseconds.</p>
    `
  },
  {
    id: 'post-6',
    title: 'The Art of Crafting High Performance Visual User Interfaces',
    slug: 'the-art-of-crafting-high-performance-visual-user-interfaces',
    author: 'Elena Rostova',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    categories: ['Application', 'Technology'],
    tags: ['React', 'Tailwind', 'Silicon'],
    date: '25 Mar, 2026',
    published: true,
    views: 1750,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80',
    excerpt: 'Combining glassmorphism, responsive grid layouts, and micro-animations to create captivating digital products.',
    content: `
      <h2>Aesthetic Consistency and Design Tokens</h2>
      <p>Using disciplined CSS design tokens ensures unified color, spacing, and typography across both dark and light modes, creating an elevated feel.</p>
    `
  },
  {
    id: 'post-7',
    title: 'Understanding Modern State Management in Frontend Applications',
    slug: 'understanding-modern-state-management-in-frontend-applications',
    author: 'John Doe',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    categories: ['Software', 'Application'],
    tags: ['React', 'Software'],
    date: '20 Mar, 2026',
    published: true,
    views: 1290,
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1000&auto=format&fit=crop&q=80',
    excerpt: 'State management is at the core of reactive web applications. Compare Context API, global stores, and server-state caching.',
    content: `
      <h2>Context vs Redux vs Signals</h2>
      <p>Selecting the right state container depends on state granularity and update frequency. Lightweight React Context is often ideal for global themes and user sessions.</p>
    `
  }
];

export const initialAnalytics = {
  totalViews: 12290,
  uniqueVisitors: 8430,
  totalPosts: 7,
  avgReadTime: '3.4 min',
  bounceRate: '24.2%',
  viewsOverTime: [
    { day: 'Mon', views: 1200, visitors: 850 },
    { day: 'Tue', views: 1850, visitors: 1300 },
    { day: 'Wed', views: 2400, visitors: 1650 },
    { day: 'Thu', views: 2100, visitors: 1400 },
    { day: 'Fri', views: 2800, visitors: 1900 },
    { day: 'Sat', views: 1950, visitors: 1250 },
    { day: 'Sun', views: 1600, visitors: 1100 }
  ],
  categoryBreakdown: [
    { name: 'Technology', value: 35, color: '#3b82f6' },
    { name: 'Application', value: 25, color: '#10b981' },
    { name: 'Data', value: 20, color: '#8b5cf6' },
    { name: 'Software', value: 15, color: '#f59e0b' },
    { name: 'Cybersecurity', value: 5, color: '#ef4444' }
  ]
};
