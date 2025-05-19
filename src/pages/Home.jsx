import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const CircleDollarSignIcon = getIcon('CircleDollarSign');
  const TrendingUpIcon = getIcon('TrendingUp');
  const ClipboardCheckIcon = getIcon('ClipboardCheck');
  const ArrowRightIcon = getIcon('ArrowRight');

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-primary rounded-xl shadow-md overflow-hidden p-8 mb-8"
      >
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome to your Freelancer Dashboard
              </h1>
              <p className="text-white/90 mt-2">
                Manage your clients and projects efficiently in one place
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} className="card-stats-primary">
          <div className="relative z-10">
            <div className="absolute top-3 right-3 bg-white/20 p-2 rounded-lg">
              <UsersIcon className="w-5 h-5 text-white" />
            </div>
            <div className="pt-8">
              <p className="text-sm text-white/80 font-medium mb-1">Active Clients</p>
              <p className="text-3xl font-bold mb-1">{activeClientsCount}</p>
              <p className="text-white/70 text-sm">From {totalClientsCount} total clients</p>
            </div>
            <div className="flex justify-end mt-3">
              <Link to="/clients" className="flex items-center gap-1 text-sm text-white/90 hover:text-white">
                <span>View all</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20">
            <UsersIcon className="w-24 h-24 text-white" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-stats-secondary">
          <div className="relative z-10">
            <div className="absolute top-3 right-3 bg-white/20 p-2 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div className="pt-8">
              <p className="text-sm text-white/80 font-medium mb-1">Tasks Due</p>
              <p className="text-3xl font-bold mb-1">{tasksDueCount}</p>
              <p className="text-white/70 text-sm">{tasksThisWeekCount} upcoming this week</p>
            </div>
            <div className="flex justify-end mt-3">
              <Link to="/tasks" className="flex items-center gap-1 text-sm text-white/90 hover:text-white">
                <span>View all</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20">
            <ClipboardCheckIcon className="w-24 h-24 text-white" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-stats-accent">
          <div className="relative z-10">
            <div className="absolute top-3 right-3 bg-white/20 p-2 rounded-lg">
              <FileTextIcon className="w-5 h-5 text-white" />
            </div>
            <div className="pt-8">
              <p className="text-sm text-white/80 font-medium mb-1">Pending Invoices</p>
              <p className="text-3xl font-bold mb-1">${pendingInvoicesAmount.toLocaleString()}</p>
              <p className="text-white/70 text-sm">
                {pendingInvoicesCount} invoice{pendingInvoicesCount !== 1 ? 's' : ''} pending payment
              </p>
            </div>
            <div className="flex justify-end mt-3">
              <Link to="/invoices" className="flex items-center gap-1 text-sm text-white/90 hover:text-white">
                <span>View all</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20">
            <CircleDollarSignIcon className="w-24 h-24 text-white" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="card-stats-success">
          <div className="relative z-10">
            <div className="absolute top-3 right-3 bg-white/20 p-2 rounded-lg">
              <TrendingUpIcon className="w-5 h-5 text-white" />
            </div>
            <div className="pt-8">
              <p className="text-sm text-white/80 font-medium mb-1">Active Projects</p>
              <p className="text-3xl font-bold mb-1">5</p>
              <p className="text-white/70 text-sm">2 due this month</p>
            </div>
            <div className="flex justify-end mt-3">
              <Link to="/projects" className="flex items-center gap-1 text-sm text-white/90 hover:text-white">
                <span>View all</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20">
            <ChartIcon className="w-24 h-24 text-white" />
          </div>
        </motion.div>
      </motion.div>

      <div className="flex overflow-x-auto scrollbar-hide border-b border-surface-200 dark:border-surface-700 mb-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors 
          ${activeTab === 'dashboard' ? 
            'text-primary border-b-2 border-primary font-semibold' : 
            'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light hover:bg-surface-50 dark:hover:bg-surface-800 rounded-t-lg'}`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors 
          ${activeTab === 'clients' ? 
            'text-primary border-b-2 border-primary font-semibold' : 
            'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light hover:bg-surface-50 dark:hover:bg-surface-800 rounded-t-lg'}`}
        >
          Client Management
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors 
          ${activeTab === 'projects' ? 
            'text-primary border-b-2 border-primary font-semibold' : 
            'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light hover:bg-surface-50 dark:hover:bg-surface-800 rounded-t-lg'}`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors 
          ${activeTab === 'invoices' ? 
            'text-primary border-b-2 border-primary font-semibold' : 
            'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light hover:bg-surface-50 dark:hover:bg-surface-800 rounded-t-lg'}`}
        >
          Invoicing
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <div className="card p-0 shadow-md">
                  <div className="border-b border-surface-200 dark:border-surface-700 px-5 py-4 flex justify-between items-center 
                                bg-surface-50 dark:bg-surface-800/70 rounded-t-xl">
                    <h3 className="font-semibold text-surface-800 dark:text-surface-100">Recent Communications</h3>
                    <button className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 transition-colors">
                      View All
                    </button>
                  </div>
                  <div className="p-5 space-y-4">
                    {[1, 2, 3].map((_, index) => (
                      <div 
                        key={index} 
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/60 border border-surface-100 dark:border-surface-700/40 shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-white font-medium">
                            {clients[index]?.name.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium truncate text-surface-800 dark:text-surface-100">{clients[index]?.name || 'Unknown Client'}</p>
                            <span className="text-xs text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">2 days ago</span>
                          </div>
                          <p className="text-sm text-surface-600 dark:text-surface-300 line-clamp-2">
                            {index === 0 ? "Discussed the timeline for the website redesign project." :
                             index === 1 ? "Requested an update on the current marketing campaign." :
                             "Provided feedback on the latest wireframes and designs."}
                          </p>
                          <div className="mt-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium 
                                          ${index === 0 ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' :
                                            index === 1 ? 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary-light' :
                                            'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-light'}`}>
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
                <div className="card p-0 shadow-md">
                  <div className="border-b border-surface-200 dark:border-surface-700 px-5 py-4 flex justify-between items-center 
                                bg-surface-50 dark:bg-surface-800/70 rounded-t-xl">
                    <h3 className="font-semibold text-surface-800 dark:text-surface-100">Upcoming Deadlines</h3>
                    <button className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 transition-colors">
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
                        className="flex items-center gap-3 p-4 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/60 border border-surface-100 dark:border-surface-700/40 shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
                      >
                        <div className={`w-3 h-3 rounded-full ${item.urgent ? 'bg-accent' : 'bg-secondary'}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-surface-800 dark:text-surface-100">{item.task}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400">{item.client}</p>
                        </div>
                        <div className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                          item.urgent ? 
                          'bg-accent/10 text-accent dark:bg-accent/20 dark:text-accent-light' : 
                          'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary-light'
                        }`}>
                          {item.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'clients' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MainFeature clients={clients} setClients={setClients} />
          </motion.div>
        )}
        
        {activeTab === 'projects' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-20 h-20 bg-gradient-primary rounded-2xl shadow-lg flex items-center justify-center mb-6">
              <ChartIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 gradient-text-primary">
              Project Management
            </h3>
            <p className="text-surface-600 dark:text-surface-300 max-w-lg mb-8">
              Track your projects, manage tasks, set milestones, and monitor progress
              all in one place with our comprehensive project management tools.
            </p>
            <Link to="/projects" className="btn-primary px-8 py-3 text-base font-medium">
              Go to Projects
            </Link>
            <div className="mt-8 bg-surface-50 dark:bg-surface-800 p-6 rounded-xl border border-surface-100 dark:border-surface-700 shadow-sm max-w-md">
              <Link to="/projects" className="flex items-center p-4 rounded-xl hover:bg-white dark:hover:bg-surface-700 border border-surface-100 dark:border-surface-700/50 shadow-sm transition-all hover:shadow-md">
                <div className="bg-gradient-secondary w-12 h-12 rounded-lg shadow-sm flex items-center justify-center">
                  <TimerIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 text-left">
                  <div className="font-medium text-surface-800 dark:text-surface-100">Time Tracking</div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">Log hours and monitor project time</div>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'invoices' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-20 h-20 bg-gradient-accent rounded-2xl shadow-lg flex items-center justify-center mb-6">
              <FileTextIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 gradient-text-accent">
              Invoice Management
            </h3>
            <p className="text-surface-600 dark:text-surface-300 max-w-lg mb-8">
              Create professional invoices, track payments, and manage your billing all in one place.
              Keep your finances organized and get paid faster.
            </p>
            <Link to="/invoices" className="btn-accent px-8 py-3 text-base font-medium">
              Go to Invoices
            </Link>
            <div className="mt-8 bg-surface-50 dark:bg-surface-800 p-6 rounded-xl border border-surface-100 dark:border-surface-700 shadow-sm max-w-md">
              <Link to="/projects" className="flex items-center p-4 rounded-xl hover:bg-white dark:hover:bg-surface-700 border border-surface-100 dark:border-surface-700/50 shadow-sm transition-all hover:shadow-md">
                <div className="bg-gradient-accent w-12 h-12 rounded-lg shadow-sm flex items-center justify-center">
                  <ReceiptIcon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 text-left">
                  <div className="font-medium text-surface-800 dark:text-surface-100">Expense Tracking</div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">Monitor and categorize your business expenses</div>
                </div>
              </Link>
            </div>
          </motion.div>
        )}
        
        {activeTab === 'tasks' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-20 h-20 bg-gradient-secondary rounded-2xl shadow-lg flex items-center justify-center mb-6">
              <CalendarIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-semibold mb-3 gradient-text-secondary">
              Task Management
            </h3>
            <p className="text-surface-600 dark:text-surface-300 max-w-lg mb-8">
              Track and manage all your tasks. Create, assign, and update task progress to stay organized.
              Never miss a deadline with task reminders.
            </p>
            <Link to="/tasks" className="btn-secondary px-8 py-3 text-base font-medium">
              Go to Tasks
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;