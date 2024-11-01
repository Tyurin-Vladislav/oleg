// src/components/EmployeeCard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button } from '@mui/material';

function EmployeeCard({ employee }) {
  return (
    <Card className="shadow-md border border-gray-300" >
      <CardContent>
        <Typography variant="h5">{employee.name}</Typography>
        <Typography variant="body2" color="textSecondary">
          Salary: ${employee.salary}
        </Typography>
        <Link to={`/employee/${employee.id}`} className="mt-2 block">
          <Button variant="contained" color="primary">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default EmployeeCard;
