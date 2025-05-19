import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';
import { fetchProjects, deleteProject } from '../services/projectService';
import { fetchClients } from '../services/clientService';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  // Icons
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const SortIcon = getIcon('ArrowUpDown');
  const EyeIcon = getIcon('Eye');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const CalendarIcon = getIcon('Calendar');
  const DollarSignIcon = getIcon('DollarSign');
  const UsersIcon = getIcon('Users');

  useEffect(() => {
    // Simulate API fetch
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch projects and clients
        const [fetchedProjects, fetchedClients] = await Promise.all([
          fetchProjects(),
          fetchClients()
        ]);

        // Map client info to projects
        const projectsWithClientInfo = fetchedProjects.map(project => {
          // Find the associated client
          const client = fetchedClients.find(c => c.id === project.clientId);
          
          return {
            ...project,
            clientName: client ? client.name : 'Unknown Client',
            companyName: client ? client.company : 'Unknown Company'
          };
        });
        
        setProjects(projectsWithClientInfo);
        setFilteredProjects(projectsWithClientInfo);
      } catch (error) {
        console.error('Error loading projects:', error);
        setError('Failed to load projects');
        toast.error('Failed to load projects. Please try again.');
        setProjects([]);
        setFilteredProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...projects];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(project => project.status === statusFilter);
    }
    
    // Apply search
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(lowercasedTerm) ||
        project.description.toLowerCase().includes(lowercasedTerm) ||
        project.clientName.toLowerCase().includes(lowercasedTerm) ||
        project.companyName.toLowerCase().includes(lowercasedTerm) ||
        project.tags.some(tag => tag.toLowerCase().includes(lowercasedTerm))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'client':
          return a.clientName.localeCompare(b.clientName);
        case 'budget':
          return b.budget - a.budget;
        case 'progress':
          return b.progress - a.progress;
        case 'dueDate':
          return new Date(a.dueDate) - new Date(b.dueDate);
        default:
          return 0;
      }
    });
    
    setFilteredProjects(result);
  }, [projects, searchTerm, statusFilter, sortBy]);

  const handleDeleteProject = async (id, event) => {
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        // Call API to delete the project
        await deleteProject(id);
        
        // Update local state
        const updatedProjects = projects.filter(project => project.id !== id);
        setProjects(updatedProjects);
        toast.success('Project deleted successfully');
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('Failed to delete project. Please try again.');
      }
    }
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-surface-500 hover:text-primary">
              <ChevronLeftIcon className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-surface-800 dark:text-surface-100">
              Projects
            </h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400 mt-2">
            Manage and track all your client projects
          </p>
        </div>
        
        <Link to="/projects/new" className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-surface-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search projects, clients, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="input pl-9 pr-8 appearance-none bg-white dark:bg-surface-800"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FilterIcon className="h-5 w-5 text-surface-400" />
            </div>
          </div>
          
          <div className="relative">
            <select
              className="input pl-9 pr-8 appearance-none bg-white dark:bg-surface-800"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="dueDate">Due Date</option>
              <option value="name">Name</option>
              <option value="client">Client</option>
              <option value="budget">Budget</option>
              <option value="progress">Progress</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SortIcon className="h-5 w-5 text-surface-400" />
            </div>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
            <SearchIcon className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">
            Error loading projects
          </h3>
          <p className="text-surface-500 dark:text-surface-400 max-w-md mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="card p-5 hover:shadow-lg dark:border-surface-700 cursor-pointer"
              onClick={() => navigate(`/projects/${project.id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                {getStatusBadge(project.status)}
              </div>
              
              <p className="text-surface-600 dark:text-surface-400 text-sm line-clamp-2 mb-4">{project.description}</p>
              
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-3">
                <UsersIcon className="w-4 h-4" />
                <span>{project.clientName} • {project.companyName}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-3">
                <CalendarIcon className="w-4 h-4" />
                <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-5">
                <DollarSignIcon className="w-4 h-4" />
                <span>Budget: ${project.budget.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }} className="p-1.5 text-surface-600 hover:text-primary"><EyeIcon className="w-4 h-4" /></button>
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/projects/edit/${project.id}`); }} className="p-1.5 text-surface-600 hover:text-primary"><EditIcon className="w-4 h-4" /></button>
                  <button onClick={(e) => handleDeleteProject(project.id, e)} className="p-1.5 text-surface-600 hover:text-accent"><TrashIcon className="w-4 h-4" /></button>
                </div>
                <div className="w-24 bg-surface-200 dark:bg-surface-700 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-surface-100 dark:bg-surface-800 p-4 rounded-full mb-4">
            <SearchIcon className="w-8 h-8 text-surface-400" />
          </div>
          <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
            No projects found
          </h3>
          <p className="text-surface-500 dark:text-surface-400 max-w-md">
            {searchTerm || statusFilter !== 'all' ? 
              "No projects match your search criteria. Try adjusting your filters." : 
              "You don't have any projects yet. Create your first project to get started."}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <Link to="/projects/new" className="btn-primary mt-6">
              Create First Project
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectList;