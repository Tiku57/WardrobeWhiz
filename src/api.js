// frontend/src/api.js
import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';
export const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || 'http://localhost:5001/';


export const addItem = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/items`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getItems = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/items`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getItemById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/items/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Removed: export const updateItem function
// export const updateItem = async (id, formData) => { ... };

export const deleteItem = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/items/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};