/**
 * Project Service - Handles all project-related API operations
 */

// Fetch all projects
export const fetchProjects = async () => {
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
        'clientId', 
        'startDate', 
        'dueDate', 
        'endDate', 
        'status',
        'budget',
        'progress',
        'tags',
        'hourlyRate',
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
    return response.data.map(project => ({
      id: project.Id,
      name: project.Name || '',
      description: project.description || '',
      clientId: project.clientId || '',
      startDate: project.startDate || new Date().toISOString().split('T')[0],
      dueDate: project.dueDate || '',
      endDate: project.endDate || '',
      status: project.status || 'planning',
      budget: project.budget || 0,
      progress: project.progress || 0,
      tags: project.tags || [],
      hourlyRate: project.hourlyRate || 0,
      // Provide default empty arrays for related collections
      tasks: [],
      timeEntries: [],
      expenses: []
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// Fetch a single project by ID
export const getProjectById = async (projectId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const tableName = 'project1';
    
    // We can use getRecordById to fetch a specific record
    const response = await apperClient.getRecordById(tableName, projectId);
    
    if (!response || !response.data) {
      throw new Error('Project not found');
    }
    
    const project = response.data;
    
    // Map API response to the format expected by the UI
    return {
      id: project.Id,
      name: project.Name || '',
      description: project.description || '',
      clientId: project.clientId || '',
      startDate: project.startDate || new Date().toISOString().split('T')[0],
      dueDate: project.dueDate || '',
      endDate: project.endDate || '',
      status: project.status || 'planning',
      budget: project.budget || 0,
      progress: project.progress || 0,
      tags: project.tags || [],
      hourlyRate: project.hourlyRate || 0,
      // Provide default empty arrays for related collections
      tasks: [],
      timeEntries: [],
      expenses: []
    };
  } catch (error) {
    console.error(`Error fetching project with ID ${projectId}:`, error);
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
    
    // Only include Updateable fields for creation
    const params = {
      records: [{
        Name: projectData.name,
        description: projectData.description,
        clientId: projectData.clientId,
        startDate: projectData.startDate,
        dueDate: projectData.dueDate,
        endDate: projectData.endDate || '',
        status: projectData.status,
        budget: projectData.budget,
        progress: projectData.progress || 0,
        tags: projectData.tags || [],
        hourlyRate: projectData.hourlyRate || 0
      }]
    };

    const response = await apperClient.createRecord(tableName, params);
    
    if (response?.success && response?.results && response.results[0]?.success) {
      const newProject = response.results[0].data;
      return {
        id: newProject.Id,
        name: newProject.Name,
        description: newProject.description,
        clientId: newProject.clientId,
        startDate: newProject.startDate,
        dueDate: newProject.dueDate,
        endDate: newProject.endDate,
        status: newProject.status,
        budget: newProject.budget,
        progress: newProject.progress,
        tags: newProject.tags,
        hourlyRate: newProject.hourlyRate
      };
    } else {
      throw new Error(response?.results?.[0]?.message || 'Failed to create project');
    }
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
    
    // Only include Updateable fields for updating (plus Id)
    const params = {
      records: [{
        Id: projectId,
        Name: projectData.name,
        description: projectData.description,
        clientId: projectData.clientId,
        startDate: projectData.startDate,
        dueDate: projectData.dueDate,
        endDate: projectData.endDate || '',
        status: projectData.status,
        budget: projectData.budget,
        progress: projectData.progress || 0,
        tags: projectData.tags || [],
        hourlyRate: projectData.hourlyRate || 0
      }]
    };

    const response = await apperClient.updateRecord(tableName, params);
    return response?.success === true;
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
    const params = { RecordIds: [projectId] };

    const response = await apperClient.deleteRecord(tableName, params);
    return response?.success === true;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};