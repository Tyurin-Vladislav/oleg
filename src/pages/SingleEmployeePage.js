import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, CircularProgress, TextField, Typography, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { deleteWorker, updateWorker, getWorker } from '../api/Responses'; // Import your API functions
import { toast, ToastContainer } from 'react-toastify';

import { makeTransfer, makeIndexQuery } from "../api/SecondService";
function SingleEmployeePage() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(''); // Use state to store employee data
    const [loading, setLoading] = useState(true); // Loading state
    const [fromOrgId, setFromOrgId] = useState(''); // State for organization ID to move from
    const [toOrgId, setToOrgId] = useState(''); // State for organization ID to move to
    const [coeff, setCoeff] = useState(''); // State for the coefficient input



    // useEffect(() => {
    //     const fetchEmployee = async () => {
    //         setLoading(true);
    //         try {
    //             // Ищем сотрудника в mock данных по id
    //             const data = exampleWorkers.find(worker => worker.id === id);

    //             if (!data) {
    //                 throw new Error('Сотрудник не найден');
    //             }
    //             setEmployee(data);
    //             toast.success('Данные сотрудника успешно загружены');
    //         } catch (error) {
    //             const errorMessage = error.message || 'Ошибка получения данных сотрудника';
    //             toast.error(errorMessage);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchEmployee();
    // }, [id]);

    // // Fetch the employee data when the component mounts
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
            const updatedData = { ...employee };
            await updateWorker(id, updatedData);
            toast.success('Данные сотрудника успешно обновлены');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Ошибка при обновлении данных сотрудника';
            toast.error(errorMessage);
        }
    };

    // Handle index query operation
    const handleIndexQuery = async (id, coeff) => {
        try {
            await makeIndexQuery(id, coeff);
            toast.success(`Индексация произведена успешно`);
        } catch (error) {
            if (error.message === 'Network Error') {
                toast.error('Сервис временно недоступен. Проверьте подключение к сети.');
            } else {
                const errorMessage = error.response?.data?.message || 'Ошибка при получении индекса сотрудника';
                toast.error(errorMessage);
            }
        }
    };
    

    // Handle index query operation
    const handleTransfer = async (id, fromOrgId, toOrgId) => {
        try {
            const response = makeTransfer(id, fromOrgId, toOrgId);
            if (response){
                toast.success(`Сотрудник переведен из компании
                    с ID ${fromOrgId} в компанию с ID ${toOrgId}`);
            }
                       
        } catch (error) {
        
            const errorMessage = error.response?.data?.message || 'Ошибка при получении индекса сотрудника';
            toast.error(errorMessage);
        }
    };



    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        ); // Simple loading state
    }

    if (!employee) {
        return <Typography>Сотрудник не найден</Typography>; // Handle case where employee data is not available
    }

    return (
        <div style={{ padding: '16px' }}>
            <ToastContainer />
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">

                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Назад
                        </Button>

                        <Typography variant="h4" gutterBottom style={{ flexGrow: 1, textAlign: 'center' }}>
                            {employee.name}
                        </Typography>

                        {/* Пустой элемент справа для выравнивания */}
                        <Box width="48px" />
                    </Box>
                    <Box style={{ display: 'flex', gap: '20px' }}>
                        <TextField
                            label="ФИО"
                            defaultValue={employee.name}
                            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Зарплата"
                            type="number"
                            defaultValue={employee.salary}
                            onChange={(e) => setEmployee({ ...employee, salary: parseFloat(e.target.value) })}
                            fullWidth
                            margin="normal"
                        /></Box>
                    <Box style={{ display: 'flex', gap: '20px', justifyContent: 'stretch' }}>
                        <TextField
                            label="Координата X"
                            type="number"
                            defaultValue={employee.coordinates?.x}
                            onChange={(e) => setEmployee({
                                ...employee,
                                coordinates: { ...employee.coordinates, x: parseFloat(e.target.value) }
                            })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Координата Y"
                            type="number"
                            defaultValue={employee.coordinates?.y}
                            onChange={(e) => setEmployee({
                                ...employee,
                                coordinates: { ...employee.coordinates, y: parseFloat(e.target.value) }
                            })}
                            fullWidth
                            margin="normal"
                        />
                    </Box>
                    {/* <TextField
                        label="Дата создания"
                        defaultValue={employee.creationDate}
                        onChange={(e) => setEmployee({ ...employee, creationDate: e.target.value })}
                        fullWidth
                        margin="normal"
                    /> */}
                    <Box style={{ display: 'flex', gap: '20px', justifyContent: 'stretch' }}>

                        <TextField
                            label="Дата начала работы"

                            defaultValue={employee.startDate}
                            onChange={(e) => setEmployee({ ...employee, startDate: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Дата окончания работ"

                            defaultValue={employee.endDate}
                            onChange={(e) => setEmployee({ ...employee, endDate: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                    </Box>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="status-label">Статус</InputLabel>
                        <Select
                            labelId="status-label"
                            value={employee.status}
                            onChange={(e) => setEmployee({ ...employee, status: e.target.value })}
                        >

                            {/* <MenuItem value="">Любой</MenuItem> */}
                            <MenuItem value="HIRED">Нанят</MenuItem>
                            <MenuItem value="RECOMMENDED_FOR_PROMOTION">Рекомендован</MenuItem>
                            <MenuItem value="REGULAR">Обычый</MenuItem>
                            <MenuItem value="FIRED">Уволен</MenuItem>
                        </Select>
                    </FormControl>
                    <Divider sx={{ margin: 3 }} />
                    {/* Organization field */}
                    {/* Display Organization Details */}
                    {employee.organization ? (
                        <Box>
                            <Typography variant="h6" gutterBottom>Данные об организации работника</Typography>
                            <TextField
                                label="ID"
                                type="number"
                                value={employee.organization.id}
                                onChange={(e) => setEmployee({ ...employee, organization: { ...employee.organization, id: e.target.value } })}
                                fullWidth
                                margin="normal"
                            />
                            <Box style={{ display: 'flex', gap: '20px' }}>
                                <TextField
                                    label="Годовой оборот"
                                    defaultValue={employee.organization.annualTurnover}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{ readOnly: true }} // Read-only
                                />
                                <TextField
                                    label="Количество работников"
                                    defaultValue={employee.organization.employeesCount}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{ readOnly: true }} // Read-only
                                /></Box><Box style={{ display: 'flex', gap: '20px' }}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel id="organization-type-label">Тип организации</InputLabel>
                                    <Select
                                        labelId="organization-type-label"
                                        value={employee.organization.type}
                                        onChange={(e) =>
                                            setEmployee({
                                                ...employee,
                                                organization: { ...employee.organization, type: e.target.value },
                                            })
                                        }
                                    >
                                        <MenuItem value="COMMERCIAL">Коммерческая</MenuItem>
                                        <MenuItem value="PUBLIC">Публичная</MenuItem>
                                        <MenuItem value="GOVERNMENT">Государственная</MenuItem>
                                        <MenuItem value="PRIVATE_LIMITED_COMPANY">Приватная</MenuItem>
                                        <MenuItem value="OPEN_JOINT_STOCK_COMPANY">ОАО</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Официальный адрес (почтовый индекс)"
                                    defaultValue={employee.organization.officialAddress?.zipCode}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{ readOnly: true }} // Read-only
                                /></Box>
                        </Box>
                    ) : (
                        <Typography variant="body1" color="textSecondary">Нет данных об организации</Typography>
                    )}
                    {/* Transfer Section */}
                    <Divider sx={{ margin: 3 }} />
                    <Box sx={{ margin: 3 }}>
                        <Typography variant="h6" gutterBottom>Перевести сотрудника в другую компанию</Typography>
                        <Box style={{ display: 'flex', gap: '20px' }}>
                            <TextField
                                label="Из организации (ID)"
                                value={fromOrgId}
                                onChange={(e) => setFromOrgId(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                label="В организацию (ID)"
                                type='numeric'
                                value={toOrgId}
                                onChange={(e) => setToOrgId(e.target.value)}
                                fullWidth
                                margin="normal"
                            /></Box>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleTransfer(id, fromOrgId, toOrgId)}
                            sx={{ marginTop: 2 }}
                        >
                            Перевести
                        </Button>

                    </Box>
                    {/* Index Query Section */}
                    <Divider sx={{ margin: 3 }} />
                    <Box sx={{ margin: 3 }}>
                        <Typography variant="h6" gutterBottom>Индексация зарплаты работника</Typography>
                        <TextField
                            label="Коэффициент"
                            value={coeff}
                            onChange={(e) => setCoeff(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    
                        <Button variant="contained" color="primary" onClick={() => handleIndexQuery(id, coeff)} sx={{ marginTop: 2 }}>
                            Индексировать
                        </Button>
                    </Box>
                    <Divider sx={{ margin: 3 }} />

                    <Box sx={{ margin: 3 }}>
                        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center' }}>

                            <Button variant="outlined" color="default" onClick={() => navigate(-1)}>
                                Назад
                            </Button>

                            <Button
                                variant="contained"
                                onClick={handleUpdate}
                                sx={{ backgroundColor: 'orange', '&:hover': { backgroundColor: 'darkorange' } }}
                            >
                                Обновить данные
                            </Button>

                            <Button variant="contained" color="error" onClick={handleDelete}>
                                Удалить
                            </Button>

                        </div>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
}

export default SingleEmployeePage;
