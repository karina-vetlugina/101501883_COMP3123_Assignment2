import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

async function fetchEmployees({ queryKey }) {
  const [, filter] = queryKey;
  const params = {};
  if (filter.department) params.department = filter.department;
  if (filter.position) params.position = filter.position;

  const url =
    params.department || params.position
      ? "/emp/employees/search"
      : "/emp/employees";

  const response = await apiClient.get(url, { params });
  return response.data;
}

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");

  const { data: employees = [], isLoading, isError } = useQuery({
    queryKey: ["employees", { department, position }],
    queryFn: fetchEmployees,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) =>
      apiClient.delete(`/emp/employees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
    },
  });

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleClearSearch = () => {
    setDepartment("");
    setPosition("");
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography variant="h5">Employees List</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate("/employees/new")}
          >
            Add Employee
          </Button>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Search by Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <TextField
            label="Search by Position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <Button variant="outlined" onClick={handleClearSearch}>
            Clear
          </Button>
        </Box>

        {isLoading && <Typography>Loading employees...</Typography>}
        {isError && (
          <Typography color="error">
            Failed to load employees. Please try again.
          </Typography>
        )}

        {!isLoading && employees.length === 0 && (
          <Typography>No employees found.</Typography>
        )}

        {employees.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.employee_id}>
                  <TableCell>{emp.first_name}</TableCell>
                  <TableCell>{emp.last_name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/employees/${emp.employee_id}`)
                      }
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/employees/${emp.employee_id}/edit`)
                      }
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(emp.employee_id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}