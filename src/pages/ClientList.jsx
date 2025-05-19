import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { fetchClients, deleteClient } from '../services/clientService';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Icons
  const PlusIcon = getIcon('Plus');
  const SearchIcon = getIcon('Search');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const UserIcon = getIcon('User');
  const ChevronRightIcon = getIcon('ChevronRight');
  const XCircleIcon = getIcon('XCircle');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteClient(clientToDelete.id);
      setClients(clients.filter(client => client.id !== clientToDelete.id));
      toast.success('Client deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter clients based on search term and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      searchTerm === '' || 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);
      
    const matchesStatus = 
      statusFilter === 'all' || 
      client.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">Clients</h1>
        <Link to="/clients/new" className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-4 h-4" />
          <span>Add Client</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        {/* Search bar */}
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-surface-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-3">
          <label htmlFor="statusFilter" className="text-sm font-medium text-surface-700 dark:text-surface-300">
            Status:
          </label>
          <select
            id="statusFilter"
            className="input w-auto"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Clients list */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12 card">
          <UserIcon className="w-12 h-12 mx-auto text-surface-400 dark:text-surface-500 mb-4" />
          <h3 className="text-lg font-medium text-surface-600 dark:text-surface-300 mb-2">No clients found</h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search filters'
              : 'Add your first client to get started'}
          </p>
          <Link to="/clients/new" className="btn-primary">
            Add New Client
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <div key={client.id} className="card hover:shadow-lg transition-shadow duration-200">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Link to={`/clients/${client.id}`} className="text-lg font-semibold text-surface-800 dark:text-surface-100 hover:text-primary">
                      {client.name}
                    </Link>
                    {client.company && (
                      <div className="text-surface-600 dark:text-surface-300 text-sm mt-1">
                        {client.company}
                      </div>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(client.status)}`}>
                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  {client.email && (
                    <div className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 text-surface-500 mt-0.5">{getIcon('Mail')({ size: 16 })}</div>
                      <a href={`mailto:${client.email}`} className="text-surface-600 dark:text-surface-300 hover:text-primary">
                        {client.email}
                      </a>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 text-surface-500 mt-0.5">{getIcon('Phone')({ size: 16 })}</div>
                      <a href={`tel:${client.phone}`} className="text-surface-600 dark:text-surface-300 hover:text-primary">
                        {client.phone}
                      </a>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-start gap-2 text-sm">
                      <div className="w-5 h-5 text-surface-500 mt-0.5">{getIcon('MapPin')({ size: 16 })}</div>
                      <span className="text-surface-600 dark:text-surface-300">
                        {client.address}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Link to={`/clients/edit/${client.id}`} className="p-1.5 rounded-md text-surface-500 hover:text-primary hover:bg-surface-100 dark:hover:bg-surface-700">
                      <EditIcon className="w-4 h-4" />
                    </Link>
                    <button 
                      onClick={() => confirmDelete(client)}
                      className="p-1.5 rounded-md text-surface-500 hover:text-red-500 hover:bg-surface-100 dark:hover:bg-surface-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <Link 
                    to={`/clients/${client.id}`}
                    className="inline-flex items-center text-sm text-primary hover:text-primary-dark"
                  >
                    <span className="mr-1">Details</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteModal && clientToDelete && (
        <div className="fixed inset-0 bg-surface-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-2">
                <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100">Confirm Deletion</h3>
            </div>
            <p className="text-surface-600 dark:text-surface-300 mb-4">
              Are you sure you want to delete <span className="font-medium text-surface-800 dark:text-surface-100">{clientToDelete.name}</span>? 
              This action cannot be undone and will remove all client data.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowDeleteModal(false)} 
                className="btn-outline"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50 flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting && (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                )}
                <TrashIcon className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;