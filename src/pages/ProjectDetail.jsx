import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { getProjectById, deleteProject } from '../services/projectService';
import { fetchClients } from '../services/clientService';
import TimeEntryForm from '../components/TimeEntryForm';
import ExpenseForm from '../components/ExpenseForm';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [client, setClient] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Time tracking state
  const [showTimeEntryForm, setShowTimeEntryForm] = useState(false);
  const [editingTimeEntry, setEditingTimeEntry] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Expense tracking state
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('all');
  
  // Icons
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const UsersIcon = getIcon('Users');
  const CalendarIcon = getIcon('Calendar');
  const ClockIcon = getIcon('Clock');
  const CheckCircleIcon = getIcon('CheckCircle');
  const CircleIcon = getIcon('Circle');
  const PlusIcon = getIcon('Plus');
  const DollarSignIcon = getIcon('DollarSign');
  const TagIcon = getIcon('Tag');
  const FileIcon = getIcon('File');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const PlayIcon = getIcon('Play');
  const PauseIcon = getIcon('Pause');
  const StopIcon = getIcon('Square');
  const PlusCircleIcon = getIcon('PlusCircle');
  const TimerIcon = getIcon('Timer');
  const ReceiptIcon = getIcon('Receipt');
  const DollarIcon = getIcon('DollarSign');
  const CreditCardIcon = getIcon('CreditCard');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch project details from the API
        const projectData = await getProjectById(id);
        
        if (!projectData) {
          setError('Project not found');
          toast.error('Project not found');
          navigate('/projects');
          return;
        }
        
        // Initialize default collections if they don't exist
        const projectWithCollections = {
          ...projectData,
          tasks: projectData.tasks || [],
          timeEntries: projectData.timeEntries || [],
          expenses: projectData.expenses || []
        };
        
        setProject(projectWithCollections);
        
        // Get client information
        if (projectData.clientId) {
          const clients = await fetchClients();
          const clientData = clients.find(c => c.id === projectData.clientId);
          setClient(clientData);
        }
        
      } catch (error) {
        console.error('Error loading project:', error);
        setError('Failed to load project details');
        toast.error('Failed to load project details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, navigate]);

  useEffect(() => {
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format time in HH:MM:SS format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  // Calculate total hours from time entries
  const getTotalHours = () => {
    if (!project || !project.timeEntries) return 0;
    return project.timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  };

  // Calculate total expenses
  const getTotalExpenses = () => {
    if (!project || !project.expenses) return 0;
    return project.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };
  
  // Filter expenses by category
  
  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Call API to delete the project
        await deleteProject(id);
        toast.success('Project deleted successfully');
        navigate('/projects');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project. Please try again.');
      }
    }
  };

  const toggleTaskStatus = (taskId) => {
    if (!project || !project.tasks) return;
    
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    setProject({ ...project, tasks: updatedTasks });
    toast.success('Task status updated');
  const addNewTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      completed: false,
      dueDate: new Date().toISOString().split('T')[0]
    };
    
    setProject({
      ...project,
      tasks: [...project.tasks, newTask]
    });
    
    setNewTaskTitle('');
    toast.success('New task added');
  };
  
  const startTimer = () => {
    if (activeTimer) return;
    
    const now = new Date();
    startTimeRef.current = now;
    
    setActiveTimer({
      startTime: now.toLocaleTimeString(),
      date: now.toISOString().split('T')[0]
    });
    
    setElapsedTime(0);
    
    timerRef.current = setInterval(() => {
      const seconds = Math.floor((new Date() - startTimeRef.current) / 1000);
      setElapsedTime(seconds);
    }, 1000);
    
    toast.info('Timer started');
  };
  
  const stopTimer = () => {
    if (!activeTimer) return;
    
    clearInterval(timerRef.current);
    
    const endTime = new Date();
    const duration = (endTime - startTimeRef.current) / (1000 * 60 * 60);
    const roundedDuration = Math.round(duration * 100) / 100;
    
    // Format times to HH:MM
    const formatTimeValue = (date) => {
      return date.toTimeString().substring(0, 5);
    };
    
    const timeEntry = {
      id: `time-${Date.now()}`,
      date: activeTimer.date,
      startTime: formatTimeValue(startTimeRef.current),
      endTime: formatTimeValue(endTime),
      duration: roundedDuration,
      description: `Work on ${project.name}`,
      createdAt: new Date().toISOString()
    };
    
    setEditingTimeEntry(timeEntry);
    setShowTimeEntryForm(true);
    
    setActiveTimer(null);
    setElapsedTime(0);
    
    toast.info('Timer stopped');
  };
  
  const pauseTimer = () => {
    if (!activeTimer) return;
    
    // For a real implementation, we would save the elapsed time and continue from there
    // For this demo, we'll just show a notification
    toast.info('Timer paused. This is a placeholder - in a real app, the timer would be paused.');
  };
  
  const handleAddTimeEntry = () => {
    setEditingTimeEntry(null);
    setShowTimeEntryForm(true);
  };
  
  const handleEditTimeEntry = (timeEntry) => {
    setEditingTimeEntry(timeEntry);
    setShowTimeEntryForm(true);
  };
  
  const handleDeleteTimeEntry = (timeEntryId) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      const updatedTimeEntries = project.timeEntries.filter(entry => entry.id !== timeEntryId);
      
      setProject({
        ...project,
        timeEntries: updatedTimeEntries
      });
      
      toast.success('Time entry deleted');
    }
  };
  
  const handleTimeEntrySubmit = (timeEntryData) => {
    if (editingTimeEntry) {
      // Update existing entry
      const updatedTimeEntries = project.timeEntries.map(entry =>
        entry.id === timeEntryData.id ? timeEntryData : entry
      );
      
      setProject({ ...project, timeEntries: updatedTimeEntries });
      toast.success('Time entry updated');
    } else {
      // Add new entry
      setProject({
        ...project,
        timeEntries: [timeEntryData, ...(project.timeEntries || [])]
      });
      
      toast.success('Time entry added');
    }
    
  };

  // Expense handling functions
  const handleAddExpense = () => {
    setEditingExpense(null);
    setShowExpenseForm(true);
  };
  
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };
  
  const handleDeleteExpense = (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = project.expenses.filter(expense => expense.id !== expenseId);
      
      setProject({
        ...project,
        expenses: updatedExpenses
      });
      
      toast.success('Expense deleted');
    }
  };
  
  const handleExpenseSubmit = (expenseData) => {
    if (editingExpense) {
      // Update existing expense
      const updatedExpenses = project.expenses.map(expense =>
        expense.id === expenseData.id ? expenseData : expense
      );
      
      setProject({ ...project, expenses: updatedExpenses });
      toast.success('Expense updated successfully');
    } else {
      // Add new expense
      setProject({
        ...project,
        expenses: [expenseData, ...(project.expenses || [])]
      });
      
      toast.success('Expense added successfully');
    }
  };
  
  // Get expenses filtered by category
  const getFilteredExpenses = () => {
    if (!project || !project.expenses) return [];
    if (selectedExpenseCategory === 'all') return project.expenses;
    return project.expenses.filter(expense => expense.category === selectedExpenseCategory);
  };
  
  // Get expenses grouped by category for summary
  const getExpensesByCategory = () => {
    if (!project || !project.expenses) return {};
    return project.expenses.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'planning':
        return <span className="tag tag-secondary">Planning</span>;
      case 'in-progress':
        return <span className="tag">In Progress</span>;
      case 'review':
        return <span className="tag" style={{background: 'rgba(159, 122, 234, 0.1)', color: '#9F7AEA'}}>Review</span>;
      case 'completed':
        return <span className="tag" style={{background: 'rgba(72, 187, 120, 0.1)', color: '#48BB78'}}>Completed</span>;
      default:
        return <span className="tag">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (error || !project) {
    return (
      <div>
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full inline-block mb-4">
          <ChevronLeftIcon className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">
          {error || 'Project not found'}
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/projects" className="text-surface-500 hover:text-primary">
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-surface-800 dark:text-surface-100">
              {project.name}
            </h1>
            {getStatusBadge(project.status)}
          </div>
          {client && (
            <p className="text-surface-600 dark:text-surface-400 mt-2">
              Client: {client.name} • {client.company}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Link to={`/projects/edit/${project.id}`} className="btn-outline flex items-center gap-2">
            <EditIcon className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button onClick={handleDeleteProject} className="btn-outline text-accent flex items-center gap-2">
            <TrashIcon className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            className="card p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-3">Project Details</h2>
            <p className="text-surface-700 dark:text-surface-300 mb-5">
              {project.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                <CalendarIcon className="w-4 h-4 text-primary" />
                <div>
                  <div className="text-xs">Start Date</div>
                  <div>{new Date(project.startDate).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                <ClockIcon className="w-4 h-4 text-accent" />
                <div>
                  <div className="text-xs">End Date</div>
                  <div>{project.endDate ? new Date(project.endDate).toLocaleDateString() : project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'Not set'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-surface-600 dark:text-surface-400">
                <DollarSignIcon className="w-4 h-4 text-green-500" />
                <div>
                  <div className="text-xs">Budget</div>
                  <div>${project.budget.toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div className="mb-5">
              <div className="text-sm font-medium mb-2">Progress</div>
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-surface-500 mt-1">
                <span>{project.progress}% Complete</span>
                <span>{project.tasks.filter(t => t.completed).length}/{project.tasks.length} Tasks</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {project.tags && project.tags.map((tag, index) => (
                <span key={index} className="tag tag-secondary text-xs">
                  <TagIcon className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="card p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <span className="text-sm text-surface-500">
                {project.tasks.filter(t => t.completed).length}/{project.tasks.length} Completed
              </span>
            </div>
            
            <div className="space-y-2 mb-5">
              {project.tasks && project.tasks.map(task => (
                <div 
                  key={task.id} 
                  className="flex items-center p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <button onClick={() => toggleTaskStatus(task.id)} className="mr-3 text-surface-500 hover:text-primary">
                    {task.completed ? (
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    ) : (
                      <CircleIcon className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p className={`${task.completed ? 'line-through text-surface-400' : 'text-surface-700 dark:text-surface-300'}`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-surface-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <form onSubmit={addNewTask} className="flex gap-2">
              <input
                type="text"
                className="input flex-1"
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button type="submit" className="btn-primary px-3">
                <PlusIcon className="w-5 h-5" />
              </button>
            </form>
          </motion.div>

          <motion.div 
            className="card p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TimerIcon className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Time Tracking</h2>
              </div>
              
              <div className="flex items-center gap-2">
                {activeTimer ? (
                  <>
                    <div className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-md font-mono">
                      {formatTime(elapsedTime)}
                    </div>
                    <button 
                      onClick={pauseTimer}
                      className="p-1.5 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                      title="Pause timer"
                    >
                      <PauseIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={stopTimer}
                      className="p-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                      title="Stop timer"
                    >
                      <StopIcon className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={startTimer}
                    className="p-1.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                    title="Start timer"
                  >
                    <PlayIcon className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={handleAddTimeEntry}
                  className="p-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                  title="Add time entry"
                >
                  <PlusCircleIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-surface-600 dark:text-surface-400 mb-1">
                <span>Total Hours</span>
                <span className="font-semibold">{getTotalHours().toFixed(2)} hrs</span>
              </div>
              <div className="flex justify-between text-sm text-surface-600 dark:text-surface-400">
                <span>Total Billable ({project.hourlyRate ? `$${project.hourlyRate}/hr` : 'Not set'})</span>
                <span className="font-semibold">${(getTotalHours() * (project.hourlyRate || 0)).toFixed(2)}</span>
              </div>
            </div>

            {project.timeEntries?.length > 0 ? (
              <div className="space-y-2 mt-4">
                <div className="grid grid-cols-12 text-xs font-medium text-surface-500 dark:text-surface-400 pb-2 border-b border-surface-200 dark:border-surface-700">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Duration</div>
                  <div className="col-span-6">Description</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {project.timeEntries.map(entry => (
                  <div key={entry.id} className="grid grid-cols-12 py-2 text-sm border-b border-surface-100 dark:border-surface-800">
                    <div className="col-span-2 flex items-center">
                      <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-surface-400" />
                      {entry.date}
                    </div>
                    <div className="col-span-2 flex items-center">
                      <ClockIcon className="w-3.5 h-3.5 mr-1.5 text-surface-400" />
                      {entry.duration.toFixed(2)} hrs
                    </div>
                    <div className="col-span-6 truncate">{entry.description}</div>
                    <div className="col-span-2 flex items-center gap-1">
                      <button onClick={() => handleEditTimeEntry(entry)} className="p-1 text-surface-500 hover:text-primary">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteTimeEntry(entry.id)} className="p-1 text-surface-500 hover:text-red-500">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-surface-500">No time entries yet. Click the + button to add one or start the timer.</p>
            )}
          </motion.div>

          <motion.div 
            className="card p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <ReceiptIcon className="w-5 h-5 text-secondary" />
                <h2 className="text-lg font-semibold">Expense Tracking</h2>
              </div>
              
              <button 
                onClick={handleAddExpense}
                className="p-1.5 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20"
                title="Add expense"
              >
                <PlusCircleIcon className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-surface-600 dark:text-surface-400 mb-2">
                <span>Total Expenses</span>
                <span className="font-semibold">${getTotalExpenses().toFixed(2)}</span>
              </div>
              
              {/* Expense Summary by Category */}
              <div className="bg-surface-50 dark:bg-surface-800 p-3 rounded-lg mb-4">
                      <span>{category || 'Uncategorized'}</span>
                <div className="space-y-2">
                  {Object.entries(getExpensesByCategory()).map(([category, amount]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span>{category}</span>
                      <span>${amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Category Filter */}
              <div className="flex mb-3">
                <select
                  value={selectedExpenseCategory}
                  onChange={(e) => setSelectedExpenseCategory(e.target.value)}
                  className="input text-sm py-1"
                >
                  <option value="all">All Categories</option>
                  {Object.keys(getExpensesByCategory()).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            {project.expenses && project.expenses.length > 0 ? (
              <div className="space-y-2 mt-4">
                <div className="grid grid-cols-12 text-xs font-medium text-surface-500 dark:text-surface-400 pb-2 border-b border-surface-200 dark:border-surface-700">
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-4">Description</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {getFilteredExpenses().map(expense => (
                  <div key={expense.id} className="grid grid-cols-12 py-2 text-sm border-b border-surface-100 dark:border-surface-800">
                    <div className="col-span-2 flex items-center">
                      <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-surface-400" />
                      {expense.date}
                    </div>
                    <div className="col-span-2 flex items-center">
                      <DollarIcon className="w-3.5 h-3.5 mr-1.5 text-surface-400" />
                      ${expense.amount.toFixed(2)}
                    </div>
                    <div className="col-span-2 flex items-center">
                      <TagIcon className="w-3.5 h-3.5 mr-1.5 text-surface-400" />
                      {expense.category}
                    </div>
                    <div className="col-span-4 truncate">
                      {expense.description}
                      {expense.billable && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Billable</span>
                      )}
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <button onClick={() => handleEditExpense(expense)} className="p-1 text-surface-500 hover:text-secondary">
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteExpense(expense.id)} className="p-1 text-surface-500 hover:text-red-500">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-surface-500">
                No expenses recorded yet. Click the + button to add an expense.
              </p>
            )}
          </motion.div>
        </div>
        
        <div className="lg:col-span-1">
          <motion.div 
            className="card p-5 sticky top-24"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h2 className="text-lg font-semibold mb-4">Client Information</h2>
            
            {client ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-medium text-lg">
                      {client.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{client.name}</h3>
                    <p className="text-sm text-surface-500">{client.company}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <a href={`mailto:${client.email}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700">
                    <MailIcon className="w-5 h-5 text-surface-500" />
                    <span className="text-sm">{client.email}</span>
                  </a>
                  
                  <a href={`tel:${client.phone}`} className="flex items-center gap-3 p-2 rounded-md hover:bg-surface-100 dark:hover:bg-surface-700">
                    <PhoneIcon className="w-5 h-5 text-surface-500" />
                    <span className="text-sm">{client.phone}</span>
                  </a>
                </div>
                
                <div className="pt-4 mt-4 border-t border-surface-200 dark:border-surface-700">
                  <h4 className="text-sm font-medium mb-2">Client Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {client.tags && client.tags.map((tag, index) => (
                      <span key={index} className="tag text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Link to={`/clients/${client.id}`} className="btn-outline w-full justify-center mt-2">
                  View Full Client Profile
                </Link>
              </div>
            ) : (
              <div className="text-center py-4 text-surface-500">
                <UsersIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Client information not available</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <TimeEntryForm 
        isOpen={showTimeEntryForm}
        onClose={() => setShowTimeEntryForm(false)}
        onSubmit={handleTimeEntrySubmit}
        initialData={editingTimeEntry}
        projectId={id}
      />
      
      <ExpenseForm 
        isOpen={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        onSubmit={handleExpenseSubmit}
        initialData={editingExpense}
        projectId={id}
      />
    </div>
  );
};

export default ProjectDetail;