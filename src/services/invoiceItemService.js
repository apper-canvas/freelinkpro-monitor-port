/**
 * Invoice Item Service
 * 
 * Provides methods for interacting with the invoice_item table in the database.
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
const TABLE_NAME = 'invoice_item';

// Fields to fetch when getting invoice items (all fields)
const INVOICE_ITEM_FIELDS = [
  'Id',
  'Name',
  'Tags',
  'Owner',
  'CreatedOn',
  'CreatedBy',
  'ModifiedOn',
  'ModifiedBy',
  'description',
  'quantity',
  'rate',
  'amount',
  'invoiceId'
];

// Fields that can be updated (only those with fieldVisibility: "Updateable")
const UPDATEABLE_FIELDS = [
  'Name',
  'Tags',
  'Owner',
  'description',
  'quantity',
  'rate',
  'amount',
  'invoiceId'
];

/**
 * Fetch invoice items for a specific invoice
 * 
 * @param {string} invoiceId - ID of the parent invoice
 * @returns {Promise<Array>} Invoice items
 */
export const fetchInvoiceItems = async (invoiceId) => {
  try {
    const apperClient = getClient();
    
    const params = {
      fields: INVOICE_ITEM_FIELDS,
      where: [
        {
          fieldName: 'invoiceId',
          operator: 'ExactMatch',
          values: [invoiceId]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    return response.data || [];
  } catch (error) {
    console.error(`Error fetching invoice items for invoice ${invoiceId}:`, error);
    throw error;
  }
};

/**
 * Create multiple invoice items in bulk
 * 
 * @param {Array} items - Array of invoice item objects
 * @returns {Promise<Array>} Created invoice items
 */
export const createInvoiceItems = async (items) => {
  try {
    if (!items || items.length === 0) {
      return [];
    }
    
    // Filter out any non-updateable fields for each item
    const updateableItems = items.map(item => {
      const updateableItem = {};
      UPDATEABLE_FIELDS.forEach(field => {
        if (item[field] !== undefined) {
          updateableItem[field] = item[field];
        }
      });
      return updateableItem;
    });
    
    const apperClient = getClient();
    const response = await apperClient.createRecord(TABLE_NAME, { records: updateableItems });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to create invoice items');
    }
    
    // Return array of successfully created items
    return response.results
      .filter(result => result.success)
      .map(result => result.data);
  } catch (error) {
    console.error('Error creating invoice items:', error);
    throw error;
  }
};

/**
 * Update multiple invoice items in bulk
 * 
 * @param {Array} items - Array of invoice item objects (must include Id)
 * @returns {Promise<Array>} Updated invoice items
 */
export const updateInvoiceItems = async (items) => {
  try {
    if (!items || items.length === 0) {
      return [];
    }
    
    // Filter out any non-updateable fields for each item, but keep Id
    const updateableItems = items.map(item => {
      if (!item.Id) {
        throw new Error('Item ID is required for update');
      }
      
      const updateableItem = { Id: item.Id };
      UPDATEABLE_FIELDS.forEach(field => {
        if (item[field] !== undefined) {
          updateableItem[field] = item[field];
        }
      });
      return updateableItem;
    });
    
    const apperClient = getClient();
    const response = await apperClient.updateRecord(TABLE_NAME, { records: updateableItems });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to update invoice items');
    }
    
    // Return array of successfully updated items
    return response.results
      .filter(result => result.success)
      .map(result => result.data);
  } catch (error) {
    console.error('Error updating invoice items:', error);
    throw error;
  }
};

/**
 * Delete invoice items by their IDs
 * 
 * @param {Array} itemIds - Array of invoice item IDs to delete
 * @returns {Promise<boolean>} Success status
 */
export const deleteInvoiceItems = async (itemIds) => {
  try {
    if (!itemIds || itemIds.length === 0) {
      return true;
    }
    
    const apperClient = getClient();
    const response = await apperClient.deleteRecord(TABLE_NAME, { RecordIds: itemIds });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete invoice items');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting invoice items:', error);
    throw error;
  }
};