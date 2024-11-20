import axios from 'axios';

// Base URL for the worker API Service 2
const BASE_URL_SERVICE_2 = 'http://soa1.backend.drunkenhedgehog.ru:9999/l2__p2/resources';


// Handle transfer operation
export const makeTransfer = async (id, fromOrgId, toOrgId) => {
    const response = await axios.post(`${BASE_URL_SERVICE_2}/hr/move/${id}/${fromOrgId}/${toOrgId}`);
    return response.data;
};


// Handle index query operation
export const makeIndexQuery = async (id, coeff) => {
    try {
        const response = await axios.post(`${BASE_URL_SERVICE_2}/hr/index/${id}/${coeff}`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        throw error;
    }
};
