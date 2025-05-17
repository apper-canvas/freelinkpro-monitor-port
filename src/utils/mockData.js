// Mock data for the application

// Clients data
export const clients = [
  {
    id: '1',
    name: 'Eliza Rodriguez',
    company: 'Innovate Design Co.',
    email: 'eliza@innovatedesign.com',
    phone: '(555) 123-4567',
    status: 'active',
    tags: ['Design', 'Branding'],
    lastContact: '2023-11-15'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    company: 'TechFlow Solutions',
    email: 'mchen@techflow.io',
    phone: '(555) 987-6543',
    status: 'pending',
    tags: ['Development', 'Web'],
    lastContact: '2023-12-02'
  },
  {
    id: '3',
    name: 'Sophia Williams',
    company: 'ClearView Marketing',
    email: 'sophia@clearview.com',
    phone: '(555) 222-3333',
    status: 'inactive',
    tags: ['Marketing', 'Strategy'],
    lastContact: '2023-10-20'
  }
];

// Projects data
export const projects = [
  {
    id: '1',
    name: 'Website Redesign',
    clientId: '1',
    status: 'in-progress',
    startDate: '2023-10-15',
    endDate: '2024-01-15',
    budget: 12000,
    progress: 65,
    description: 'Complete redesign of the company website with new branding elements and improved user experience.',
    tasks: [
      {
        id: 'task-1',
        title: 'Create wireframes for homepage',
        completed: true,
        dueDate: '2023-10-25'
      },
      {
        id: 'task-2',
        title: 'Design brand guidelines',
        completed: true,
        dueDate: '2023-11-05'
      },
      {
        id: 'task-3',
        title: 'Develop frontend components',
        completed: false,
        dueDate: '2023-12-10'
      }
    ],
    tags: ['Design', 'Development', 'UX'],
    timeEntries: [
      {
        id: 'time-1',
        date: '2023-11-01',
        startTime: '09:00',
        endTime: '12:30',
        duration: 3.5,
        description: 'Initial wireframing and client meeting',
        createdAt: '2023-11-01T12:35:00Z'
      },
      {
        id: 'time-2',
        date: '2023-11-02',
        startTime: '14:00',
        endTime: '17:00',
        duration: 3,
        description: 'Design system setup and component design',
        createdAt: '2023-11-02T17:05:00Z'
      }
    ],
    hourlyRate: 85
  },
  {
    id: '1',
    name: 'Website Redesign',
    clientId: '1',
    status: 'in-progress',
    startDate: '2023-10-15',
    endDate: '2024-01-15',
    budget: 12000,
    progress: 65,
    description: 'Complete redesign of the company website with new branding elements and improved user experience.',
    tasks: [
      {
        id: 'task-1',
        title: 'Create wireframes for homepage',
        completed: true,
        dueDate: '2023-10-25'
      },
      {
        id: 'task-2',
        title: 'Design brand guidelines',
        completed: true,
        dueDate: '2023-11-05'
      },
      {
        id: 'task-3',
        title: 'Develop frontend components',
        completed: false,
        dueDate: '2023-12-10'
      }
    ],
    tags: ['Design', 'Development', 'UX'],
    timeEntries: [
      {
        id: 'time-1',
        date: '2023-11-01',
        startTime: '09:00',
        endTime: '12:30',
        duration: 3.5,
        description: 'Initial wireframing and client meeting',
        createdAt: '2023-11-01T12:35:00Z'
      },
      {
        id: 'time-2',
        date: '2023-11-02',
        startTime: '14:00',
        endTime: '17:00',
        duration: 3,
        description: 'Design system setup and component design',
        createdAt: '2023-11-02T17:05:00Z'
      }
    ],
    hourlyRate: 85
  },
  {
    id: '2',
    name: 'Mobile App Development',
    clientId: '2',
    status: 'planned',
    startDate: '2024-01-20',
    endDate: '2024-04-30',
    budget: 25000,
    progress: 10,
    description: 'Develop a native mobile application for both iOS and Android platforms.',
    tasks: [
      {
        id: 'task-4',
        title: 'Create app architecture document',
        completed: true,
        dueDate: '2024-01-30'
      },
      {
        id: 'task-5',
        title: 'Design UI mockups for key screens',
        completed: false,
        dueDate: '2024-02-15'
      }
    ],

    tags: ['Mobile', 'Development', 'UI/UX'],
    timeEntries: [
      
    ],
    hourlyRate: 95
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    clientId: '3',
    status: 'completed',
    startDate: '2023-08-01',
    endDate: '2023-11-30',
    budget: 8500,
    progress: 100,
    description: 'Q4 marketing campaign including social media, email marketing, and content creation.',
    tasks: [
      {
        id: 'task-6',
        title: 'Create content calendar',
        completed: true,
        dueDate: '2023-08-15'
      },
      {
        id: 'task-7',
        title: 'Design social media graphics',
        completed: true,
        dueDate: '2023-09-01'
      },
      {
        id: 'task-8',
        title: 'Write email newsletter copy',
        completed: true,
        dueDate: '2023-09-15'
      }
    ],
    tags: ['Marketing', 'Content', 'Social Media'],
    timeEntries: [
      
    ],
    hourlyRate: 75
  }
];

// Tasks data
export const tasks = [
  {
    id: 'task-1',
    title: 'Create wireframes for homepage',
    description: 'Design wireframes for the new homepage layout focusing on improved user experience and conversion optimization.',
    projectId: '1',
    status: 'completed',
    priority: 'high',
    dueDate: '2023-10-25',
    completed: true,
    assignedTo: null,
    createdAt: '2023-10-15',
    updatedAt: '2023-10-24'
  },
  {
    id: 'task-2',
    title: 'Design brand guidelines',
    description: 'Create comprehensive brand guidelines document including logo usage, color palette, typography, and graphic elements.',
    projectId: '1',
    status: 'completed',
    priority: 'medium',
    dueDate: '2023-11-05',
    completed: true,
    assignedTo: null,
    createdAt: '2023-10-20',
    updatedAt: '2023-11-04'
  },
  {
    id: 'task-3',
    title: 'Develop frontend components',
    description: 'Build reusable UI components based on the approved designs using React and styled components.',
    projectId: '1',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-12-10',
    completed: false,
    assignedTo: null,
    createdAt: '2023-11-10',
    updatedAt: '2023-11-10'
  },
  {
    id: 'task-4',
    title: 'Create app architecture document',
    description: 'Document the application architecture including data flow, component structure, and API integrations.',
    projectId: '2',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-01-30',
    completed: true,
    assignedTo: null,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-29'
  }
];

// Task status options
export const taskStatusOptions = ['not-started', 'in-progress', 'in-review', 'completed', 'on-hold'];
export const taskPriorityOptions = ['low', 'medium', 'high', 'urgent'];

// Invoices data
export const invoices = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    clientId: '1',
    projectId: '1',
    issueDate: '2023-11-01',
    dueDate: '2023-11-15',
    status: 'paid',
    items: [
      { description: 'Website Design - Initial Phase', quantity: 1, rate: 2500, amount: 2500 },
      { description: 'Brand Identity Development', quantity: 1, rate: 1200, amount: 1200 }
    ],
    subtotal: 3700,
    tax: 370,
    total: 4070,
    amountPaid: 4070,
    notes: 'Thank you for your business!',
    paymentDate: '2023-11-12'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-002',
    clientId: '2',
    projectId: '2',
    issueDate: '2023-12-01',
    dueDate: '2023-12-15',
    status: 'pending',
    items: [
      { description: 'App Development Planning', quantity: 1, rate: 3000, amount: 3000 },
      { description: 'UI/UX Wireframes', quantity: 1, rate: 1800, amount: 1800 }
    ],
    subtotal: 4800,
    tax: 480,
    total: 5280,
    amountPaid: 0,
    notes: 'Please make payment by the due date.',
    paymentDate: null
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-003',
    clientId: '3',
    projectId: '3',
    issueDate: '2023-10-15',
    dueDate: '2023-10-29',
    status: 'overdue',
    items: [
      { description: 'Social Media Campaign Management', quantity: 1, rate: 1500, amount: 1500 },
      { description: 'Content Creation (5 articles)', quantity: 5, rate: 200, amount: 1000 }
    ],
    subtotal: 2500,
    tax: 250,
    total: 2750,
    amountPaid: 0,
    notes: 'Payment is now overdue. Please settle this invoice as soon as possible.',
    paymentDate: null
  }
];