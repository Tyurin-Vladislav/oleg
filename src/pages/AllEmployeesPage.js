// src/pages/AllEmployeesPage.js
import React, {useCallback, useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    TextField,
    Typography
} from "@mui/material";
import EmployeeCard from "../components/EmployeeCard";
import {fetchEmployeeCountByDate, fetchSalaries, fetchWorkers} from "../api/Responses";
import {toast, ToastContainer} from "react-toastify";

function AllEmployeesPage() {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('name');
    const [filterStatus, setFilterStatus] = useState('HIRED');
    const [filterSalary, setFilterSalary] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [dateInput, setDateInput] = useState('');
    const [employeeCount, setEmployeeCount] = useState(0);
    const [salaries, setSalaries] = useState([]);

    // Memoize the loadWorkers function with useCallback
    const loadWorkers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchWorkers(sortBy, filterStatus, filterSalary, page, pageSize);
            setWorkers(data);
            toast.success('Работники успешно получены');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка получения работников';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [sortBy, filterStatus, filterSalary, page, pageSize]); // Add filters and pagination to dependencies

    // Call loadWorkers in useEffect
    useEffect(() => {
        loadWorkers();
        loadSalaries();
    }, [loadWorkers]);


    const handleDateCount = async () => {
        try {
            // Parse the input date (assumed to be in YYYY-MM-DD format)
            const [year, month, day] = dateInput.split('-');
            // Format it to DD.MM.YY
            const formattedDate = `${day}.${month}.${year}`; // Get last 2 digits of the year
            const count = await fetchEmployeeCountByDate(formattedDate);
            setEmployeeCount(count);
            toast.success(`Количество сотрудников на ${formattedDate}: ${count}`);
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка получения количества сотрудников';
            toast.error(errorMessage);
        }
    };

    // Function to fetch salaries
    const loadSalaries = useCallback(async () => {
        try {
            const salaryData = await fetchSalaries(); // Assume this fetches the salaries
            setSalaries(salaryData);
            toast.success('Зарплаты успешно получены');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка получения зарплат';
            toast.error(errorMessage);
        }
    }, []);

    return (
        <Box sx={{padding: 10}}>
            <ToastContainer/>
            <Typography variant="h4" component="h1" gutterBottom>Все сотрудники</Typography>

            {/* Sorting options */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Sort By</InputLabel>
                <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="salary">Salary</MenuItem>
                    <MenuItem value="creationDate">Creation Date</MenuItem>
                </Select>
            </FormControl>

            {/* Status filter */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <MenuItem value="null">All</MenuItem>
                    <MenuItem defaultChecked value="HIRED">HIRED</MenuItem>
                    <MenuItem value="FIRED">FIRED</MenuItem>
                    {/* Add other statuses as needed */}
                </Select>
            </FormControl>

            {/* Salary filter */}
            <TextField
                label="Salary"
                type="number"
                value={filterSalary}
                onChange={(e) => setFilterSalary(e.target.value)}
                fullWidth
                margin="normal"
            />

            {/* Button to reload with new sort and filters */}
            <Button variant="contained" onClick={loadWorkers} sx={{marginBottom: 2}}>
                Найти
            </Button>

            {/* Date count section */}
            <Typography variant="h6" sx={{marginTop: 4}}>Проверить количество сотрудников по дате</Typography>
            <TextField
                label="Date (YYYY-MM-DD)"
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                InputLabelProps={{shrink: true}}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" onClick={handleDateCount} sx={{marginTop: 2}}>
                Получить количество
            </Button>

            <Box sx={{marginTop: 4}}>
                <Typography variant="h6">Список зарплат:</Typography>
                {salaries.length > 0 ? (
                    <ul>
                        {salaries.map((salary, index) => (
                            <li key={index}>{salary}</li>
                        ))}
                    </ul>
                ) : (
                    <Typography>Зарплаты не найдены</Typography>
                )}
            </Box>


            {loading ? (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <CircularProgress/>
                </Box>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: 2
                }}>
                    {workers.map(employee => (
                        <EmployeeCard key={employee.id} employee={employee}/>
                    ))}
                </Box>
            )}

            {/* Pagination */}
            <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 4}}>
                <Pagination
                    count={Math.ceil(workers.length / pageSize)} // Update this with total pages based on your API response
                    page={page}
                    onChange={(event, value) => {
                        setPage(value);
                        loadWorkers(); // Reload workers on page change
                    }}
                    variant="outlined"
                    shape="rounded"
                />
            </Box>
        </Box>
    );
}

export default AllEmployeesPage;
