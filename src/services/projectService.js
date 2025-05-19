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
        'priority',
        'category',
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
      priority: project.priority || 'medium',
      category: project.category || '',
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
        'priority',
        'category',
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
      priority: project.priority || 'medium',
      category: project.category || '',
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
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'project1';
    
    // Filter out any fields that are not updateable
    const params = {
      records: [{
        // Only include fields with visibility: "Updateable"
        Name: projectData.name,
        description: projectData.description,
        clientId: projectData.clientId,
        startDate: projectData.startDate,
        dueDate: projectData.dueDate,
        endDate: projectData.endDate || null,
        status: projectData.status,
        priority: projectData.priority,
        category: projectData.category,
        budget: projectData.budget,
        progress: projectData.progress || 0,
        hourlyRate: projectData.hourlyRate || 0,
        tags: projectData.tags || []
      }]
    };

    const response = await apperClient.createRecord(tableName, params);
    
    if (!response || !response.success || !response.results || !response.results[0].success) {
      throw new Error(response?.results?.[0]?.message || 'Failed to create project');
    }

    // Return the created project
    const createdProject = response.results[0].data;
    return {
      id: createdProject.Id,
      name: createdProject.Name,
      description: createdProject.description,
      clientId: createdProject.clientId,
      startDate: createdProject.startDate,
      dueDate: createdProject.dueDate,
      endDate: createdProject.endDate,
      status: createdProject.status,
      priority: createdProject.priority,
      category: createdProject.category,
      budget: createdProject.budget,
      progress: createdProject.progress,
      hourlyRate: createdProject.hourlyRate,
      tags: createdProject.tags || []
    };
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
};

// Update an existing project
export const updateProject = async (projectId, projectData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'project1';
    
    // Filter out any fields that are not updateable
    const params = {
      records: [{
        // Include ID for update
        Id: projectId,
        // Only include fields with visibility: "Updateable"
        Name: projectData.name,
        description: projectData.description,
        clientId: projectData.clientId,
        startDate: projectData.startDate,
        dueDate: projectData.dueDate,
        endDate: projectData.endDate || null,
        status: projectData.status,
        priority: projectData.priority,
        category: projectData.category,
        budget: projectData.budget,
        progress: projectData.progress !== undefined ? projectData.progress : 0,
        hourlyRate: projectData.hourlyRate || 0,
        tags: projectData.tags || []
      }]
    };

    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response || !response.success || !response.results || !response.results[0].success) {
      throw new Error(response?.results?.[0]?.message || 'Failed to update project');
    }

    return true;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

// Delete a project
export const deleteProject = async (projectId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'project1';
    await apperClient.deleteRecord(tableName, { RecordIds: [projectId] });
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};