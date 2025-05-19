import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getProjectById, createProject, updateProject } from '../services/projectService';
import { fetchClients } from '../services/clientService';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [isLoading, setIsLoading] = useState(isEditing);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientsList, setClientsList] = useState([]);
  
  const initialFormState = {
    name: '',
    description: '',
    clientId: '',
    startDate: '',
    dueDate: '',
    status: 'planning',
    budget: '',
    tags: []
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [tagInput, setTagInput] = useState('');
  
  // Icons
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const SaveIcon = getIcon('Save');
  const XIcon = getIcon('X');
  const PlusIcon = getIcon('Plus');
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // First load clients for the dropdown
        const clients = await fetchClients();
        setClientsList(clients);
        
        // If editing, load the project details
        if (isEditing) {
          const project = await getProjectById(id);
          
          if (!project) {
            toast.error('Project not found');
            navigate('/projects');
            return;
          }
          
          setFormData({
            name: project.name,
            description: project.description,
            clientId: project.clientId,
            startDate: project.startDate,
            dueDate: project.dueDate,
            status: project.status,
            budget: project.budget,
            tags: [...project.tags]
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error(isEditing ? 'Failed to load project details' : 'Failed to load clients');
        if (isEditing) {
          navigate('/projects');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id, isEditing, navigate]);

  useEffect(() => {
    // Don't run this on initial render
    if (!isLoading && formData !== initialFormState) {
      // Check if needed client is present, if not, try to fetch again
      if (formData.clientId && !clientsList.some(c => c.id === formData.clientId)) {
        const fetchMissingClients = async () => {
          try {
            const clients = await fetchClients();
            setClientsList(clients);
          } catch (error) {
            console.error('Failed to fetch clients:', error);
          }
        };
        fetchMissingClients();
      }
    }
  }, [formData, clientsList, isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Project name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.clientId) errors.clientId = 'Please select a client';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.dueDate) errors.dueDate = 'Due date is required';
    if (formData.startDate && formData.dueDate && new Date(formData.startDate) > new Date(formData.dueDate)) {
      errors.dueDate = 'Due date must be after start date';
    }
    if (!formData.budget) errors.budget = 'Budget is required';
    else if (isNaN(formData.budget) || Number(formData.budget) <= 0) {
      errors.budget = 'Budget must be a positive number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const projectData = {
        name: formData.name,
        description: formData.description,
        clientId: formData.clientId,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        status: formData.status,
        budget: Number(formData.budget),
        tags: formData.tags,
        progress: 0  // Initialize progress to 0 for new projects
      };

      if (isEditing) {
        // Update existing project
        await updateProject(id, projectData);
        toast.success('Project updated successfully');
      } else {
        // Create new project
        await createProject(projectData);
        toast.success('Project created successfully');
      }
      
      navigate('/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(isEditing ? 'Failed to update project. Please try again.' : 'Failed to create project. Please try again.');
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/projects" className="text-surface-500 hover:text-primary">
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Project Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Enter project name"
              />
              {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`input ${formErrors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Describe the project in detail"
              />
              {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
            </div>

            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Client*
              </label>
              <select
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleChange}
                className={`input ${formErrors.clientId ? 'border-red-500 dark:border-red-500' : ''}`}
              >
                <option value="">Select a client</option>
                {clientsList.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}{client.company ? ` - ${client.company}` : ''}
                  </option>
                ))}
              </select>
              {formErrors.clientId && <p className="mt-1 text-sm text-red-500">{formErrors.clientId}</p>}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input"
              >
                <option value="planning">Planning</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Start Date*
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`input ${formErrors.startDate ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {formErrors.startDate && <p className="mt-1 text-sm text-red-500">{formErrors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Due Date*
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className={`input ${formErrors.dueDate ? 'border-red-500 dark:border-red-500' : ''}`}
              />
              {formErrors.dueDate && <p className="mt-1 text-sm text-red-500">{formErrors.dueDate}</p>}
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Budget (USD)*
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                min="0"
                className={`input ${formErrors.budget ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Enter project budget"
              />
              {formErrors.budget && <p className="mt-1 text-sm text-red-500">{formErrors.budget}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <div key={index} className="tag flex items-center gap-1">
                    <span>{tag}</span>
                    <button 
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="rounded-full hover:bg-surface-200 dark:hover:bg-surface-600 p-0.5"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="input flex-1"
                  placeholder="Add a tag (e.g., Design, Development)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={addTag}
                  className="btn-outline px-3"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/projects" className="btn-outline">
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn-primary flex items-center gap-2" 
            disabled={isSubmitting}
          >
            <SaveIcon className="w-4 h-4" />
            <span>{isEditing ? 'Update Project' : 'Create Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;