import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { projects as initialProjects, clients } from '../utils/mockData';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
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

  useEffect(() => {
    const loadProject = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API fetch
        const foundProject = initialProjects.find(p => p.id === id);
        
        if (!foundProject) {
          toast.error('Project not found');
          navigate('/projects');
          return;
        }
        
        setProject(foundProject);
        
        // Get client information
        const foundClient = clients.find(c => c.id === foundProject.clientId);
        setClient(foundClient);
        
      } catch (error) {
        toast.error('Failed to load project details');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [id, navigate]);

  const handleDeleteProject = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      // In a real app, this would be an API call
      toast.success('Project deleted successfully');
      navigate('/projects');
    }
  };

  const toggleTaskStatus = (taskId) => {
    const updatedTasks = project.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    setProject({ ...project, tasks: updatedTasks });
    toast.success('Task status updated');
  };

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

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
        <Link to="/projects" className="btn-primary mt-4">Back to Projects</Link>
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
                  <div className="text-xs">Due Date</div>
                  <div>{new Date(project.dueDate).toLocaleDateString()}</div>
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
                ></div>
              </div>
              <div className="flex justify-between text-xs text-surface-500 mt-1">
                <span>{project.progress}% Complete</span>
                <span>{project.tasks.filter(t => t.completed).length}/{project.tasks.length} Tasks</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
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
              {project.tasks.map(task => (
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
                    {client.tags.map((tag, index) => (
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
    </div>
  );
};

export default ProjectDetail;