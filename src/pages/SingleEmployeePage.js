// src/pages/SingleEmployeePage.js
import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Box, Button, Card, CardContent, CircularProgress, TextField, Typography} from '@mui/material';
import {deleteWorker, getWorker, updateWorker} from '../api/Responses'; // Import your API functions
import {toast, ToastContainer} from 'react-toastify';

function SingleEmployeePage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null); // Use state to store employee data
    const [loading, setLoading] = useState(true); // Loading state

    // Fetch the employee data when the component mounts
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const data = await getWorker(id);
                setEmployee(data);
                toast.success('Данные сотрудника успешно загружены');
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Ошибка получения данных сотрудника';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    // Handle delete operation
    const handleDelete = async () => {
        try {
            await deleteWorker(id);
            toast.success('Сотрудник успешно удален');
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка при удалении сотрудника';
            toast.error(errorMessage);
        }
    };

    // Handle update operation
    const handleUpdate = async () => {
        try {
            // Collect updated data from the fields
            const updatedData = {...employee};
            await updateWorker(id, updatedData);
            toast.success('Данные сотрудника успешно обновлены');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка при обновлении данных сотрудника';
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
            <CircularProgress/>
        </Box>; // Simple loading state
    }

    if (!employee) {
        return <Typography>Сотрудник не найден</Typography>; // Handle case where employee data is not available
    }

    return (
        <div style={{padding: '16px'}}>
            <ToastContainer/>
            <Card>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{employee.name}</Typography>
                    <TextField
                        label="Name"
                        defaultValue={employee.name}
                        onChange={(e) => setEmployee({...employee, name: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Salary"
                        type="number"
                        defaultValue={employee.salary}
                        onChange={(e) => setEmployee({...employee, salary: parseFloat(e.target.value)})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="X Coordinate"
                        type="number"
                        defaultValue={employee.coordinates?.x}
                        onChange={(e) => setEmployee({
                            ...employee,
                            coordinates: {...employee.coordinates, x: parseFloat(e.target.value)}
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Y Coordinate"
                        type="number"
                        defaultValue={employee.coordinates?.y}
                        onChange={(e) => setEmployee({
                            ...employee,
                            coordinates: {...employee.coordinates, y: parseFloat(e.target.value)}
                        })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Creation Date"
                        defaultValue={employee.creationDate}
                        onChange={(e) => setEmployee({...employee, creationDate: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Start Date"
                        defaultValue={employee.startDate}
                        onChange={(e) => setEmployee({...employee, startDate: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="End Date"
                        defaultValue={employee.endDate}
                        onChange={(e) => setEmployee({...employee, endDate: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Status"
                        defaultValue={employee.status}
                        onChange={(e) => setEmployee({...employee, status: e.target.value})}
                        fullWidth
                        margin="normal"
                    />
                    {/* Organization field */}
                    {/* Display Organization Details */}
                    {employee.organization ? (
                        <>
                            <Typography variant="h6" gutterBottom>Organization Details</Typography>
                            <TextField
                                label="Annual Turnover"
                                defaultValue={employee.organization.annualTurnover}
                                fullWidth
                                margin="normal"
                                InputProps={{readOnly: true}} // Read-only
                            />
                            <TextField
                                label="Employees Count"
                                defaultValue={employee.organization.employeesCount}
                                fullWidth
                                margin="normal"
                                InputProps={{readOnly: true}} // Read-only
                            />
                            <TextField
                                label="Organization Type"
                                defaultValue={employee.organization.type}
                                fullWidth
                                margin="normal"
                                InputProps={{readOnly: true}} // Read-only
                            />
                            <TextField
                                label="Official Address (Zip Code)"
                                defaultValue={employee.organization.officialAddress?.zipCode}
                                fullWidth
                                margin="normal"
                                InputProps={{readOnly: true}} // Read-only
                            />
                        </>
                    ) : (
                        <Typography variant="body1" color="textSecondary">No Organization Details</Typography>
                    )}

                    <div style={{marginTop: '16px', display: 'flex', gap: '16px'}}>
                        <Button variant="contained" color="primary" onClick={handleUpdate}>
                            Update
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default SingleEmployeePage;
