import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { invoices as mockInvoices, clients as mockClients, projects as mockProjects } from '../utils/mockData';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Icons
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const PrinterIcon = getIcon('Printer');
  const DownloadIcon = getIcon('Download');
  const MailIcon = getIcon('Mail');
  const DollarSignIcon = getIcon('DollarSign');
  const CheckCircleIcon = getIcon('CheckCircle');
  const XCircleIcon = getIcon('XCircle');
  const FileTextIcon = getIcon('FileText');
  
  // Load data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      const foundInvoice = mockInvoices.find(inv => inv.id === id);
      
      if (foundInvoice) {
        setInvoice(foundInvoice);
        setClient(mockClients.find(c => c.id === foundInvoice.clientId));
        setProject(mockProjects.find(p => p.id === foundInvoice.projectId));
      }
      
      setLoading(false);
    }, 500);
  }, [id]);
  
  // Handle delete invoice
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      // In a real app, this would be an API call
      toast.success('Invoice deleted successfully!');
      navigate('/invoices');
    }
  };
  
  // Handle record payment
  const handleRecordPayment = (e) => {
    e.preventDefault();
    
    if (!paymentAmount || isNaN(paymentAmount) || parseFloat(paymentAmount) <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }
    
    const amount = parseFloat(paymentAmount);
    
    // Calculate remaining amount
    const remaining = invoice.total - invoice.amountPaid;
    
    if (amount > remaining) {
      toast.error(`The maximum payment amount is $${remaining.toLocaleString()}`);
      return;
    }
    
    // In a real app, this would be an API call
    const updatedInvoice = {
      ...invoice,
      amountPaid: invoice.amountPaid + amount,
      paymentDate: new Date().toISOString().split('T')[0],
      status: amount >= remaining ? 'paid' : 'pending'
    };
    
    setInvoice(updatedInvoice);
    setShowPaymentModal(false);
    setPaymentAmount('');
    toast.success('Payment recorded successfully!');
  };
  
  // Handle print invoice
  const handlePrint = () => {
    window.print();
  };
  
  // Handle download PDF
  const handleDownloadPDF = () => {
    // In a real app, this would generate a PDF
    toast.info('PDF download functionality will be available soon');
  };
  
  // Handle send email
  const handleSendEmail = () => {
    // In a real app, this would send an email
    toast.success('Invoice sent to client successfully!');
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!invoice) {
    return (
      <div className="text-center py-16">
        <FileTextIcon className="mx-auto h-16 w-16 text-surface-400" />
        <h2 className="mt-4 text-2xl font-medium">Invoice Not Found</h2>
        <p className="mt-2 text-surface-500">The invoice you're looking for doesn't exist or has been removed.</p>
        <Link to="/invoices" className="btn-primary mt-6 inline-flex items-center">
          <ArrowLeftIcon className="mr-2 h-5 w-5" />
          Back to Invoices
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link to="/invoices" className="inline-flex items-center text-surface-600 hover:text-primary mb-2">
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            <span>Back to invoices</span>
          </Link>
          <h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="btn-outline flex items-center gap-1"
            title="Print Invoice"
          >
            <PrinterIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="btn-outline flex items-center gap-1"
            title="Download as PDF"
          >
            <DownloadIcon className="w-4 h-4" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={handleSendEmail}
            className="btn-outline flex items-center gap-1"
            title="Send via Email"
          >
            <MailIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Email</span>
          </button>
          <Link
            to={`/invoices/edit/${invoice.id}`}
            className="btn-secondary flex items-center gap-1"
            title="Edit Invoice"
          >
            <EditIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="btn-outline text-red-500 hover:text-red-700 hover:border-red-300 flex items-center gap-1"
            title="Delete Invoice"
          >
            <TrashIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
      
      {/* Status and Payment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-sm font-medium text-surface-500 mb-1">Status</div>
          <div className="flex items-center">
            <span className={`px-2.5 py-1 text-sm font-medium rounded-full ${getStatusBadge(invoice.status)}`}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="card p-4">
          <div className="text-sm font-medium text-surface-500 mb-1">Amount</div>
          <div className="text-xl font-bold">${invoice.total.toLocaleString()}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm font-medium text-surface-500 mb-1">Payment Status</div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <span>Paid</span>
              <span className="font-medium">${invoice.amountPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining</span>
              <span className="font-medium">${(invoice.total - invoice.amountPaid).toLocaleString()}</span>
            </div>
            {invoice.status !== 'paid' && (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn-primary mt-3 text-sm py-1.5"
              >
                <DollarSignIcon className="w-4 h-4 mr-1 inline" />
                Record Payment
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Invoice Details */}
      <div className="card overflow-hidden">
        <div className="bg-surface-100 dark:bg-surface-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-surface-800 dark:text-surface-100">FreeLinkPro</h2>
            <p className="text-surface-600 dark:text-surface-400 mt-1">Your Freelancing Business</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-primary">INVOICE</h3>
            <p className="text-surface-600 dark:text-surface-400">{invoice.invoiceNumber}</p>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-surface-500 mb-2">Bill To:</h3>
            {client && (
              <div>
                <p className="font-medium">{client.name}</p>
                <p>{client.company}</p>
                <p>{client.email}</p>
                <p>{client.phone}</p>
              </div>
            )}
          </div>
          <div className="md:text-right">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <p className="text-sm font-medium text-surface-500">Invoice Date:</p>
              <p className="text-right">{format(new Date(invoice.issueDate), 'MMM dd, yyyy')}</p>
              
              <p className="text-sm font-medium text-surface-500">Due Date:</p>
              <p className="text-right">{format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</p>
              
              {project && (
                <>
                  <p className="text-sm font-medium text-surface-500">Project:</p>
                  <p className="text-right">{project.name}</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Invoice Items */}
        <div className="px-6 pb-6">
          <table className="w-full border-t border-b border-surface-200 dark:border-surface-700">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="py-3 text-left">Description</th>
                <th className="py-3 text-right">Quantity</th>
                <th className="py-3 text-right">Rate</th>
                <th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-surface-200 dark:border-surface-700">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">${item.rate.toLocaleString()}</td>
                  <td className="py-3 text-right">${item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="mt-4 flex justify-end">
            <div className="w-full max-w-xs">
              <div className="flex justify-between py-2">
                <span className="text-surface-600 dark:text-surface-400">Subtotal</span>
                <span className="font-medium">${invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-surface-200 dark:border-surface-700">
                <span className="text-surface-600 dark:text-surface-400">Tax</span>
                <span className="font-medium">${invoice.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Total</span>
                <span>${invoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Notes */}
        {invoice.notes && (
          <div className="px-6 pb-6">
            <h3 className="text-sm font-medium text-surface-500 mb-2">Notes:</h3>
            <p className="text-surface-600 dark:text-surface-400">{invoice.notes}</p>
          </div>
        )}
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Record Payment</h2>
            <form onSubmit={handleRecordPayment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={invoice.total - invoice.amountPaid}
                  className="input"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="Enter payment amount"
                  required
                />
                <p className="text-sm text-surface-500 mt-1">
                  Remaining amount: ${(invoice.total - invoice.amountPaid).toLocaleString()}
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;