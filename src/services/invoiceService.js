/**
 * Invoice Service
 * 
 * Provides methods for interacting with the invoice1 table in the database.
 */

// Initialize ApperClient with environment variables
const getClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Table name from the database schema
const TABLE_NAME = 'invoice1';

// Fields to fetch when getting invoices (all fields)
const INVOICE_FIELDS = [
  'Id',
  'Name',
  'Tags',
  'Owner',
  'CreatedOn',
  'CreatedBy',
  'ModifiedOn',
  'ModifiedBy',
  'invoiceNumber',
  'issueDate',
  'dueDate',
  'status',
  'subtotal',
  'tax',
  'total',
  'amountPaid',
  'notes',
  'paymentDate',
  'clientId',
  'projectId'
];

// Fields that can be updated (only those with fieldVisibility: "Updateable")
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'invoiceNumber',
  'issueDate',
  'dueDate',
  'status',
  'subtotal',
  'tax',
  'total',
  'amountPaid',
  'notes',
  'paymentDate',
  'clientId',
  'projectId'
];

/**
 * Fetch invoices from the database with optional filtering, sorting, and pagination
 * 
 * @param {Object} options - Query options
 * @param {string} options.searchTerm - Text to search for
 * @param {string} options.status - Status filter (pending, paid, overdue)
 * @param {string} options.sortField - Field to sort by
 * @param {string} options.sortDirection - Sort direction (asc, desc)
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Items per page
 * @returns {Promise<{data: Array, total: number}>} Invoices and total count
 */
export const fetchInvoices = async (options = {}) => {
  try {
    const { 
      searchTerm, 
      status, 
      sortField = 'issueDate', 
      sortDirection = 'desc',
      page = 1, 
      limit = 10 
    } = options;
    
    const apperClient = getClient();
    
    // Build query parameters
    const params = {
      fields: INVOICE_FIELDS,
      orderBy: [
        {
          field: sortField,
          direction: sortDirection
        }
      ],
      pagingInfo: {
        limit: limit,
        offset: (page - 1) * limit
      }
    };
    
    // Add status filter if specified
    if (status && status !== 'all') {
      params.where = [
        {
          fieldName: 'status',
          operator: 'ExactMatch',
          values: [status]
        }
      ];
    }
    
    // Add search term filter if specified
    if (searchTerm) {
      // If we already have a where condition, use whereGroups to combine
      if (params.where) {
        params.whereGroups = [
          {
            operator: 'AND',
            subGroups: [
              {
                conditions: params.where,
                operator: ''
              },
              {
                conditions: [
                  {
                    fieldName: 'invoiceNumber',
                    operator: 'Contains',
                    values: [searchTerm]
                  }
                ],
                operator: 'OR'
              }
            ]
          }
        ];
        // Remove the original where since we're using whereGroups
        delete params.where;
      } else {
        params.where = [
          {
            fieldName: 'invoiceNumber',
            operator: 'Contains',
            values: [searchTerm]
          }
        ];
      }
    }

    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return { 
      data: response.data || [],
      total: response.totalCount || 0
    };
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

/**
 * Fetch a single invoice by its ID
 * 
 * @param {string} id - Invoice ID
 * @returns {Promise<Object>} Invoice data
 */
export const getInvoiceById = async (id) => {
  try {
    const apperClient = getClient();
    const response = await apperClient.getRecordById(TABLE_NAME, id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching invoice with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new invoice
 * 
 * @param {Object} invoiceData - Invoice data (only updateable fields)
 * @returns {Promise<Object>} Created invoice
 */
export const createInvoice = async (invoiceData) => {
  try {
    // Filter out any non-updateable fields
    const updateableData = {};
    UPDATEABLE_FIELDS.forEach(field => {
      if (invoiceData[field] !== undefined) {
        updateableData[field] = invoiceData[field];
      }
    });
    
    const apperClient = getClient();
    const response = await apperClient.createRecord(TABLE_NAME, { records: [updateableData] });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create invoice');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

/**
 * Update an existing invoice
 * 
 * @param {string} id - Invoice ID
 * @param {Object} invoiceData - Invoice data to update (only updateable fields)
 * @returns {Promise<Object>} Updated invoice
 */
export const updateInvoice = async (id, invoiceData) => {
  try {
    // Filter out any non-updateable fields
    const updateableData = { Id: id };
    UPDATEABLE_FIELDS.forEach(field => {
      if (invoiceData[field] !== undefined) {
        updateableData[field] = invoiceData[field];
      }
    });
    
    const apperClient = getClient();
    const response = await apperClient.updateRecord(TABLE_NAME, { records: [updateableData] });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update invoice');
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error(`Error updating invoice with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an invoice
 * 
 * @param {string} id - Invoice ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteInvoice = async (id) => {
  try {
    const apperClient = getClient();
    const response = await apperClient.deleteRecord(TABLE_NAME, { RecordIds: [id] });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete invoice');
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting invoice with ID ${id}:`, error);
    throw error;
  }
};