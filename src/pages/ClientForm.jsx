import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getClientById, createClient, updateClient } from '../services/clientService';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [isLoading, setIsLoading] = useState(isEditing);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormState = {
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'active',
    tags: [],
    lastContact: new Date().toISOString().split('T')[0]
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [tagInput, setTagInput] = useState('');
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  
  // Icons
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const SaveIcon = getIcon('Save');
  const XIcon = getIcon('X');
  const PlusIcon = getIcon('Plus');
  
  // Predefined tag options based on the schema
  const predefinedTags = [
    'Design',
    'Development',
    'Marketing',
    'Web',
    'Branding',
    'Strategy'
  ];
  
  // Filter out already selected tags
  const availableTags = predefinedTags.filter(tag => !formData.tags.includes(tag));
  
  useEffect(() => {
    const loadClient = async () => {
      if (!isEditing) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const client = await getClientById(id);
        
        if (!client) {
          toast.error('Client not found');
          navigate('/clients');
          return;
        }
        
        setFormData({
          name: client.name,
          company: client.company,
          email: client.email,
          phone: client.phone,
          status: client.status,
          tags: Array.isArray(client.tags) ? client.tags : [],
          lastContact: client.lastContact || new Date().toISOString().split('T')[0]
        });
      } catch (error) {
        console.error('Error loading client:', error);
        toast.error('Failed to load client details');
        navigate('/clients');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClient();
  }, [id, isEditing, navigate]);

  const handleInputChange = (e) => {
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
      setShowTagDropdown(false);
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const selectTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...prev.tags, tag]
      }));
    }
    setShowTagDropdown(false);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
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
      const clientData = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
        tags: formData.tags,
        lastContact: formData.lastContact
      };

      if (isEditing) {
        await updateClient(id, clientData);
        toast.success('Client updated successfully');
      } else {
        await createClient(clientData);
        toast.success('Client created successfully');
      }
      
      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error(isEditing ? 'Failed to update client' : 'Failed to create client');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/clients" className="text-surface-500 hover:text-primary">
          <ChevronLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
          {isEditing ? 'Edit Client' : 'Add New Client'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`input ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Enter client name"
              />
              {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="company" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Company
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="input"
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`input ${formErrors.email ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="client@example.com"
              />
              {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`input ${formErrors.phone ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="(123) 456-7890"
              />
              {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
            </div>

            <div className="md:col-span-2 space-y-1">
              <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="input"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="lastContact" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Last Contact
              </label>
              <input
                type="date"
                id="lastContact"
                name="lastContact"
                value={formData.lastContact}
                onChange={handleInputChange}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link to="/clients" className="btn-outline">
            Cancel
          </Link>
          <button 
            type="submit" 
            className={`btn-primary flex items-center gap-2 min-w-[12rem] justify-center ${isSubmitting ? 'opacity-70' : ''}`} 
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1"></div>
            )}
            <SaveIcon className="w-4 h-4" />
            <span>{isEditing ? 'Update Client' : 'Create Client'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;