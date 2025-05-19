/**
 * TypeInfo utility
 * 
 * Provides information about field types in the database schema
 * Used for validations, form rendering, and data formatting
 */

// Define TypeInfo object with type definitions for different field types
const TypeInfo = {
  // Text Types
  Text: {
    component: 'input',
    inputType: 'text',
    validate: (value) => typeof value === 'string',
    format: (value) => value?.toString() || '',
    defaultValue: '',
  },
  MultilineText: {
    component: 'textarea',
    inputType: 'text',
    validate: (value) => typeof value === 'string',
    format: (value) => value?.toString() || '',
    defaultValue: '',
  },
  Email: {
    component: 'input',
    inputType: 'email',
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    format: (value) => value?.toString() || '',
    defaultValue: '',
  },
  Website: {
    component: 'input',
    inputType: 'url',
    validate: (value) => /^https?:\/\//.test(value),
    format: (value) => value?.toString() || '',
    defaultValue: '',
  },
  Phone: {
    component: 'input',
    inputType: 'tel',
    validate: (value) => /^[0-9+\-\s()]*$/.test(value),
    format: (value) => value?.toString() || '',
    defaultValue: '',
  },
  
  // Numeric Types
  Number: {
    component: 'input',
    inputType: 'number',
    validate: (value) => !isNaN(Number(value)),
    format: (value) => value?.toString() || '0',
    defaultValue: 0,
  },
  Decimal: {
    component: 'input',
    inputType: 'number',
    step: '0.01',
    validate: (value) => !isNaN(Number(value)),
    format: (value) => value?.toString() || '0',
    defaultValue: 0,
  },
  Currency: {
    component: 'input',
    inputType: 'number',
    step: '0.01',
    validate: (value) => !isNaN(Number(value)),
    format: (value) => value?.toString() || '0.00',
    defaultValue: 0,
  },
  
  // Date Types
  Date: {
    component: 'input',
    inputType: 'date',
    validate: (value) => !isNaN(Date.parse(value)),
    format: (value) => value ? new Date(value).toISOString().split('T')[0] : '',
    defaultValue: '',
  },
  DateTime: {
    component: 'input',
    inputType: 'datetime-local',
    validate: (value) => !isNaN(Date.parse(value)),
    format: (value) => value ? new Date(value).toISOString().slice(0, 16) : '',
    defaultValue: '',
  },
  
  // Selection Types
  Picklist: {
    component: 'select',
    validate: (value, options) => options.includes(value),
    format: (value) => value?.toString() || '',
    defaultValue: '',
  },
  MultiPicklist: {
    component: 'multiselect',
    validate: (value, options) => Array.isArray(value) && value.every(v => options.includes(v)),
    format: (value) => Array.isArray(value) ? value.join(',') : '',
    defaultValue: [],
  },
};

/**
 * Generates a validation error message for missing required fields
 * 
 * @param {Array} missingFields - Array of field names that are missing
 * @param {string} itemIdentifier - Optional identifier for the item (e.g., "Item 1")
 * @returns {string} - Formatted error message
 */
export const generateValidationErrorMessage = (missingFields, itemIdentifier = '') => {
  if (!missingFields || missingFields.length === 0) {
    return 'Validation failed. Please check the form and try again.';
  }
  
  const fieldList = missingFields.join(', ');
  const fieldsText = missingFields.length > 1 ? 'fields' : 'field';
  
  if (itemIdentifier) {
    return `${itemIdentifier} ${fieldsText} ${fieldList} are required`;
  }
  
  return `${fieldsText.charAt(0).toUpperCase() + fieldsText.slice(1)} ${fieldList} are required`;
};

/**
 * Checks if a value is empty or undefined
 * @param {any} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
export const isEmpty = (value) => value === null || value === undefined || value === '';

export default TypeInfo;