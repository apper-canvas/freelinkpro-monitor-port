import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getClientById, deleteClient } from '../services/clientService';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Icons
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const XCircleIcon = getIcon('XCircle');

  useEffect(() => {
    const loadClient = async () => {
      setIsLoading(true);
      try {
        const data = await getClientById(id);
        if (!data) {
          toast.error('Client not found');
          navigate('/clients');
          return;
        }
        setClient(data);
      } catch (error) {
        console.error('Error loading client:', error);
        toast.error('Failed to load client details');
        navigate('/clients');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClient();
  }, [id, navigate]);

  const confirmDelete = () => {
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteClient(id);
      toast.success('Client deleted successfully');
      navigate('/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

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

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/clients" className="text-surface-500 hover:text-primary">
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">
            Client Details
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          <Link to={`/clients/edit/${id}`} className="btn-outline flex items-center gap-2">
            <EditIcon className="w-4 h-4" />
            <span>Edit</span>
          </Link>
          <button
            onClick={confirmDelete}
            className="btn bg-red-600 hover:bg-red-700 text-white focus:ring-red-500/50 flex items-center gap-2"
          >
            <TrashIcon className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">{client.name}</h2>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(client.status)}`}>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {client.company && (
            <div>
              <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Company</h3>
              <p className="text-surface-800 dark:text-surface-100">{client.company}</p>
            </div>
          )}
          
          {client.email && (
            <div>
              <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Email</h3>
              <a href={`mailto:${client.email}`} className="text-primary hover:underline">{client.email}</a>
            </div>
          )}
          
          {client.phone && (
            <div>
              <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Phone</h3>
              <a href={`tel:${client.phone}`} className="text-primary hover:underline">{client.phone}</a>
            </div>
          )}
          
          {client.lastContact && (
            <div>
              <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">Last Contact</h3>
              <p className="text-surface-800 dark:text-surface-100">
                {new Date(client.lastContact).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        
        {client.tags && client.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {client.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-surface-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-2">
                <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100">Confirm Deletion</h3>
            </div>
            <p className="text-surface-600 dark:text-surface-300 mb-4">
              Are you sure you want to delete <span className="font-medium text-surface-800 dark:text-surface-100">{client.name}</span>? 
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

export default ClientDetail;