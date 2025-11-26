import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/apiClient";

async function fetchEmployeeById(id) {
  const response = await apiClient.get(`/emp/employees/${id}`);
  return response.data;
}

export default function EmployeeDetailsPage() {
  const { id } = useParams();

  const { data: emp, isLoading, isError } = useQuery({
    queryKey: ["employee", id],
    queryFn: () => fetchEmployeeById(id),
  });

  if (isLoading) {
    return <Typography>Loading employee details...</Typography>;
  }

  if (isError || !emp) {
    return (
      <Typography color="error">
        Failed to load employee details.
      </Typography>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          View Employee Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {emp.profile_image && (
            <Box>
              <img
                src={emp.profile_image}
                alt={`${emp.first_name} ${emp.last_name}`}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #ddd",
                }}
              />
            </Box>
          )}
          <Box>
            <Typography>
              <strong>First Name:</strong> {emp.first_name}
            </Typography>
            <Typography>
              <strong>Last Name:</strong> {emp.last_name}
            </Typography>
            <Typography>
              <strong>Email:</strong> {emp.email}
            </Typography>
            <Typography>
              <strong>Department:</strong> {emp.department}
            </Typography>
            <Typography>
              <strong>Position:</strong> {emp.position}
            </Typography>
            <Typography>
              <strong>Salary:</strong> {emp.salary}
            </Typography>
            <Typography>
              <strong>Date of Joining:</strong>{" "}
              {emp.date_of_joining
                ? emp.date_of_joining.substring(0, 10)
                : ""}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}