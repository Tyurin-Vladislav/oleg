import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { addWorker } from '../api/Responses';

function AddEmployeePage() {
    const getCurrentDateTime = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Формат даты и времени
        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    };

    const navigate = useNavigate();
    const [employee, setEmployee] = useState({
        name: '',
        salary: '',
        coordinates: { x: '', y: '' },
        creationDate: getCurrentDateTime(),
        startDate: '',
        endDate: '',
        status: 'REGULAR',
        organization: {
            id: '',
            annualTurnover: '',
            employeesCount: '',
            type: 'PUBLIC',
            officialAddress: { zipCode: '' },
        },
    });

    const validateEmployee = () => {
        const nameRegex = /^[A-Za-zА-Яа-яЁё\s-]+$/; // Для проверки ФИО
        const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/; // Для проверки формата DD.MM.YYYY

        if (!employee.name || employee.name.trim() === '') {
            toast.error('Поле "ФИО" не может быть пустым');
            return false;
        }
        if (!nameRegex.test(employee.name)) {
            toast.error('Поле "ФИО" должно содержать только буквы латинского или кириллического алфавита');
            return false;
        }
        if (!employee.coordinates || employee.coordinates.x === '' || employee.coordinates.y === '') {
            toast.error('Поле "Координаты" не может быть пустым');
            return false;
        }
        if (!employee.salary || employee.salary <= 0) {
            toast.error('Поле "Зарплата" должно быть больше 0');
            return false;
        }
        if (!employee.startDate || employee.startDate.trim() === '') {
            toast.error('Поле "Дата начала работы" не может быть пустым');
            return false;
        }
        if (!dateRegex.test(employee.startDate)) {
            toast.error('Поле "Дата начала работы" должно быть в формате DD.MM.YYYY');
            return false;
        }
        if (employee.endDate && !dateRegex.test(employee.endDate)) {
            toast.error('Поле "Дата окончания работы" должно быть в формате DD.MM.YYYY');
            return false;
        }
        if (!employee.organization.id || employee.organization.id.trim() === '') {
            toast.error('Поле "Организация ID" не может быть пустым');
            return false;
        }
       // Проверки полей организации
    const organization = employee.organization;

    if (!organization.id || organization.id.trim() === '') {
        toast.error('Поле "ID организации" не может быть пустым');
        return false;
    }
    if (!organization.annualTurnover || organization.annualTurnover <= 0) {
        toast.error('Поле "Годовой оборот организации" должно быть больше 0');
        return false;
    }
    if (!organization.employeesCount || organization.employeesCount <= 0) {
        toast.error('Поле "Количество сотрудников организации" должно быть больше 0');
        return false;
    }
        return true;
    };


    const handleSave = async () => {
        if (!validateEmployee()) {
            return;
        }
        try {
            const worker = {
                "name": employee.name,
                "coordinates": {
                    "x": employee.coordinates.x,
                    "y": employee.coordinates.y
                },
                "salary": employee.salary,
                "startDate": employee.startDate,
                "endDate": employee.endDate,
                "creationDate": getCurrentDateTime(),
                "status": employee.status,
                "organization": {
                    "id": employee.organization.id,
                    "annualTurnover": employee.organization.annualTurnover,
                    "employeesCount": employee.organization.employeesCount,
                    "type": employee.organization.type,
                    "officialAddress": {
                        "zipCode": employee.organization.officialAddress
                    }
                }
            }
            // const loadSalaries = useCallback(async () => {

            
            const addWorkerData = await addWorker(employee);
            toast.success('Сотрудник успешно добавлен');
            navigate('/');
        } catch (error) {
            toast.error(error.toString());
            toast.error('Ошибка при добавлении сотрудника');
        }
    };

    return (
        <Box padding={5}>
            <ToastContainer />
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">

                        <Button variant="outlined" onClick={() => navigate(-1)}>
                            Назад
                        </Button>

                        <Typography variant="h4" gutterBottom>Добавить сотрудника</Typography>

                        {/* Пустой элемент справа для выравнивания */}
                        <Box width="48px" />
                    </Box>

                    <Box style={{ display: 'flex', gap: '20px' }}>
                        <TextField
                            label="ФИО"
                            value={employee.name}
                            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Зарплата"
                            type="number"
                            value={employee.salary}
                            onChange={(e) => setEmployee({ ...employee, salary: parseFloat(e.target.value) })}
                            fullWidth
                            margin="normal"
                        /></Box>
                    <Box style={{ display: 'flex', gap: '20px' }}>
                        <TextField
                            label="Координата X"
                            type="number"
                            value={employee.coordinates.x}
                            onChange={(e) =>
                                setEmployee({ ...employee, coordinates: { ...employee.coordinates, x: parseFloat(e.target.value) } })
                            }
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Координата Y"
                            type="number"
                            value={employee.coordinates.y}
                            onChange={(e) =>
                                setEmployee({ ...employee, coordinates: { ...employee.coordinates, y: parseFloat(e.target.value) } })
                            }
                            fullWidth
                            margin="normal"
                        />
                    </Box>
                    <Box style={{ display: 'flex', gap: '20px' }}>
                        <TextField
                            label="Дата начала работы"
                            value={employee.startDate}
                            onChange={(e) => setEmployee({ ...employee, startDate: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Дата окончания работы"
                            value={employee.endDate}
                            onChange={(e) => setEmployee({ ...employee, endDate: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                    </Box>
                    {/* Выпадающий список для статуса */}
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
                    <Typography variant="h6" gutterBottom>Данные организации</Typography>
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
                            type='number'
                            value={employee.organization.annualTurnover}
                            onChange={(e) =>
                                setEmployee({ ...employee, organization: { ...employee.organization, annualTurnover: e.target.value } })
                            }
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Количество сотрудников"
                            type='number'
                            value={employee.organization.employeesCount}
                            onChange={(e) =>
                                setEmployee({ ...employee, organization: { ...employee.organization, employeesCount: e.target.value } })
                            }
                            fullWidth
                            margin="normal"
                        /></Box>
                    <Box style={{ display: 'flex', gap: '20px' }}>
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
                            label="Почтовый индекс"
                            value={employee.organization.officialAddress.zipCode}
                            type='number'
                            onChange={(e) =>
                                setEmployee({
                                    ...employee,
                                    organization: {
                                        ...employee.organization,
                                        officialAddress: { zipCode: e.target.value },
                                    },
                                })
                            }
                            fullWidth
                            margin="normal"
                        /></Box>
                    <Divider sx={{ margin: 3 }} />
                    <Button variant="contained" onClick={handleSave} color="primary">
                        Сохранить
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}

export default AddEmployeePage;
