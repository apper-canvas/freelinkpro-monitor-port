import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { tasks as initialTasks, projects, taskStatusOptions, taskPriorityOptions } from '../utils/mockData';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    status: 'not-started',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Icons
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const SaveIcon = getIcon('Save');
  const TrashIcon = getIcon('Trash');
  const AlertCircleIcon = getIcon('AlertCircle');

  useEffect(() => {
    if (isEditMode) {
      const loadTask = async () => {
        setIsLoading(true);
        try {
          // In a real app, this would be an API fetch
          const foundTask = initialTasks.find(t => t.id === id);
          
          if (!foundTask) {
            toast.error('Task not found');
            navigate('/tasks');
            return;
          }
          
          // Format date to YYYY-MM-DD for input
          const formattedDueDate = new Date(foundTask.dueDate).toISOString().split('T')[0];
          
          setFormData({
            ...foundTask,
            dueDate: formattedDueDate
          });
          
        } catch (error) {
          console.error('Error loading task:', error);
          toast.error('Failed to load task data');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadTask();
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else if (new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      if (isEditMode) {
        // Update existing task
        toast.success('Task updated successfully');
      } else {
        // Create new task
        toast.success('Task created successfully');
      }
      
      navigate('/tasks');
      
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(isEditMode ? 'Failed to update task' : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/tasks" className="text-surface-500 hover:text-primary">
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold">
          {isEditMode ? 'Edit Task' : 'Create New Task'}
        </h1>
      </div>
      
      <motion.div
        className="card p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                Task Title <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`input ${errors.title ? 'border-accent' : ''}`}
                placeholder="Enter task title"
              />
              {errors.title && (
                <p className="text-accent text-sm flex items-center gap-1 mt-1">
                  <AlertCircleIcon className="w-4 h-4" /> {errors.title}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                Description <span className="text-accent">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`input ${errors.description ? 'border-accent' : ''}`}
                placeholder="Describe the task in detail"
              ></textarea>
              {errors.description && (
                <p className="text-accent text-sm flex items-center gap-1 mt-1">
                  <AlertCircleIcon className="w-4 h-4" /> {errors.description}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="projectId" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Project <span className="text-accent">*</span>
                </label>
                <select
                  id="projectId"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  className={`input ${errors.projectId ? 'border-accent' : ''}`}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="text-accent text-sm flex items-center gap-1 mt-1">
                    <AlertCircleIcon className="w-4 h-4" /> {errors.projectId}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Due Date <span className="text-accent">*</span>
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={`input ${errors.dueDate ? 'border-accent' : ''}`}
                />
                {errors.dueDate && (
                  <p className="text-accent text-sm flex items-center gap-1 mt-1">
                    <AlertCircleIcon className="w-4 h-4" /> {errors.dueDate}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input"
                >
                  {taskPriorityOptions.map(priority => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="input"
                >
                  {taskStatusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="completed"
                  checked={formData.completed}
                  onChange={handleChange}
                  className="rounded text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Mark as completed
                </span>
              </label>
            </div>
            
            <div className="pt-4 flex justify-between border-t border-surface-200 dark:border-surface-700">
              <Link to="/tasks" className="btn-outline">
                Cancel
              </Link>
              <button 
                type="submit" 
                className="btn-primary flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                ) : (
                  <SaveIcon className="w-4 h-4" />
                )}
                <span>{isEditMode ? 'Update Task' : 'Create Task'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskForm;