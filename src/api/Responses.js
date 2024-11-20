import axios from 'axios';

// Base URL for the worker API Service 1
const BASE_URL_SERVICE_1 = 'https://soa2.backend.drunkenhedgehog.ru/l2_p1-1.0-SNAPSHOT/resources';


export const fetchWorkers = async (sortBy, status, salary, page, size) => {
    const response = await axios.get(`${BASE_URL_SERVICE_1}/workers?sortBy=${sortBy}&status=${status}&salary=${salary}&page=${page}&size=${size}`);
    return response.data; // Return the data from the response
};


// Function to get worker data
export const getWorker = async (id) => {
    const response = await axios.get(`${BASE_URL_SERVICE_1}/workers/${id}`);
    return response.data
};


export const addWorker = async (worker) => {
    const response = await axios.post(`${BASE_URL_SERVICE_1}/workers/`, worker);
    return response.data
};


// Function to update worker data
export const updateWorker = async (id, updatedData) => {
    const response = await axios.put(`${BASE_URL_SERVICE_1}/workers/${id}`, updatedData);
    return response.data
};


// Function to delete worker data
export const deleteWorker = async (id) => {
    const response = await axios.delete(`${BASE_URL_SERVICE_1}/workers/${id}`);
    return response.data
};


// src/api/Responses.js
export const fetchEmployeeCountByDate = async (date) => {
    const response = await axios.get(`${BASE_URL_SERVICE_1}/workers/statistics?startDate=${date}`);
    return response.data; // Assuming this returns just a number
};


export const fetchSalaries = async (date) => {
    const response = await axios.get(`${BASE_URL_SERVICE_1}/workers/salaries`);
    return response.data; // Assuming this returns just a number
};

