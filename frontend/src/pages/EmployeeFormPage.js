import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

async function fetchEmployeeById(id) {
  const response = await apiClient.get(`/emp/employees/${id}`);
  return response.data;
}

export default function EmployeeFormPage({ mode }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    salary: "",
    date_of_joining: "",
    department: "",
    profile_image: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const { data: employeeData, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => fetchEmployeeById(id),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (isEdit && employeeData) {
      setForm({
        first_name: employeeData.first_name || "",
        last_name: employeeData.last_name || "",
        email: employeeData.email || "",
        position: employeeData.position || "",
        salary: employeeData.salary || "",
        date_of_joining: employeeData.date_of_joining
          ? employeeData.date_of_joining.substring(0, 10)
          : "",
        department: employeeData.department || "",
        profile_image: employeeData.profile_image || "",
      });
    }
  }, [isEdit, employeeData]);

  const createMutation = useMutation({
    mutationFn: async (payload) =>
      apiClient.post("/emp/employees", payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      navigate("/employees");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload) =>
      apiClient.put(`/emp/employees/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]);
      queryClient.invalidateQueries(["employee", id]);
      navigate("/employees");
    },
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profile_image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.position ||
      !form.salary ||
      !form.date_of_joining ||
      !form.department
    ) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...form,
      salary: Number(form.salary),
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isEdit && isLoadingEmployee) {
    return <Typography>Loading employee data...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {isEdit ? "Update Employee" : "Add Employee"}
        </Typography>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="First Name"
                fullWidth
                margin="normal"
                value={form.first_name}
                onChange={handleChange("first_name")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Name"
                fullWidth
                margin="normal"
                value={form.last_name}
                onChange={handleChange("last_name")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={form.email}
                onChange={handleChange("email")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Position"
                fullWidth
                margin="normal"
                value={form.position}
                onChange={handleChange("position")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Salary"
                fullWidth
                margin="normal"
                type="number"
                value={form.salary}
                onChange={handleChange("salary")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date of Joining"
                fullWidth
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={form.date_of_joining}
                onChange={handleChange("date_of_joining")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Department"
                fullWidth
                margin="normal"
                value={form.department}
                onChange={handleChange("department")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Profile Picture
                </Typography>
                <Button variant="outlined" component="label">
                  Upload Image
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
              </Box>
              {form.profile_image && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">Preview:</Typography>
                  <img
                    src={form.profile_image}
                    alt="Profile preview"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button type="submit" variant="contained">
              Save
            </Button>
            <Button variant="outlined" onClick={() => navigate("/employees")}>
              Cancel
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}