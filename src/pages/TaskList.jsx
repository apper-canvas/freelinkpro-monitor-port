import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { tasks as initialTasks, projects, clients, taskStatusOptions, taskPriorityOptions } from '../utils/mockData';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');

  // Icons
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const CheckCircleIcon = getIcon('CheckCircle');
  const EyeIcon = getIcon('Eye');
  const EditIcon = getIcon('Edit');
  const ClipboardXIcon = getIcon('ClipboardX');
  const CircleIcon = getIcon('Circle');
  const ArrowUpIcon = getIcon('ArrowUp');
  const ArrowDownIcon = getIcon('ArrowDown');
  const ClockIcon = getIcon('Clock');
  const BriefcaseIcon = getIcon('Briefcase');
  const TagIcon = getIcon('Tag');
  const FilterIcon = getIcon('Filter');
  const XIcon = getIcon('X');

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API fetch
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Enrich tasks with project data
        const enrichedTasks = initialTasks.map(task => {
          const project = projects.find(p => p.id === task.projectId);
          const client = project ? clients.find(c => c.id === project.clientId) : null;
          
          return {
            ...task,
            projectName: project?.name || 'Unknown Project',
            clientName: client?.name || 'Unknown Client'
          };
        });
        
        setTasks(enrichedTasks);
        setFilteredTasks(enrichedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTasks();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...tasks];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.projectName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'completed') {
        result = result.filter(task => task.completed);
      } else if (statusFilter === 'active') {
        result = result.filter(task => !task.completed);
      } else {
        result = result.filter(task => task.status === statusFilter);
      }
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(task => task.priority === priorityFilter);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'dueDate') {
        comparison = new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'low': 0, 'medium': 1, 'high': 2, 'urgent': 3 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredTasks(result);
  }, [tasks, searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const handleToggleTaskStatus = (taskId) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { 
          ...task, 
          completed: !task.completed,
          status: !task.completed ? 'completed' : 'in-progress'
        };
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    const task = tasks.find(t => t.id === taskId);
    const newStatus = !task.completed;
    toast.success(`Task marked as ${newStatus ? 'completed' : 'incomplete'}`);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSortBy('dueDate');
    setSortOrder('asc');
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link to="/tasks/new" className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          <span>New Task</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
            <input 
              type="text"
              className="input pl-10"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <select 
              className="input max-w-xs"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              {taskStatusOptions.map(status => (
                <option key={status} value={status}>{status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
            
            <select 
              className="input max-w-xs"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              {taskPriorityOptions.map(priority => (
                <option key={priority} value={priority}>{priority.charAt(0).toUpperCase() + priority.slice(1)}</option>
              ))}
            </select>
            
            {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
              <button 
                onClick={clearFilters}
                className="btn-outline text-accent flex items-center gap-2"
              >
                <XIcon className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
              <tr>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">
                  <button onClick={() => handleSort('title')} className="flex items-center gap-1">
                    Task {sortBy === 'title' && (sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />)}
                  </button>
                </th>
                <th className="py-3 px-4 text-left">Project</th>
                <th className="py-3 px-4 text-left">
                  <button onClick={() => handleSort('priority')} className="flex items-center gap-1">
                    Priority {sortBy === 'priority' && (sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />)}
                  </button>
                </th>
                <th className="py-3 px-4 text-left">
                  <button onClick={() => handleSort('dueDate')} className="flex items-center gap-1">
                    Due Date {sortBy === 'dueDate' && (sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />)}
                  </button>
                </th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-surface-50 dark:hover:bg-surface-800">
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleToggleTaskStatus(task.id)}
                        className="text-surface-500 hover:text-primary dark:text-surface-400"
                      >
                        {task.completed ? 
                          <CheckCircleIcon className="w-5 h-5 text-green-500" /> : 
                          <CircleIcon className="w-5 h-5" />
                        }
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <Link to={`/tasks/${task.id}`} className="hover:text-primary">
                        <div className={task.completed ? 'line-through text-surface-400' : ''}>
                          {task.title}
                        </div>
                        <div className="text-xs text-surface-500 truncate max-w-xs">
                          {task.description}
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <BriefcaseIcon className="w-4 h-4 text-primary mr-2" />
                        <Link to={`/projects/${task.projectId}`} className="text-primary hover:underline">
                          {task.projectName}
                        </Link>
                      </div>
                      <div className="text-xs text-surface-500">{task.clientName}</div>
                    </td>
                    <td className="py-3 px-4">
                      {getPriorityBadge(task.priority)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 text-surface-500 mr-2" />
                        <span className={`${new Date(task.dueDate) < new Date() && !task.completed ? 'text-accent' : ''}`}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link 
                          to={`/tasks/${task.id}`}
                          className="p-1 text-surface-500 hover:text-primary"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                        <Link 
                          to={`/tasks/edit/${task.id}`}
                          className="p-1 text-surface-500 hover:text-primary"
                        >
                          <EditIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-surface-500">
                    <div className="flex flex-col items-center">
                      <ClipboardXIcon className="w-12 h-12 mb-2 opacity-30" />
                      <p>No tasks found matching your filters</p>
                      {(searchTerm || statusFilter !== 'all' || priorityFilter !== 'all') && (
                        <button 
                          onClick={clearFilters}
                          className="btn-outline mt-3 text-sm"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;