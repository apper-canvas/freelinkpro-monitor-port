import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { projects, clients } from '../utils/mockData';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [isLoading, setIsLoading] = useState(isEditing);
  const [formErrors, setFormErrors] = useState({});
  
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
    if (isEditing) {
      const loadProject = async () => {
        setIsLoading(true);
        try {
          // In a real app, this would be an API fetch
          const project = projects.find(p => p.id === id);
          
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
          
        } catch (error) {
          toast.error('Failed to load project details');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadProject();
    }
  }, [id, isEditing, navigate]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    // In a real app, this would be an API call
    try {
      if (isEditing) {
        toast.success('Project updated successfully!');
      } else {
        toast.success('Project created successfully!');
      }
      
      navigate('/projects');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update project' : 'Failed to create project');
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
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} - {client.company}
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
          <button type="submit" className="btn-primary flex items-center gap-2">
            <SaveIcon className="w-4 h-4" />
            <span>{isEditing ? 'Update Project' : 'Create Project'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;