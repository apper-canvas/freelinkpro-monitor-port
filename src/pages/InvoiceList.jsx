import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { fetchInvoices, deleteInvoice } from '../services/invoiceService';
import { fetchClients } from '../services/clientService';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'issueDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  
  // Icons
  const PlusIcon = getIcon('PlusCircle');
  const SearchIcon = getIcon('Search');
  const FilterIcon = getIcon('Filter');
  const EyeIcon = getIcon('Eye');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const SortIcon = getIcon('ArrowUpDown');
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const ArrowRightIcon = getIcon('ArrowRight');
  const FilePlusIcon = getIcon('FilePlus');
  const AlertCircleIcon = getIcon('AlertCircle');
  
  // Load invoice data with filtering, sorting and pagination
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Convert sort key for backend compatibility
        let sortField = sortConfig.key;
        if (sortField === 'client') {
          sortField = 'clientId';
        } else if (sortField === 'amount') {
          sortField = 'total';
        }
        
        // Fetch invoices from the service
        const { data, total } = await fetchInvoices({
          searchTerm,
          status: statusFilter,
          sortField,
          sortDirection: sortConfig.direction,
          page: currentPage,
          limit: itemsPerPage
        });
        
        setInvoices(data);
        setTotalInvoices(total);
        
        // Load clients for display purposes
        const clientsData = await fetchClients();
        setClients(clientsData || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading invoices:", err);
        setError("Failed to load invoices. Please try again.");
        setLoading(false);
        toast.error("Failed to load invoices. Please try again.");
      }
    };
    
    loadData();
  }, [searchTerm, statusFilter, sortConfig, currentPage, itemsPerPage]);
  
  // Calculate pagination
  const totalPages = Math.ceil(totalInvoices / itemsPerPage);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }
    setCurrentPage(newPage);
  };

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting changes
  };
  
  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  // Handle status filter
  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Delete invoice
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteInvoice(id);
      // Refresh the list
      const { data, total } = await fetchInvoices({
        status: statusFilter, sortField: sortConfig.key, sortDirection: sortConfig.direction,
        page: currentPage, limit: itemsPerPage });
      setInvoices(data);
      setTotalInvoices(total);
      toast.success('Invoice deleted successfully');
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast.error("Failed to delete invoice. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Get status badge class
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300';
    }
  };
  
  // Get client name
  const getClientName = (clientId) => {
    const client = clients.find(c => c.Id === clientId);
    return client ? client.Name : 'Unknown Client';
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link to="/invoices/new" className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          <span>New Invoice</span>
        </Link>
      </div>
      
      <div className="card p-5">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="input pl-10"
              value={searchTerm || ''}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <FilterIcon className="text-surface-500 w-5 h-5" />
            <select
              className="input max-w-[150px]"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {error ? (
              <div className="text-center py-20">
                <AlertCircleIcon className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-lg font-medium text-red-500">Error Loading Data</h3>
                <p className="mt-1 text-surface-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary mt-6"
                >
                  Retry
                </button>
              </div>
            ) : invoices.length === 0 ? (
              <div className="text-center py-20">
                <FilePlusIcon className="mx-auto h-12 w-12 text-surface-400" />
                <h3 className="mt-4 text-lg font-medium">No invoices found</h3>
                <p className="mt-1 text-surface-500">Create your first invoice or try a different search.</p>
                <Link to="/invoices/new" className="btn-primary mt-6 inline-flex items-center">
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Create Invoice
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                    <thead>
                      <tr>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('invoiceNumber')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Invoice #</span>
                            <SortIcon className="w-4 h-4" />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('client')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Client</span>
                            <SortIcon className="w-4 h-4" />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('issueDate')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Issue Date</span>
                            <SortIcon className="w-4 h-4" />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('dueDate')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Due Date</span>
                            <SortIcon className="w-4 h-4" />
                          </div>
                        </th>
                        <th 
                          className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort('amount')}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Amount</span>
                            <SortIcon className="w-4 h-4" />
                          </div>
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                    {invoices.map((invoice) => (
                      <tr key={invoice.Id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">{invoice.invoiceNumber}</div>
                        </td> 
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm">{getClientName(invoice.clientId)}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm">{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium">${invoice.total.toLocaleString()}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(invoice.status)}`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                              to={`/invoices/${invoice.Id}`}
                                className="text-primary hover:text-primary-dark p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                                title="View"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </Link>
                              <Link
                              to={`/invoices/edit/${invoice.Id}`}
                                className="text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-200 p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                                title="Edit"
                              >
                                <EditIcon className="w-5 h-5" />
                              </Link>
                              <button
                              onClick={() => handleDelete(invoice.Id)}
                                className="text-surface-600 hover:text-red-600 dark:text-surface-400 dark:hover:text-red-400 p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                                title="Delete"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center pt-5 border-t border-surface-200 dark:border-surface-700 mt-5">
                    <div className="text-sm text-surface-500 dark:text-surface-400"> 
                      Showing page {currentPage} of {totalPages} ({totalInvoices} total results)
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-surface-200 dark:border-surface-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowLeftIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-md border border-surface-200 dark:border-surface-700 disabled:opacity-50"
                      >
                        <ArrowRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;