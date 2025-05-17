import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const TimeEntryForm = ({ isOpen, onClose, onSubmit, initialData = null, projectId }) => {
  const isEditing = !!initialData;
  
  const initialFormState = {
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    description: '',
    duration: 0
  };

  const [formData, setFormData] = useState(initialFormState);
  const [formErrors, setFormErrors] = useState({});
  const [isCalculatingDuration, setIsCalculatingDuration] = useState(false);

  // Icons
  const XIcon = getIcon('X');
  const ClockIcon = getIcon('Clock');
  const CalendarIcon = getIcon('Calendar');
  const FileTextIcon = getIcon('FileText');
  const SaveIcon = getIcon('Save');

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        date: initialData.date,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
        description: initialData.description,
        duration: initialData.duration
      });
    } else {
      setFormData(initialFormState);
    }
  }, [isEditing, initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }

    // If start or end time changes, calculate duration
    if (name === 'startTime' || name === 'endTime') {
      calculateDuration();
    }
  };

  const calculateDuration = () => {
    const { startTime, endTime } = formData;
    
    if (startTime && endTime) {
      setIsCalculatingDuration(true);
      
      try {
        // Convert the times to Date objects for comparison
        const startDate = new Date(`2000-01-01T${startTime}`);
        const endDate = new Date(`2000-01-01T${endTime}`);
        
        // Calculate the difference in milliseconds
        let differenceMs = endDate - startDate;
        
        // Handle the case where end time is on the next day
        if (differenceMs < 0) {
          differenceMs += 24 * 60 * 60 * 1000; // Add 24 hours
        }
        
        // Convert milliseconds to hours and minutes
        const hours = differenceMs / (1000 * 60 * 60);
        
        // Round to 2 decimal places
        const duration = Math.round(hours * 100) / 100;
        
        setFormData(prev => ({ ...prev, duration }));
      } catch (error) {
        console.error('Error calculating duration:', error);
      } finally {
        setIsCalculatingDuration(false);
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.startTime) errors.startTime = 'Start time is required';
    if (!formData.endTime) errors.endTime = 'End time is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    
    // Check if end time is after start time
    if (formData.startTime && formData.endTime) {
      const startDate = new Date(`2000-01-01T${formData.startTime}`);
      const endDate = new Date(`2000-01-01T${formData.endTime}`);
      
      if (endDate <= startDate && formData.duration <= 0) {
        errors.endTime = 'End time must be after start time';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    const timeEntryData = {
      ...formData,
      id: initialData?.id || `time-${Date.now()}`,
      projectId,
      createdAt: new Date().toISOString()
    };
    
    onSubmit(timeEntryData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div 
        className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex justify-between items-center p-5 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Edit Time Entry' : 'Add Time Entry'}
          </h2>
          <button onClick={onClose} className="text-surface-500 hover:text-surface-700 dark:hover:text-surface-300">
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Date*</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" size={18} />
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} 
                className={`input pl-10 ${formErrors.date ? 'border-red-500' : ''}`} />
            </div>
            {formErrors.date && <p className="mt-1 text-sm text-red-500">{formErrors.date}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Start Time*</label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" size={18} />
                <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} 
                  className={`input pl-10 ${formErrors.startTime ? 'border-red-500' : ''}`} />
              </div>
              {formErrors.startTime && <p className="mt-1 text-sm text-red-500">{formErrors.startTime}</p>}
            </div>
            
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">End Time*</label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" size={18} />
                <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} 
                  className={`input pl-10 ${formErrors.endTime ? 'border-red-500' : ''}`} />
              </div>
              {formErrors.endTime && <p className="mt-1 text-sm text-red-500">{formErrors.endTime}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Description*</label>
            <div className="relative">
              <FileTextIcon className="absolute left-3 top-3 text-surface-500" size={18} />
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3}
                className={`input pl-10 ${formErrors.description ? 'border-red-500' : ''}`} 
                placeholder="What did you work on?"></textarea>
            </div>
            {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Duration (hours)</label>
            <input type="number" id="duration" name="duration" value={formData.duration} onChange={handleChange} 
              className="input" step="0.25" min="0.25" />
            {isCalculatingDuration && <p className="mt-1 text-xs text-surface-500">Calculating...</p>}
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary flex items-center gap-2">
              <SaveIcon className="w-4 h-4" />
              <span>{isEditing ? 'Update' : 'Save'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TimeEntryForm;