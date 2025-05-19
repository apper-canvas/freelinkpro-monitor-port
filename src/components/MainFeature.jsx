import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { fetchClients, createClient, deleteClient as deleteClientService } from '../services/clientService';
import { getIcon } from '../utils/iconUtils';

const MainFeature = ({ clients, setClients }) => {
  // Getting icons
  const SearchIcon = getIcon('Search');
  const PlusIcon = getIcon('Plus'); 
  const UserIcon = getIcon('User');
  const BuildingIcon = getIcon('Building2');
  const AtSignIcon = getIcon('AtSign');
  const PhoneIcon = getIcon('Phone');
  const TagIcon = getIcon('Tag');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash2');
  const CloseIcon = getIcon('X');
  const CheckIcon = getIcon('Check');
  const CalendarIcon = getIcon('Calendar');
  
  // Local state for client form
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    status: 'active',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch clients on component mount
  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        const clientsData = await fetchClients();
        setClients(clientsData);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast.error("Failed to load clients. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (clients.length === 0) {
      loadClients();
    }
  }, [setClients, clients.length]);

  // Reset form when showing/hiding
  useEffect(() => {
    if (!showForm) {
      setSelectedClient(null);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        status: 'active',
        tags: [],
      });
      setTagInput('');
    }
  }, [showForm]);

  // Update form data when a client is selected for editing
  useEffect(() => {
    if (selectedClient) {
      const client = clients.find(c => c.id === selectedClient);
      if (client) {
        setFormData({
          name: client.name,
          company: client.company,
          email: client.email,
          phone: client.phone,
          status: client.status,
          tags: client.tags || [],
        });
      }
    }
  }, [selectedClient, clients]);

  // Filter clients based on search term and status filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'all' || 
      client.status === filterStatus;
      
    return matchesSearch && matchesStatus;
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle tag input
  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  // Add a tag
  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle tag input key press (add tag on Enter)
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Handle form submission with service integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Basic validation
      if (!formData.name.trim() || !formData.email.trim()) {
        toast.error('Name and email are required fields');
        return;
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }
      
      setIsSubmitting(true);
      
      if (!selectedClient) {
        // Create new client using service
        const newClient = await createClient({
          ...formData,
          lastContact: new Date().toISOString().split('T')[0]
        });
        
        setClients(prevClients => [...prevClients, newClient]);
        toast.success('Client added successfully');
      } else {
        // For now, just update in local state
        // In a real implementation, you would call an updateClient service here
        const updatedClients = clients.map(client => 
          client.id === selectedClient 
            ? { 
                ...client, 
                ...formData,
                lastContact: client.lastContact // Preserve original lastContact
              } 
            : client
        );
        setClients(updatedClients);
        toast.success('Client updated successfully');
      }
      
      // Reset form and close it
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting client:', error);
      toast.error(error.message || 'Failed to save client. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation dialog
  const confirmDelete = (clientId) => {
    setDeleteConfirmation(clientId);
  };

  // Handle actual deletion with service
  const handleDeleteClient = async (clientId) => {
    try {
      setIsDeleting(true);
      await deleteClientService(clientId);
      setClients(clients.filter(client => client.id !== clientId));
      toast.success('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client. Please try again.');
    } finally {
      setIsDeleting(false);
      setDeleteConfirmation(null);
    }
  };

  // Cancel deletion operation
  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  // Open edit form for an existing client
  const editClient = (clientId) => {
    setSelectedClient(clientId);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-semibold">Client Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center gap-2"
        >
          <span>Add New Client</span>
        </button>
      </div>
        
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="sm:w-48">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="card p-12 text-center animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-full bg-surface-200 dark:bg-surface-700 mb-4"></div>
          <div className="h-6 bg-surface-200 dark:bg-surface-700 rounded w-48 mx-auto mb-2"></div>
          <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-64 mx-auto mb-6"></div>
          <div className="h-10 bg-surface-200 dark:bg-surface-700 rounded w-32 mx-auto"></div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="card p-12 text-center">
          <UserIcon className="w-12 h-12 mx-auto text-surface-300 dark:text-surface-600 mb-4" />
          <h3 className="text-lg font-medium text-surface-800 dark:text-surface-200 mb-2">
            No clients found
          </h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            {searchTerm || filterStatus !== 'all' ? 
              'Try adjusting your search or filters' : 
              'Add your first client to get started'}
          </p>
          {(searchTerm || filterStatus !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="btn-outline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-surface-50 dark:bg-surface-800/50 text-surface-600 dark:text-surface-300 text-sm rounded-lg overflow-hidden">
              <tr>
                <th className="px-6 py-4 text-left font-medium rounded-l-lg">Client</th>
                <th className="px-6 py-4 text-left font-medium hidden md:table-cell">Contact</th>
                <th className="px-6 py-4 text-left font-medium hidden lg:table-cell">Tags</th>
                <th className="px-6 py-4 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
              {filteredClients.map(client => (
                <tr 
                  key={client.id} 
                  className="bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-primary shadow-sm flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-medium">{client.name.charAt(0)}</span>
                      </div> 
                      <div>
                        <div className="font-medium text-surface-800 dark:text-surface-100">{client.name}</div>
                        <div className="text-sm text-surface-500 dark:text-surface-400">{client.company}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-surface-600 dark:text-surface-300">
                        <AtSignIcon className="w-4 h-4" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-surface-500 dark:text-surface-400 mt-1">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-2">
                      {client.tags && client.tags.map((tag, idx) => {
                        return (
                        <span key={idx} className="tag">
                          {tag}
                        </span>
                      )})}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span 
                      className={`px-2 py-1 text-xs rounded-full font-medium 
                      ${client.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' : 
                        client.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400' : 
                        'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-400'}`}
                    >
                      {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => editClient(client.id)}
                        className="p-1.5 text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light transition-colors rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                        aria-label="Edit client"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => confirmDelete(client.id)}
                        className="p-1.5 text-surface-500 hover:text-accent dark:text-surface-400 dark:hover:text-accent transition-colors rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700"
                        aria-label="Delete client"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      
                      {deleteConfirmation === client.id && (
                        <div className="absolute right-0 mt-16 mr-4 bg-white dark:bg-surface-700 shadow-lg rounded-lg p-4 z-10 w-64 border border-surface-200 dark:border-surface-600">
                          <p className="text-sm text-surface-700 dark:text-surface-300 mb-4">
                            Are you sure you want to delete this client?
                          </p>
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={cancelDelete}
                              className="px-2 py-1 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDeleteClient(client.id)}
                              className={`px-2 py-1 text-xs font-medium text-white bg-accent hover:bg-accent/90 rounded ${isDeleting ? 'opacity-70 cursor-wait' : ''}`}
                              disabled={isDeleting}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Client Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-surface-200 dark:border-surface-700 p-4">
                <h3 className="text-lg font-semibold">
                  {selectedClient ? 'Edit Client' : 'Add New Client'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-4">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Client Name*
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Smith"
                        className="input pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Company
                    </label>
                    <div className="relative">
                      <BuildingIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Inc."
                        className="input pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Email Address*
                    </label>
                    <div className="relative">
                      <AtSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className="input pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                        className="input pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Client Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="input"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Tags
                    </label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 p-2 border border-surface-200 dark:border-surface-700 rounded-lg bg-surface-50 dark:bg-surface-800 min-h-[42px]">
                        {formData.tags.map((tag, idx) => (
                          <div key={idx} className="tag flex items-center gap-1 pl-2 pr-1 py-1">
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-surface-400/20"
                            >
                              <CloseIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" />
                          <input
                            type="text"
                            id="tagInput"
                            value={tagInput}
                            onChange={handleTagInput}
                            onKeyPress={handleTagKeyPress}
                            placeholder="Add a tag..."
                            className="input pl-10"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addTag}
                          className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        >
                          <PlusIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`w-full btn-primary flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
                      disabled={isSubmitting}
                    >
                      <CheckIcon className="w-5 h-5" />
                      <span>{selectedClient ? 'Update Client' : 'Add Client'}</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;