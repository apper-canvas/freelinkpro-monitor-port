/**
 * Project Service - Handles all project-related API operations
 */

// Fetch all projects with optional filtering
export const fetchProjects = async (options = {}) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'project1';
    
    // We can fetch all fields regardless of visibility
    const params = {
      fields: [
        'Name', 
        'description', 
        'status',
        'startDate',
        'dueDate',
        'endDate',
        'budget',
        'progress',
        'hourlyRate',
        'clientId',
        'tags',
        'Tags',
        'Owner',
        'CreatedOn',
        'CreatedBy',
        'ModifiedOn',
        'ModifiedBy'
      ],
      ...options
    };

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    // Map API response to the format expected by the UI
    return response.data.map(project => ({
      id: project.Id,
      name: project.Name || '',
      description: project.description || '',
      status: project.status || 'planning',
      startDate: project.startDate || new Date().toISOString().split('T')[0],
      dueDate: project.dueDate || '',
      endDate: project.endDate || '',
      budget: project.budget || 0,
      progress: project.progress || 0,
      hourlyRate: project.hourlyRate || 0,
      clientId: project.clientId || '',
      tags: project.tags || []
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Get a project by ID
export const getProjectById = async (projectId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'project1';
    
    const params = {
      fields: [
        'Name', 
        'description', 
        'status',
        'startDate',
        'dueDate',
        'endDate',
        'budget',
        'progress',
        'hourlyRate',
        'clientId',
        'tags',
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
          values: [projectId]
        }
      ]
    };

    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response || !response.data || response.data.length === 0) {
      return null;
    }
    
    const project = response.data[0];
    return {
      id: project.Id,
      name: project.Name || '',
      description: project.description || '',
      status: project.status || 'planning',
      startDate: project.startDate || new Date().toISOString().split('T')[0],
      dueDate: project.dueDate || '',
      endDate: project.endDate || '',
      budget: project.budget || 0,
      progress: project.progress || 0,
      hourlyRate: project.hourlyRate || 0,
      clientId: project.clientId || '',
      tags: project.tags || []
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

// Create a new project
export const createProject = async (projectData) => {
  // Implementation here
};

// Update an existing project
export const updateProject = async (projectId, projectData) => {
  // Implementation here
};

// Delete a project
export const deleteProject = async (projectId) => {
  // Implementation here
};