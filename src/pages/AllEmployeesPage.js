import React, { useCallback, useEffect, useState } from 'react';
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
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper, List, ListItem, ListItemAvatar, Avatar, Divider, ListItemText
} from "@mui/material";
import { fetchEmployeeCountByDate, fetchSalaries, fetchWorkers } from "../api/Responses";
import { toast, ToastContainer } from "react-toastify";
import { Money as MoneyIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function AllEmployeesPage() {
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('name');
    const [filterStatus, setFilterStatus] = useState('HIRED');
    const [filterSalary, setFilterSalary] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(100);
    const [dateInput, setDateInput] = useState('');
    const [employeeCount, setEmployeeCount] = useState(100);
    const [salaries, setSalaries] = useState([]);

    // // Load workers with updated parameters
    const loadWorkers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchWorkers(sortBy, filterStatus, filterSalary, page, pageSize);
            setWorkers(data);
            toast.success('Работники успешно получены');
        } catch (error) {
            if (error.message === "Network Error") {
                toast.error("Сервис временно недоступен. Попробуйте позже.");
            }
            else {
                const errorMessage = error.response?.data?.message || 'Ошибка получения работников';
                toast.error(errorMessage);
            }

        } finally {
            setLoading(false);
        }
    }, [sortBy, filterStatus, filterSalary, page, pageSize]);

    // // Fetch salaries
    const loadSalaries = useCallback(async () => {
        try {
            const salaryData = await fetchSalaries();
            setSalaries(salaryData);
           
            toast.success('Зарплаты успешно получены');
        } catch (error) {
            if (error.message === 'Network Error') {
                toast.error("Сервис временно недоступен. Попробуйте позже.");
            }
            else {
                const errorMessage = error.response?.data?.message || 'Ошибка получения зарплат';
                toast.error(errorMessage);
            }
        }
    }, []);

    // Call loadWorkers in useEffect
    useEffect(() => {
        loadWorkers();
        loadSalaries();
    }, []);

    const handleDateCount = async () => {
        try {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
                toast.error('Введите корректную дату');
                return;
            }

            const [year, month, day] = dateInput.split('-');
            const formattedDate = `${day}.${month}.${year}`;

            const count = await fetchEmployeeCountByDate(formattedDate);
            setEmployeeCount(count);
            toast.success(`Количество сотрудников от ${formattedDate}: ${employeeCount}`);
        } catch (error) {
            if (error.message === 'Request failed with status code 404') {
                toast.success(`Количество сотрудников на данную дату: 0.\nВведите дату более раннего периода.`);
            } else if (error.message === 'Network Error') {
                toast.error("Сервис временно недоступен. Попробуйте позже.");
            }
            else {
                const errorMessage = error.response?.data?.message || 'Ошибка получения количества сотрудников';
                toast.error(errorMessage);
            }
        }
    };



    return (
        <Box sx={{ padding: 10 }}>
            <ToastContainer />
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">

                <Link to="/add-employee" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="success" sx={{ marginBottom: 2 }}>
                        Добавить сотрудника
                    </Button>
                </Link>

                <Typography variant="h4" component="h1" gutterBottom>Все сотрудники</Typography>

                {/* Пустой элемент справа для выравнивания */}
                <Box width="200px" />
            </Box>
            {/* Date count section */}
            <Divider sx={{ margin: 3 }} />
            <Typography variant="h6" sx={{ marginTop: 4 }}>Проверить количество сотрудников по дате</Typography>
            <TextField
                label="Дата"
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" onClick={handleDateCount} sx={{ marginTop: 2 }}>
                Получить количество
            </Button>
            <Divider sx={{ margin: 3 }} />

            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Список уникальных зарплат:
                </Typography>

                <Box sx={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {salaries.length > 0 ? (
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {salaries
                                .sort((a, b) => b - a) // Сортировка по убыванию
                                .map((salary, index) => (
                                    <div key={index}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar sx={{ backgroundColor: 'primary.main' }}>
                                                    <MoneyIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={`Зарплата №${index + 1}: ${salary} ₽`} />
                                        </ListItem>
                                        {index < salaries.length - 1 && <Divider />}
                                    </div>
                                ))}
                        </List>
                    ) : (
                        <Typography color="textSecondary" sx={{ marginTop: 2 }}>
                            Зарплаты не найдены
                        </Typography>
                    )}
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={loadSalaries} // Вызов функции для загрузки зарплат
                    sx={{ marginTop: 2 }}
                >
                    Обновить список зарплат
                </Button>
            </Box>
            <Divider sx={{ margin: 3 }} />
            <Typography variant="h6" sx={{ marginTop: 4 }}>Параметры сортировки и фильтрации</Typography>
            {/* Sorting and filters */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Сортировать по полю</InputLabel>
                <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <MenuItem value="id">ID</MenuItem>
                    <MenuItem value="name">Имя</MenuItem>
                    <MenuItem value="salary">Зарплата</MenuItem>
                    <MenuItem value="creationDate">Дата принятия на работу</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
                <InputLabel>Статус</InputLabel>
                <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    {/* <MenuItem value="NULL">Любой</MenuItem>*/}
                    <MenuItem value="HIRED">Нанят</MenuItem>
                    <MenuItem value="RECOMMENDED_FOR_PROMOTION">Рекомендован</MenuItem>
                    <MenuItem value="REGULAR">Обычый</MenuItem>
                    <MenuItem value="FIRED">Уволен</MenuItem>
                </Select>
            </FormControl>

            <TextField
                label="Зарплата"
                type="number"
                value={filterSalary}
                onChange={(e) => setFilterSalary(e.target.value)}
                fullWidth
                margin="normal"
            />

            <Button variant="contained" onClick={loadWorkers} sx={{ margin: 3 }}>
                Поиск
            </Button>
            <Divider sx={{ margin: 3 }} />


            {/* Workers table */}
            <Typography variant="h6" sx={{ marginTop: 4 }}>Таблица работников</Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                    <Table aria-label="worker table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ textAlign: "center" }}>ID</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Имя</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Статус</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Зарплата</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Дата приема</TableCell>
                                <TableCell sx={{ textAlign: "center" }}>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {workers.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell sx={{ textAlign: "center" }}>{employee.id}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{employee.name}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{employee.status}</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>{employee.salary} ₽</TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        {employee.startDate}
                                    </TableCell>
                                    <TableCell sx={{ textAlign: "center" }}>
                                        <Link to={`/employee/${employee.id}`} className="mt-2 block">
                                            <Button variant="contained" color="primary">
                                                Управлять
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Pagination */}
            {/* <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
                <Pagination
                    count={employeeCount} // Ensure that employeeCount and pageSize are correct
                    page={page}
                    onChange={(event, value) => setPage(value)} // Update page state
                    variant="outlined"
                    shape="rounded"
                    showFirstButton
                    showLastButton
                />
                 Display current page and total pages 
                <Typography sx={{ marginLeft: 2 }}>
                    Страница {page} из {Math.ceil(employeeCount / pageSize)}
                </Typography>
            </Box> */}
        </Box>
    );
}

export default AllEmployeesPage;
