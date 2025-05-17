import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { tasks as initialTasks, projects, clients } from '../utils/mockData';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Icons
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const CalendarIcon = getIcon('Calendar');
  const CheckCircleIcon = getIcon('CheckCircle');
  const CircleIcon = getIcon('Circle');
  const ClockIcon = getIcon('Clock');
  const TagIcon = getIcon('Tag');
  const FlagIcon = getIcon('Flag');
  const BriefcaseIcon = getIcon('Briefcase');
  const UserIcon = getIcon('User');
  const InfoIcon = getIcon('Info');

  useEffect(() => {
    const loadTask = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API fetch
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulated API delay
        
        const foundTask = initialTasks.find(t => t.id === id);
        if (!foundTask) {
          toast.error('Task not found');
          navigate('/tasks');
          return;
        }
        
        setTask(foundTask);
        
        // Get project information
        const foundProject = projects.find(p => p.id === foundTask.projectId);
        setProject(foundProject);
        
        // Get client information if project exists
        if (foundProject) {
          const foundClient = clients.find(c => c.id === foundProject.clientId);
          setClient(foundClient);
        }
        
      } catch (error) {
        console.error('Error loading task:', error);
        toast.error('Failed to load task details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTask();
  }, [id, navigate]);

  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      // In a real app, this would be an API call
      toast.success('Task deleted successfully');
      navigate('/tasks');
    }
  };

  const toggleTaskStatus = () => {
    if (!task) return;
    
    const updatedTask = { 
      ...task, 
      completed: !task.completed,
      status: !task.completed ? 'completed' : 'in-progress',
      updatedAt: new Date().toISOString()
    };
    
    setTask(updatedTask);
    toast.success(`Task marked as ${updatedTask.completed ? 'completed' : 'incomplete'}`);
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'low':
        return <span className="tag" style={{background: 'rgba(104, 211, 145, 0.1)', color: '#48BB78'}}>Low</span>;
      case 'medium':
        return <span className="tag tag-secondary">Medium</span>;
      case 'high':
        return <span className="tag" style={{background: 'rgba(246, 173, 85, 0.1)', color: '#ED8936'}}>High</span>;
      case 'urgent':
        return <span className="tag tag-accent">Urgent</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'not-started':
        return <span className="tag tag-secondary">Not Started</span>;
      case 'in-progress':
        return <span className="tag">In Progress</span>;
      case 'in-review':
        return <span className="tag" style={{background: 'rgba(159, 122, 234, 0.1)', color: '#9F7AEA'}}>In Review</span>;
      case 'completed':
        return <span className="tag" style={{background: 'rgba(72, 187, 120, 0.1)', color: '#48BB78'}}>Completed</span>;
      case 'on-hold':
        return <span className="tag tag-accent">On Hold</span>;
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

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Task not found</h2>
        <Link to="/tasks" className="btn-primary mt-4">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/tasks" className="text-surface-500 hover:text-primary">
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-surface-800 dark:text-surface-100">
              {task.title}
            </h1>
            {getStatusBadge(task.status)}
          </div>
          {project && (
            <p className="text-surface-600 dark:text-surface-400 mt-2 flex items-center">
              <BriefcaseIcon className="w-4 h-4 mr-2" />
              <Link to={`/projects/${project.id}`} className="hover:underline">
                {project.name}
              </Link>
              {client && (
                <span className="ml-2">• {client.name}</span>
              )}
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={toggleTaskStatus}
            className={`btn-outline flex items-center gap-2 ${
              task.completed ? 'border-green-500 text-green-500' : ''
            }`}
          >
            {task.completed ? (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <CircleIcon className="w-4 h-4" />
                <span>Mark Complete</span>
              </>
            )}
          </button>
          <Link to={`/tasks/edit/${task.id}`} className="btn-outline flex items-center gap-2">
            <EditIcon className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button onClick={handleDeleteTask} className="btn-outline text-accent flex items-center gap-2">
            <TrashIcon className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <motion.div 
        className="card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-surface-700 dark:text-surface-300">
              {task.description}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-surface-200 dark:border-surface-700">
            <div className="flex items-start gap-3">
              <CalendarIcon className="w-5 h-5 text-surface-500 mt-0.5" />
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Created</p>
                <p>{new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <ClockIcon className="w-5 h-5 text-surface-500 mt-0.5" />
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Due Date</p>
                <p className={`${new Date(task.dueDate) < new Date() && !task.completed ? 'text-accent' : ''}`}>
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <FlagIcon className="w-5 h-5 text-surface-500 mt-0.5" />
              <div>
                <p className="text-sm text-surface-500 dark:text-surface-400">Priority</p>
                <div>{getPriorityBadge(task.priority)}</div>
              </div>
            </div>
          </div>
          
          {project && (
            <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
              <h3 className="text-md font-semibold mb-3">Project Information</h3>
              <Link to={`/projects/${project.id}`} className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{project.name}</h4>
                    <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                      Due: {new Date(project.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium mb-1">Progress</div>
                    <div className="w-32 bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetail;