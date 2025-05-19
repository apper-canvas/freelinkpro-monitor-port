/**
 * Client Service - Handles all client-related API operations
 */

// Fetch all clients
export const fetchClients = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'client1';
    
    // We can fetch all fields regardless of visibility
    const params = {
      fields: [
        'Name', 
        'company', 
        'email', 
        'phone', 
        'status', 
        'tags', 
        'address',
        'lastContact',
        'Tags',
        'Owner',
        'CreatedOn',
        'CreatedBy',
        'ModifiedOn',
        'ModifiedBy'
      ]
    };

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    // Map API response to the format expected by the UI
    return response.data.map(client => ({
      id: client.Id,
      name: client.Name || '',
      company: client.company || '',
      email: client.email || '',
      phone: client.phone || '',
      status: client.status || 'active',
      address: client.address || '',
      tags: client.tags || [],
      lastContact: client.lastContact || new Date().toISOString().split('T')[0]
    }));
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw error;
  }
};

// Create a new client
export const createClient = async (clientData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'client1';
    
    // Only include Updateable fields for creation
    const params = {
      records: [{
        Name: clientData.name,
        company: clientData.company,
        email: clientData.email,
        phone: clientData.phone,
        status: clientData.status,
        address: clientData.address || '',
        tags: clientData.tags,
        lastContact: clientData.lastContact || new Date().toISOString().split('T')[0]
      }]
    };

    const response = await apperClient.createRecord(tableName, params);
    
    if (response?.success && response?.results && response.results[0]?.success) {
      const newClient = response.results[0].data;
      return {
        id: newClient.Id,
        name: newClient.Name,
        company: newClient.company,
        email: newClient.email,
        phone: newClient.phone,
        status: newClient.status,
        address: newClient.address || '',
        tags: newClient.tags,
        lastContact: newClient.lastContact
      };
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to create client');
    }
  } catch (error) {
    console.error("Error creating client:", error);
    throw error;
  }
};

// Get a client by ID
export const getClientById = async (clientId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'client1';
    
    const params = {
      fields: [
        'Name', 
        'company', 
        'email', 
        'phone', 
        'status', 
        'tags', 
        'address',
        'lastContact',
        'Tags',
        'Owner',
        'CreatedOn',
        'CreatedBy',
        'ModifiedOn',
        'ModifiedBy'
      ],
      where: [
        {
          fieldName: "Id",
          operator: "ExactMatch",
          values: [clientId]
        }
      ]
    };

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response || !response.data || response.data.length === 0) {
      return null;
    }
    
    const client = response.data[0];
    return {
      id: client.Id,
      name: client.Name || '',
      company: client.company || '',
      email: client.email || '',
      phone: client.phone || '',
      status: client.status || 'active',
      address: client.address || '',
      tags: client.tags || [],
      lastContact: client.lastContact || new Date().toISOString().split('T')[0]
    };
  } catch (error) {
    console.error("Error fetching client:", error);
    throw error;
  }
};

// Update an existing client
export const updateClient = async (clientId, clientData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'client1';
    
    // Only include Updateable fields for update
    const params = {
      records: [{
        Id: clientId,
        Name: clientData.name,
        company: clientData.company,
        email: clientData.email,
        phone: clientData.phone,
        status: clientData.status,
        address: clientData.address || '',
        tags: clientData.tags,
        lastContact: clientData.lastContact || new Date().toISOString().split('T')[0]
      }]
    };

    const response = await apperClient.updateRecord(tableName, params);
    
    if (response?.success && response?.results && response.results[0]?.success) {
      const updatedClient = response.results[0].data;
      return {
        id: updatedClient.Id,
        name: updatedClient.Name,
        company: updatedClient.company,
        email: updatedClient.email,
        phone: updatedClient.phone,
        status: updatedClient.status,
        address: updatedClient.address || '',
        tags: updatedClient.tags,
        lastContact: updatedClient.lastContact
      };
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to update client');
    }
  } catch (error) {
    console.error("Error updating client:", error);
    throw error;
  }
};

// Delete a client
export const deleteClient = async (clientId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'client1';
    const params = { RecordIds: [clientId] };

    const response = await apperClient.deleteRecord(tableName, params);
    return response?.success === true;
  } catch (error) {
    console.error("Error deleting client:", error);
    throw error;
  }
};