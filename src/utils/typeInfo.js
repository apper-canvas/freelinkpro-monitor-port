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

export default TypeInfo;