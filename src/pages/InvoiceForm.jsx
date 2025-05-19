import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { getInvoiceById, createInvoice, updateInvoice, fetchInvoices } from '../services/invoiceService';
import { fetchInvoiceItems, createInvoiceItems, deleteInvoiceItems, updateInvoiceItems } from '../services/invoiceItemService';
import { fetchClients } from '../services/clientService';
import { fetchProjects } from '../services/projectService';
import { generateValidationErrorMessage, isEmpty } from '../utils/typeInfo';

const InvoiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    Name: '',  // Required for the database
    clientId: '',
    projectId: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    status: 'pending',
    items: [{ id: `new-item-0`, description: '', quantity: 1, rate: 0, amount: 0, invoiceId: '' }],
    notes: '',
    subtotal: 0,
    tax: 0,
    total: 0,
    amountPaid: 0,
    paymentDate: null,
    // Add existing item IDs for editing (used to track which ones to delete)
    existingItemIds: []
  });
  
  // Data for dropdowns
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);
  
  // Icons
  const ArrowLeftIcon = getIcon('ArrowLeft');
  const PlusIcon = getIcon('Plus');
  const TrashIcon = getIcon('Trash');
  const SaveIcon = getIcon('Save');
  const AlertCircleIcon = getIcon('AlertCircle');
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch clients and projects for dropdowns
        const [clientsData, projectsData] = await Promise.all([
          fetchClients(),
          fetchProjects()
        ]);

        setClients(clientsData || []);
        setProjects(projectsData || []);

        // If editing, fetch the invoice and its items
        if (isEditing) {
          const invoice = await getInvoiceById(id);
          if (!invoice) {
            toast.error('Invoice not found');
            navigate('/invoices');
            return;
          }

          // Fetch invoice items
          const invoiceItems = await fetchInvoiceItems(id);

          // Format dates for form inputs
          const formattedInvoice = {
            ...invoice,
            issueDate: invoice.issueDate ? format(parseISO(invoice.issueDate), 'yyyy-MM-dd') : '',
            dueDate: invoice.dueDate ? format(parseISO(invoice.dueDate), 'yyyy-MM-dd') : '',
            paymentDate: invoice.paymentDate ? format(parseISO(invoice.paymentDate), 'yyyy-MM-dd') : null,
          };

          // Set up items with proper format
          const items = invoiceItems.length > 0 
            ? invoiceItems.map(item => ({
                Id: item.Id,
                id: item.Id,
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.amount,
                invoiceId: item.invoiceId
              }))
            : [{ description: '', quantity: 1, rate: 0, amount: 0, invoiceId: id }];

          setFormData({
            ...formattedInvoice,
            items,
            existingItemIds: invoiceItems.map(item => item.Id)
          });
        } else {
          // Generate a new invoice number for new invoices
          generateInvoiceNumber();
        }

        setInitialLoaded(true);
        setLoading(false);
      } catch (err) {
        console.error("Error loading form data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
        toast.error("Failed to load data. Please try again.");
      }
    };

    loadData();
  }, [id, isEditing, navigate]);

  // Generate a new invoice number
  const generateInvoiceNumber = async () => {
    try {
      // Get the current year
      const currentYear = new Date().getFullYear();
      
      // Fetch recent invoices to find the latest number
      const { data: recentInvoices } = await fetchInvoices({
        sortField: 'CreatedOn',
        sortDirection: 'desc',
        limit: 1
      });

      let newNumber = 1;
      
      // If there are existing invoices, increment the number
      if (recentInvoices && recentInvoices.length > 0) {
        const lastInvoice = recentInvoices[0];
        if (lastInvoice && lastInvoice.invoiceNumber) {
          const parts = lastInvoice.invoiceNumber.split('-');
          if (parts.length === 3) {
            const lastNumber = parseInt(parts[2], 10);
            if (!isNaN(lastNumber)) {
              newNumber = lastNumber + 1;
            } 
          }
        }
      }
      
      // Format the new invoice number
      const newInvoiceNumber = `INV-${currentYear}-${String(newNumber).padStart(3, '0')}`;
      
      setFormData(prev => ({
        ...prev,
        invoiceNumber: newInvoiceNumber,
        Name: newInvoiceNumber // Also set Name field which is required
      }));
    } catch (error) {
      console.error("Error generating invoice number:", error);
      // Fallback to a simple format if there's an error
      const timestamp = Date.now();
      const newInvoiceNumber = `INV-${timestamp}`;
      setFormData(prev => ({
        ...prev,
        invoiceNumber: newInvoiceNumber,
        Name: newInvoiceNumber
      }));
    }
  };


  // Filter projects when client changes
  useEffect(() => {
    if (initialLoaded && formData.clientId) {
      setFilteredProjects(projects.filter(project => project.clientId === formData.clientId));
    } else {
      setFilteredProjects([]);
    }
  }, [formData.clientId, projects, initialLoaded]);

  // Calculate totals when items change
  useEffect(() => {
    if (!initialLoaded) return;
    
    const subtotal = formData.items.reduce((sum, item) => sum + Number(item.amount), 0);
    const tax = subtotal * 0.1 || 0; // 10% tax rate
    const total = subtotal + tax || 0;
    
    setFormData(prev => ({
      ...prev,
      subtotal: subtotal,
      tax: tax,
      total: total
    }));
  }, [formData.items, initialLoaded]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update invoiceNumber field also updates Name field
    if (name === 'invoiceNumber') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        Name: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
      newItems[index].amount = Number(quantity) * Number(rate);
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
      items: [...prev.items, {
        // Generate a unique temporary ID for this new item
        id: `new-item-${prev.items.length}`,
        description: '', 
        quantity: 1, 
        rate: 0, 
        amount: 0,
        // If we're editing an existing invoice, set its ID for the new item
        invoiceId: id || '' // Set the invoiceId for new items
      }]
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
  const handleSubmit = async (e) => {
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
    
    // More detailed validation for items
    const invalidItems = formData.items.map((item, index) => {
      const missingFields = [];
      
      if (isEmpty(item.description)) {
        missingFields.push('description');
      }
      
      if (!item.quantity || item.quantity <= 0) {
        missingFields.push('quantity');
      }
      
      if (!item.rate || item.rate <= 0) {
        missingFields.push('rate');
      }
      
      return {
        index,
        missingFields
      };
    }).filter(item => item.missingFields.length > 0);
    
    if (invalidItems.length > 0) {
      // Generate error messages for each invalid item
      const firstInvalidItem = invalidItems[0];
      const itemNumber = firstInvalidItem.index + 1;
      const errorMessage = generateValidationErrorMessage(
        firstInvalidItem.missingFields,
        `Item ${itemNumber}`
      );
      toast.error(errorMessage);
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      let invoiceId = id;
      
      // Prepare invoice data (excluding items)
      const invoiceData = {
        Name: formData.invoiceNumber, // Required field
        invoiceNumber: formData.invoiceNumber,
        clientId: formData.clientId,
        projectId: formData.projectId || null,
        issueDate: formData.issueDate,
        dueDate: formData.dueDate,
        status: formData.status,
        subtotal: formData.subtotal,
        tax: formData.tax,
        total: formData.total,
        amountPaid: formData.amountPaid || 0,
        notes: formData.notes || '',
        paymentDate: formData.paymentDate
      };
      
      if (isEditing) {
        // Update existing invoice
        await updateInvoice(id, invoiceData);
        
        // Get IDs of existing items we need to keep
        const existingItemsToKeep = formData.items
          .filter(item => item.Id)
          .map(item => item.Id);
        
        // Determine which items to delete (those in existingItemIds but not in existingItemsToKeep)
        const itemsToDelete = formData.existingItemIds.filter(id => !existingItemsToKeep.includes(id));
        
        // Delete removed items
        if (itemsToDelete.length > 0) {
          await deleteInvoiceItems(itemsToDelete);
        }
        
        // Split items into those to update and those to create
        const itemsToUpdate = formData.items
          .filter(item => item.Id)
          .map(item => ({
            Id: item.Id,
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
            invoiceId: id,
            Name: `Item ${item.description.substring(0, 30)}` // Required field
          }));
        
        const itemsToCreate = formData.items
          .filter(item => !item.Id)
          .map(item => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
            invoiceId: id,
            Name: `Item ${item.description.substring(0, 30)}` // Required field
          }));
        
        // Update existing items
        if (itemsToUpdate.length > 0) {
          await updateInvoiceItems(itemsToUpdate);
        }
        
        // Create new items
        if (itemsToCreate.length > 0) {
          await createInvoiceItems(itemsToCreate);
        }
        
        toast.success('Invoice updated successfully!');
      } else {
        // Create new invoice
        const newInvoice = await createInvoice(invoiceData);
        invoiceId = newInvoice.Id;
        
        // Create invoice items with the new invoice ID
        const itemsWithInvoiceId = formData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount,
          invoiceId: invoiceId,
          Name: `Item ${item.description.substring(0, 30)}` // Required field
        }));
        
        await createInvoiceItems(itemsWithInvoiceId);
        
        toast.success('Invoice created successfully!');
      }
      
      // Navigate back to invoice list
      navigate('/invoices');
    } catch (err) {
      console.error("Error saving invoice:", err);
      setError("Failed to save invoice. Please try again.");
      toast.error("Failed to save invoice. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="card p-8 text-center">
        <AlertCircleIcon className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-medium text-red-500">Error</h3>
        <p className="mt-1 text-surface-500">{error}</p>
        <div className="mt-6 flex justify-center space-x-4">
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
          <Link to="/invoices" className="btn-outline">
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

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
                {clients.map((client) => (
                  <option key={client.Id} value={client.Id}>
                    {client.Name} ({client.company})
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
                value={formData.projectId || ''}
                onChange={handleInputChange}
                disabled={!formData.clientId}
              >
                <option value="">Select a project</option>
                {filteredProjects.map((project) => (
                  <option key={project.Id} value={project.Id}>
                    {project.Name}
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
              <div key={item.id || item.Id || `item-${index}`} className="grid grid-cols-12 gap-4">
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
              value={formData.notes || ''}
              onChange={handleInputChange}
              placeholder="Additional notes or payment instructions..."
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Link to="/invoices" className="btn-outline">
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn-primary flex items-center gap-1"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{isEditing ? 'Updating Invoice...' : 'Creating Invoice...'}</span>
              </>
            ) : (
              <>
                <SaveIcon className="w-5 h-5" />
                <span>{isEditing ? 'Update Invoice' : 'Create Invoice'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;