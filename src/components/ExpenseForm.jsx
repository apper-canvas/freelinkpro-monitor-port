import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const ExpenseForm = ({ isOpen, onClose, onSubmit, initialData, projectId }) => {
  const XIcon = getIcon('X');
  const CalendarIcon = getIcon('Calendar');
  const DollarSignIcon = getIcon('DollarSign');
  const TagIcon = getIcon('Tag');
  const FileTextIcon = getIcon('FileText');
  const ReceiptIcon = getIcon('Receipt');

  const expenseCategories = [
    'Software',
    'Hardware',
    'Office Supplies',
    'Travel',
    'Meals',
    'Subscription',
    'Contractor',
    'Marketing',
    'Other'
  ];

  const initialFormState = {
    id: '',
    projectId: projectId,
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    description: '',
    receipt: null,
    billable: true,
    reimbursable: false,
    createdAt: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [hasReceipt, setHasReceipt] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amount: initialData.amount.toString()
      });
      setHasReceipt(!!initialData.receipt);
    } else {
      setFormData({
        ...initialFormState,
        projectId: projectId
      });
      setHasReceipt(false);
    }
  }, [initialData, projectId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } 
    // Handle file input
    else if (type === 'file') {
      if (e.target.files && e.target.files[0]) {
        setFormData(prev => ({ ...prev, receipt: e.target.files[0] }));
        setHasReceipt(true);
      }
    } 
    // Handle all other inputs
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.amount.trim()) errors.amount = 'Amount is required';
    else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      errors.amount = 'Amount must be a positive number';
    }
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    const newExpense = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: formData.id || `expense-${Date.now()}`,
      createdAt: formData.createdAt || new Date().toISOString()
    };
    
    onSubmit(newExpense);
    onClose();
  };

  const removeReceipt = () => {
    setFormData(prev => ({ ...prev, receipt: null }));
    setHasReceipt(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Edit Expense' : 'Add New Expense'}
          </h2>
          <button onClick={onClose} className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Date*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarIcon className="h-5 w-5 text-surface-400" />
              </div>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`input pl-10 ${formErrors.date ? 'border-red-500 dark:border-red-500' : ''}`}
              />
            </div>
            {formErrors.date && <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>}
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Amount*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSignIcon className="h-5 w-5 text-surface-400" />
              </div>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`input pl-10 ${formErrors.amount ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="0.00"
              />
            </div>
            {formErrors.amount && <p className="mt-1 text-sm text-red-500">{formErrors.amount}</p>}
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Category*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <TagIcon className="h-5 w-5 text-surface-400" />
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`input pl-10 ${formErrors.category ? 'border-red-500 dark:border-red-500' : ''}`}
              >
                <option value="">Select a category</option>
                {expenseCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {formErrors.category && <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Description*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileTextIcon className="h-5 w-5 text-surface-400" />
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`input pl-10 ${formErrors.description ? 'border-red-500 dark:border-red-500' : ''}`}
                placeholder="Describe what this expense was for..."
              />
            </div>
            {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
              Receipt
            </label>
            
            {hasReceipt ? (
              <div className="flex items-center justify-between p-2 border border-surface-200 dark:border-surface-700 rounded-lg">
                <div className="flex items-center">
                  <ReceiptIcon className="h-5 w-5 text-surface-500 mr-2" />
                  <span className="text-sm text-surface-600 dark:text-surface-400">
                    Receipt attached
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={removeReceipt}
                  className="text-red-500 hover:text-red-700"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center p-4 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg">
                <label className="cursor-pointer flex flex-col items-center">
                  <ReceiptIcon className="h-6 w-6 text-surface-400 mb-2" />
                  <span className="text-sm text-surface-500 dark:text-surface-400">Click to attach receipt</span>
                  <input
                    type="file"
                    name="receipt"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                </label>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="billable"
                name="billable"
                checked={formData.billable}
                onChange={handleChange}
                className="w-4 h-4 rounded border-surface-300 text-primary focus:ring-primary"
              />
              <label htmlFor="billable" className="ml-2 text-sm text-surface-700 dark:text-surface-300">
                Billable to client
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="reimbursable"
                name="reimbursable"
                checked={formData.reimbursable}
                onChange={handleChange}
                className="w-4 h-4 rounded border-surface-300 text-primary focus:ring-primary"
              />
              <label htmlFor="reimbursable" className="ml-2 text-sm text-surface-700 dark:text-surface-300">
                Reimbursable
              </label>
            </div>
          </div>
          
          <div className="pt-4 border-t border-surface-200 dark:border-surface-700 mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {initialData ? 'Update Expense' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;