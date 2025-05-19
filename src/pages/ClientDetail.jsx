import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getClientById } from '../services/clientService';
import { fetchProjects } from '../services/projectService';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [client, setClient] = useState(null);
  const [clientProjects, setClientProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Icons
  const ChevronLeftIcon = getIcon('ChevronLeft');
  const EditIcon = getIcon('Edit');
  const MailIcon = getIcon('Mail');
  const PhoneIcon = getIcon('Phone');
  const MapPinIcon = getIcon('MapPin');
  const CalendarIcon = getIcon('Calendar');
  const TagIcon = getIcon('Tag');
  const BriefcaseIcon = getIcon('Briefcase');
  const ArrowRightIcon = getIcon('ArrowRight');
  
  useEffect(() => {
    const loadClientData = async () => {
      setIsLoading(true);
      try {
        // Fetch client details
        const clientData = await getClientById(id);
        if (!clientData) {
          toast.error('Client not found');
          navigate('/clients');
          return;
        }
        setClient(clientData);
        
        // Fetch projects for this client
        const projects = await fetchProjects({
          where: [
            {
              fieldName: "clientId",
              operator: "ExactMatch",
              values: [id]
            }
          ]
        });
        setClientProjects(projects);
      } catch (error) {
        console.error('Error loading client data:', error);
        toast.error('Failed to load client information');
        navigate('/clients');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClientData();
  }, [id, navigate]);
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  
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
  
  // Get project status badge class
  const getProjectStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'planning':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'review':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
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
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-surface-600 dark:text-surface-300 mb-2">Client not found</h3>
        <Link to="/clients" className="btn-primary mt-4">Back to Clients</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/clients" className="text-surface-500 hover:text-primary">
            <ChevronLeftIcon className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-surface-800 dark:text-surface-100">{client.name}</h1>
        </div>
        <Link to={`/clients/edit/${id}`} className="btn-outline flex items-center gap-2">
          <EditIcon className="w-4 h-4" />
          <span>Edit</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client info card */}
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">Client Details</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(client.status)}`}>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                {client.company && (
                  <div className="flex items-start gap-3">
                    <BriefcaseIcon className="w-5 h-5 text-surface-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">Company</div>
                      <div className="text-surface-800 dark:text-surface-200">{client.company}</div>
                    </div>
                  </div>
                )}
                
                {client.email && (
                  <div className="flex items-start gap-3">
                    <MailIcon className="w-5 h-5 text-surface-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">Email</div>
                      <a href={`mailto:${client.email}`} className="text-primary hover:text-primary-dark">{client.email}</a>
                    </div>
                  </div>
                )}
                
                {client.phone && (
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-surface-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">Phone</div>
                      <a href={`tel:${client.phone}`} className="text-primary hover:text-primary-dark">{client.phone}</a>
                    </div>
                  </div>
                )}
                
                {client.lastContact && (
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="w-5 h-5 text-surface-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">Last Contact</div>
                      <div className="text-surface-800 dark:text-surface-200">{formatDate(client.lastContact)}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                {client.address && (
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-surface-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">Address</div>
                      <div className="text-surface-800 dark:text-surface-200">{client.address}</div>
                    </div>
                  </div>
                )}
                
                {client.tags && client.tags.length > 0 && (
                  <div className="flex items-start gap-3">
                    <TagIcon className="w-5 h-5 text-surface-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-surface-500 dark:text-surface-400">Tags</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {client.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Projects count card */}
        <div className="md:col-span-1">
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100 mb-4">Statistics</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-primary/5 dark:bg-primary/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-md">
                    <BriefcaseIcon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-surface-700 dark:text-surface-300">Projects</span>
                </div>
                <span className="text-lg font-semibold text-surface-800 dark:text-surface-100">{clientProjects.length}</span>
              </div>
              
              <Link 
                to="/projects/new" 
                state={{ selectedClient: client.id }}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
              >
                <span>Start New Project</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Client projects */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-surface-800 dark:text-surface-100">Projects</h2>
          <Link to="/projects" className="text-primary hover:text-primary-dark text-sm">View All</Link>
        </div>
        
        {clientProjects.length === 0 ? (
          <div className="text-center py-8">
            <BriefcaseIcon className="w-12 h-12 mx-auto text-surface-400 dark:text-surface-500 mb-4" />
            <h3 className="text-lg font-medium text-surface-600 dark:text-surface-300 mb-2">No projects yet</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">Start a new project with this client</p>
            <Link 
              to="/projects/new" 
              state={{ selectedClient: client.id }}
              className="btn-primary"
            >
              Start New Project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Timeline</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                {clientProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-surface-50 dark:hover:bg-surface-800">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-surface-800 dark:text-surface-100">{project.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getProjectStatusBadge(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-surface-500 dark:text-surface-400">
                        {formatDate(project.startDate)} - {formatDate(project.dueDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-surface-800 dark:text-surface-100">${project.budget.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link to={`/projects/${project.id}`} className="text-primary hover:text-primary-dark text-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetail;