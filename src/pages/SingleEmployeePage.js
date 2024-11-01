// src/pages/SingleEmployeePage.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, TextField } from '@mui/material';

const employeeData = {
  id: 123,
  name: "John Doe",
  coordinates: { x: 50, y: 10 },
  creationDate: "2024-01-01T12:00:00Z",
  salary: 50000,
  startDate: "2024-01-01T12:00:00Z",
  endDate: "2024-12-31T12:00:00Z",
  status: "HIRED",
  organization: {
    annualTurnover: 1000000,
    employeesCount: 50,
    type: "COMMERCIAL",
    officialAddress: { zipCode: "1234567" },
  },
};

function SingleEmployeePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Here you can implement logic to fetch employee by ID
  const employee = employeeData; // Example employee data

  const handleDelete = () => {
    // Implement delete logic
    alert('Employee deleted');
    navigate('/');
  };

  const handleUpdate = () => {
    // Implement update logic
    alert('Employee updated');
  };

  return (
    <div className="p-4">
      <Card className="shadow-md">
        <CardContent>
          <Typography variant="h4" className="mb-4">{employee.name}</Typography>
          <TextField
            label="Name"
            defaultValue={employee.name}
            fullWidth
            className="mb-4"
          />
          <TextField
            label="Salary"
            defaultValue={employee.salary}
            fullWidth
            className="mb-4"
          />
          {/* Add more fields as needed */}
          <div className="flex space-x-4">
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update {id}
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
