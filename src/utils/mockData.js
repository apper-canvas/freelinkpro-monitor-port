import { format, addDays, subDays } from 'date-fns';

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

const today = new Date();

export const projects = [
  {
    id: '1',
    name: 'Website Redesign',
    clientId: '1',
    description: 'Complete overhaul of the company website with modern design and improved user experience.',
    startDate: format(subDays(today, 30), 'yyyy-MM-dd'),
    dueDate: format(addDays(today, 15), 'yyyy-MM-dd'),
    status: 'in-progress',
    progress: 65,
    budget: 8500,
    tags: ['Design', 'UX/UI', 'Development'],
    tasks: [
      { id: '101', title: 'Wireframes', completed: true, dueDate: format(subDays(today, 15), 'yyyy-MM-dd') },
      { id: '102', title: 'Design System', completed: true, dueDate: format(subDays(today, 5), 'yyyy-MM-dd') },
      { id: '103', title: 'Frontend Development', completed: false, dueDate: format(addDays(today, 5), 'yyyy-MM-dd') },
      { id: '104', title: 'Content Migration', completed: false, dueDate: format(addDays(today, 10), 'yyyy-MM-dd') }
    ]
  },
  {
    id: '2',
    name: 'Mobile App Development',
    clientId: '2',
    description: 'Creating a cross-platform mobile application for inventory management with offline capabilities.',
    startDate: format(subDays(today, 60), 'yyyy-MM-dd'),
    dueDate: format(addDays(today, 30), 'yyyy-MM-dd'),
    status: 'in-progress',
    progress: 40,
    budget: 12000,
    tags: ['Mobile', 'Development', 'React Native'],
    tasks: [
      { id: '201', title: 'Requirements Gathering', completed: true, dueDate: format(subDays(today, 50), 'yyyy-MM-dd') },
      { id: '202', title: 'UI Design', completed: true, dueDate: format(subDays(today, 30), 'yyyy-MM-dd') },
      { id: '203', title: 'Core Features Development', completed: false, dueDate: format(addDays(today, 10), 'yyyy-MM-dd') },
      { id: '204', title: 'Testing', completed: false, dueDate: format(addDays(today, 25), 'yyyy-MM-dd') }
    ]
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    clientId: '3',
    description: 'Quarterly marketing campaign for product launch including social media, email, and content marketing.',
    startDate: format(subDays(today, 15), 'yyyy-MM-dd'),
    dueDate: format(addDays(today, 45), 'yyyy-MM-dd'),
    status: 'planning',
    progress: 20,
    budget: 5000,
    tags: ['Marketing', 'Content', 'Social Media'],
    tasks: [
      { id: '301', title: 'Campaign Strategy', completed: true, dueDate: format(subDays(today, 5), 'yyyy-MM-dd') },
      { id: '302', title: 'Content Creation', completed: false, dueDate: format(addDays(today, 10), 'yyyy-MM-dd') },
      { id: '303', title: 'Channel Setup', completed: false, dueDate: format(addDays(today, 20), 'yyyy-MM-dd') },
      { id: '304', title: 'Performance Analysis', completed: false, dueDate: format(addDays(today, 40), 'yyyy-MM-dd') }
    ]
  }
];