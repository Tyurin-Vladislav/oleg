// src/pages/AllEmployeesPage.js
import React, {useEffect, useState} from 'react';
import {Box} from "@mui/material";
import EmployeeCard from "../components/EmployeeCard";
import {fetchWorkers} from "../api/Responses";
import {toast, ToastContainer} from "react-toastify";


function AllEmployeesPage() {

    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        const loadWorkers = async () => {
            try {
                const data = await fetchWorkers('', '', '', 1, 10);
                setWorkers(data);
                toast.success('Работники успешно получены'); // Success toast
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Ошибка получения работников'; // Adjust this according to your API error structure
                toast.error(errorMessage); // Show error toast
            }
        };

        loadWorkers();
    }, []);


    return (
        <Box sx={{padding: 10}}>
            <ToastContainer/>
            <h1 className="text-2xl font-bold mb-4">Все сотрудники</h1>
            <Box sx={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 2
            }}>
                {workers.map(employee => (
                    <EmployeeCard key={employee.id} employee={employee}/>
                ))}
            </Box>
        </Box>
    )
        ;
}

export default AllEmployeesPage;
