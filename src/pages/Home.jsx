import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { clients as mockClients, tasks as mockTasks, invoices as mockInvoices } from '../utils/mockData';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Use mock data for clients
  const [clients, setClients] = useState(mockClients);
  
  // Calculate dashboard metrics 
  const activeClientsCount = clients.filter(client => client.status === 'active').length;
  
  const totalClientsCount = mockClients.length;
  
  const tasksDueCount = mockTasks.filter(task => !task.completed && task.dueDate).length;
  const tasksThisWeekCount = mockTasks.filter(task => !task.completed && isTaskDueThisWeek(task.dueDate)).length;
  
  const pendingInvoicesAmount = calculatePendingInvoicesAmount();


  // Getting icons
  const UsersIcon = getIcon('Users');
  const ReceiptIcon = getIcon('Receipt');
  const PlusIcon = getIcon('PlusCircle');
  const ChartIcon = getIcon('BarChart');
  const FileTextIcon = getIcon('FileText');
  const CalendarIcon = getIcon('Calendar');
  const TimerIcon = getIcon('Timer');

  // Helper function to check if a task is due this week
  function isTaskDueThisWeek(dateString) {
    if (!dateString) return false;
    
    const today = new Date();
    const dueDate = new Date(dateString);
    
    // Get the start of the current week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Get the end of the current week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return dueDate >= startOfWeek && dueDate <= endOfWeek;
  }
  
  // Calculate total pending and overdue invoice amounts
  function calculatePendingInvoicesAmount() {
    return mockInvoices
      .filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue')
      .reduce((total, invoice) => total + invoice.total, 0);
  }
  
  // Count of pending/overdue invoices
  const pendingInvoicesCount = mockInvoices.filter(invoice => invoice.status === 'pending' || invoice.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100">
            Welcome to your Freelancer Dashboard
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-2">
            Manage your clients and projects efficiently in one place
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          className="card p-5 col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Active Clients</h3>
            <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
              <UsersIcon className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-3xl font-bold">{activeClientsCount}</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            From {totalClientsCount} total clients
          </p>
        </motion.div>

        <motion.div 
          className="card p-5 col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Tasks Due</h3>
            <div className="bg-secondary/10 dark:bg-secondary/20 p-2 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <p className="text-3xl font-bold">{tasksDueCount}</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            {tasksThisWeekCount} upcoming this week
          </p>
        </motion.div>

        <motion.div 
          className="card p-5 col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Pending Invoices</h3>
            <div className="bg-accent/10 dark:bg-accent/20 p-2 rounded-lg">
              <FileTextIcon className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-3xl font-bold">${pendingInvoicesAmount.toLocaleString()}</p>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            {pendingInvoicesCount} invoice{pendingInvoicesCount !== 1 ? 's' : ''} pending payment
          </p>
        </motion.div>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide border-b border-surface-200 dark:border-surface-700 mb-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors 
          ${activeTab === 'dashboard' ? 
            'text-primary border-b-2 border-primary' : 
            'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light'}`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors 
          ${activeTab === 'clients' ? 
            'text-primary border-b-2 border-primary' : 
            'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light'}`}
        >
          Client Management
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors 
          ${activeTab === 'projects' ? 
            'text-primary border-b-2 border-primary' : 
            'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light'}`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors 
          ${activeTab === 'invoices' ? 
            'text-primary border-b-2 border-primary' : 
            'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light'}`}
        >
          Invoicing
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3">
              <div className="card p-0">
                <div className="border-b border-surface-200 dark:border-surface-700 px-5 py-4 flex justify-between items-center">
                  <h3 className="font-semibold">Recent Communications</h3>
                  <button className="text-sm text-primary hover:text-primary-dark transition-colors">
                    View All
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-medium">
                          {clients[index]?.name.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-medium truncate">{clients[index]?.name || 'Unknown Client'}</p>
                          <span className="text-xs text-surface-500 dark:text-surface-400">2 days ago</span>
                        </div>
                        <p className="text-sm text-surface-600 dark:text-surface-300 line-clamp-2">
                          {index === 0 ? "Discussed the timeline for the website redesign project." :
                           index === 1 ? "Requested an update on the current marketing campaign." :
                           "Provided feedback on the latest wireframes and designs."}
                        </p>
                        <div className="mt-2">
                          <span className="tag text-xs">
                            {index === 0 ? "Email" : index === 1 ? "Meeting" : "Call"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="card p-0">
                <div className="border-b border-surface-200 dark:border-surface-700 px-5 py-4 flex justify-between items-center">
                  <h3 className="font-semibold">Upcoming Deadlines</h3>
                  <button className="text-sm text-primary hover:text-primary-dark transition-colors">
                    View Calendar
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { client: 'Innovate Design Co.', task: 'Wireframe Delivery', date: 'Tomorrow', urgent: true },
                    { client: 'TechFlow Solutions', task: 'Project Meeting', date: 'Dec 15', urgent: false },
                    { client: 'ClearView Marketing', task: 'Contract Renewal', date: 'Dec 20', urgent: false }
                  ].map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${item.urgent ? 'bg-accent' : 'bg-secondary'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{item.task}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">{item.client}</p>
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                        item.urgent ? 
                        'bg-accent/10 text-accent' : 
                        'bg-secondary/10 text-secondary'
                      }`}>
                        {item.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'clients' && (
        <MainFeature clients={clients} setClients={setClients} />
      )}
      
      {activeTab === 'projects' && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ChartIcon className="w-12 h-12 text-primary mb-4" />
          <h3 className="text-xl font-medium text-surface-800 dark:text-surface-200 mb-2">
            Project Management
          </h3>
          <p className="text-surface-500 dark:text-surface-400 max-w-md">
            Track your projects, manage tasks, set milestones, and monitor progress
            all in one place.
          </p>
          <Link to="/projects" className="btn-primary mt-6">
            Go to Projects
          </Link>
          <div className="mt-4">
            <Link to="/projects" className="flex items-center p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <TimerIcon className="w-5 h-5 text-secondary" />
              </div>
              <div className="ml-2">Time Tracking</div>
            </Link>
          </div>
        </div>
      )}
      
      {activeTab === 'invoices' && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileTextIcon className="w-16 h-16 text-surface-300 dark:text-surface-600 mb-4" />
          <h3 className="text-xl font-medium text-surface-800 dark:text-surface-200 mb-4">
            Invoice Management
          </h3>
          <div>
            <Link to="/projects" className="flex items-center p-2 rounded-lg text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 group">
              <div className="w-7 h-7 flex items-center justify-center mr-1">
                <ReceiptIcon className="w-5 h-5" />
              </div>
              <div className="ml-2">Expense Tracking</div>
            </Link>
          </div>
          <p className="text-surface-500 dark:text-surface-400 max-w-md">
            Create professional invoices, track payments, and manage your billing all in one place.
            Keep your finances organized and get paid faster.
          </p>
          <Link to="/invoices" className="btn-primary mt-6">
            Go to invoices
          </Link>
        </div>
      )}
      
      {activeTab === 'tasks' && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CalendarIcon className="w-16 h-16 text-surface-300 dark:text-surface-600 mb-4" />
          <h3 className="text-xl font-medium text-surface-800 dark:text-surface-200 mb-4">
            Task Management
          </h3>
          <p className="text-surface-500 dark:text-surface-400 max-w-md">
            Track and manage all your tasks. Create, assign, and update task progress to stay organized.
            Never miss a deadline with task reminders.
          </p>
          <Link to="/tasks" className="btn-primary mt-6">
            Go to Tasks
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;