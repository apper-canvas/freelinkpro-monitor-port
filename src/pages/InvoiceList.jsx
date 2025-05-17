import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { invoices as mockInvoices, clients as mockClients } from '../utils/mockData';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'issueDate', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
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
  
  // Load data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setInvoices(mockInvoices);
      setClients(mockClients);
      setLoading(false);
    }, 500);
  }, []);
  
  // Filter and sort invoices
  useEffect(() => {
    let result = [...invoices];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(invoice => invoice.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter(invoice => {
        const client = clients.find(c => c.id === invoice.clientId);
        return (
          invoice.invoiceNumber.toLowerCase().includes(lowercasedTerm) ||
          (client && client.name.toLowerCase().includes(lowercasedTerm)) ||
          (client && client.company.toLowerCase().includes(lowercasedTerm)) ||
          invoice.status.toLowerCase().includes(lowercasedTerm)
        );
      });
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'client') {
        const clientA = clients.find(c => c.id === a.clientId)?.name || '';
        const clientB = clients.find(c => c.id === b.clientId)?.name || '';
        return sortConfig.direction === 'asc' ? clientA.localeCompare(clientB) : clientB.localeCompare(clientA);
      }
      
      if (sortConfig.key === 'amount') {
        return sortConfig.direction === 'asc' ? a.total - b.total : b.total - a.total;
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredInvoices(result);
    setCurrentPage(1);
  }, [invoices, searchTerm, statusFilter, sortConfig, clients]);
  
  // Get current invoices for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  
  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Delete invoice
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(invoice => invoice.id !== id));
      toast.success('Invoice deleted successfully!');
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
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <FilterIcon className="text-surface-500 w-5 h-5" />
            <select
              className="input max-w-[150px]"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
            {filteredInvoices.length === 0 ? (
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
                      {currentInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
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
                                to={`/invoices/${invoice.id}`}
                                className="text-primary hover:text-primary-dark p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                                title="View"
                              >
                                <EyeIcon className="w-5 h-5" />
                              </Link>
                              <Link
                                to={`/invoices/edit/${invoice.id}`}
                                className="text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-200 p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                                title="Edit"
                              >
                                <EditIcon className="w-5 h-5" />
                              </Link>
                              <button
                                onClick={() => handleDelete(invoice.id)}
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
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInvoices.length)} of {filteredInvoices.length} results
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-md border border-surface-200 dark:border-surface-700 disabled:opacity-50"
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