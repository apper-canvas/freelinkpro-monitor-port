import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { invoices as mockInvoices, clients as mockClients, projects as mockProjects } from '../utils/mockData';

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientId: '',
    projectId: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    status: 'pending',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    notes: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    amountPaid: 0,
    paymentDate: null
  });
  
  // Data for dropdowns
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Icons
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash');
  const SaveIcon = getIcon('Save');
  
  // Load data
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      setClients(mockClients);
      setProjects(mockProjects);
      
      if (isEditing) {
        const invoice = mockInvoices.find(inv => inv.id === id);
        if (invoice) {
          setFormData(invoice);
        } else {
          toast.error('Invoice not found');
          navigate('/invoices');
        }
      } else {
        // Generate a new invoice number
        const lastInvoice = mockInvoices.sort((a, b) => 
          Number(a.invoiceNumber.split('-')[2]) - Number(b.invoiceNumber.split('-')[2])
        ).pop();
        
        const lastNumber = lastInvoice ? Number(lastInvoice.invoiceNumber.split('-')[2]) : 0;
        const newInvoiceNumber = `INV-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(3, '0')}`;
        
        setFormData(prev => ({
          ...prev,
          invoiceNumber: newInvoiceNumber
        }));
      }
      
      setLoading(false);
    }, 500);
  }, [id, isEditing, navigate]);
  
  // Filter projects when client changes
  useEffect(() => {
    if (formData.clientId) {
      setFilteredProjects(projects.filter(project => project.clientId === formData.clientId));
    } else {
      setFilteredProjects([]);
    }
  }, [formData.clientId, projects]);
  
  // Calculate totals when items change
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * 0.1; // 10% tax rate
    const total = subtotal + tax;
    
    setFormData(prev => ({
      ...prev,
      subtotal: subtotal,
      tax: tax,
      total: total
    }));
  }, [formData.items]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle client change
  const handleClientChange = (e) => {
    const clientId = e.target.value;
    setFormData(prev => ({
      ...prev,
      clientId: clientId,
      projectId: '' // Reset project when client changes
    }));
  };
  
  // Handle item change
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    
    newItems[index][field] = value;
    
    // Recalculate amount
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? value : newItems[index].quantity;
      const rate = field === 'rate' ? value : newItems[index].rate;
      newItems[index].amount = quantity * rate;
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };
  
  // Add new item
  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };
  
  // Remove item
  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) {
      toast.error('Invoice must have at least one item');
      return;
    }
    
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.clientId) {
      toast.error('Please select a client');
      return;
    }
    
    if (!formData.invoiceNumber) {
      toast.error('Invoice number is required');
      return;
    }
    
    const hasInvalidItem = formData.items.some(item => 
      !item.description || item.quantity <= 0 || item.rate <= 0
    );
    
    if (hasInvalidItem) {
      toast.error('All items must have a description, quantity, and rate');
      return;
    }
    
    // In a real app, this would be an API call
    setTimeout(() => {
      if (isEditing) {
        toast.success('Invoice updated successfully!');
      } else {
        toast.success('Invoice created successfully!');
      }
      navigate('/invoices');
    }, 500);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link to="/invoices" className="inline-flex items-center text-surface-600 hover:text-primary mb-2">
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            <span>Back to invoices</span>
          </Link>
          <h1 className="text-2xl font-bold">{isEditing ? 'Edit Invoice' : 'Create Invoice'}</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                name="invoiceNumber"
                className="input"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
                placeholder="INV-2023-001"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Status
              </label>
              <select
                name="status"
                className="input"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Client
              </label>
              <select
                name="clientId"
                className="input"
                value={formData.clientId}
                onChange={handleClientChange}
                required
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.company})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Project (Optional)
              </label>
              <select
                name="projectId"
                className="input"
                value={formData.projectId}
                onChange={handleInputChange}
                disabled={!formData.clientId}
              >
                <option value="">Select a project</option>
                {filteredProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                name="issueDate"
                className="input"
                value={formData.issueDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                className="input"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Invoice Items</h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="btn-outline flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-6">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    placeholder="Service description"
                    required
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Qty
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    min="1"
                    step="1"
                    required
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Rate ($)
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Amount
                  </label>
                  <div className="input bg-surface-100 dark:bg-surface-700 flex items-center justify-end">
                    ${item.amount.toLocaleString()}
                  </div>
                </div>
                <div className="col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-surface-500 hover:text-red-500 transition-colors"
                    title="Remove Item"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 border-t border-surface-200 dark:border-surface-700 pt-4">
            <div className="flex justify-end">
              <div className="w-full max-w-xs">
                <div className="flex justify-between py-2">
                  <span className="text-surface-600 dark:text-surface-400">Subtotal</span>
                  <span className="font-medium">${formData.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-surface-600 dark:text-surface-400">Tax (10%)</span>
                  <span className="font-medium">${formData.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-lg font-bold">
                  <span>Total</span>
                  <span>${formData.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              className="input min-h-24"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes or payment instructions..."
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link to="/invoices" className="btn-outline">
            Cancel
          </Link>
          <button type="submit" className="btn-primary flex items-center gap-1">
            <SaveIcon className="w-5 h-5" />
            <span>{isEditing ? 'Update Invoice' : 'Create Invoice'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;