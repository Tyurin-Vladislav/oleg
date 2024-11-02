// Fetch workers function
import axios from 'axios';

// Base URL for the worker API
const BASE_URL = 'https://soa1.backend.drunkenhedgehog.ru/l2_p1-1.0-SNAPSHOT/resources';

export const fetchWorkers = async (sortBy, status, salary, page, size) => {
    // Construct the query parameters
    const query = new URLSearchParams({
        sortBy,
        status,
        salary,
        page,
        size,
    }).toString();

    // Append the query parameters to the URL
    const response = await axios.get(`${BASE_URL}/workers?sortBy=name&status=${status}&salary=${salary}&page=${page}&size=${size}`);

    return response.data; // Return the data from the response
};

// Function to get worker data
export const getWorker = async (id) => {
    const response = await axios.get(`${BASE_URL}/workers/${id}`);
    return response.data
};

// Function to update worker data
export const updateWorker = async (id, updatedData) => {
    const response = await axios.put(`${BASE_URL}/workers/${id}`, updatedData);
    return response.data
};

// Function to delete worker data
export const deleteWorker = async (id) => {
    const response = await axios.delete(`${BASE_URL}/workers/${id}`);
    return response.data
};
