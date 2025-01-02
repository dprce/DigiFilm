import React, { useEffect, useState } from "react";
import { fetchRoles, registerEmployee } from "../api/RoleApi.jsx";
import { Container, Paper, Typography, TextField, Button, MenuItem, Grid, Box } from "@mui/material";
import "./AddEmployee.css";

const AddEmployee = () => {
    const [roles, setRoles] = useState([]);
    const [employee, setEmployee] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        initialPassword: "",
        roleId: "",
    });

    const [error, setError] = useState("");

    useEffect(() => {
        const loadRoles = async () => {
            try {
                const rolesData = await fetchRoles();
                setRoles(rolesData);
            } catch (error) {
                console.error("Error fetching roles:", error);
                setError("Failed to load roles. Please try again later.");
            }
        };
        loadRoles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee((prevState) => ({
            ...prevState,
            [name]: name === "roleId" ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitting employee:", employee);
        try {
            await registerEmployee(employee);
            console.log("Employee registered successfully.");
            setEmployee({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: "",
                initialPassword: "",
                roleId: "",
            });
            setError("");
        } catch (error) {
            console.error("Error registering employee:", error);
            setError("Failed to register employee. Please try again.");
        }
    };

    return (
        <Container maxWidth="md" sx={{ marginTop: "30px" }}>
            <Paper elevation={3} sx={{ padding: "20px", borderRadius: "10px" }}>
                <Typography variant="h4" gutterBottom sx={{ textAlign: "center", marginBottom: "20px", fontWeight: 600 }}>
                    Add New Employee
                </Typography>
                {error && (
                    <Typography variant="body1" color="error" sx={{ marginBottom: "15px", textAlign: "center" }}>
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                value={employee.firstName}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                value={employee.lastName}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={employee.email}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                type="email"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phoneNumber"
                                value={employee.phoneNumber}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                type="tel"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Initial Password"
                                name="initialPassword"
                                value={employee.initialPassword}
                                onChange={handleChange}
                                required
                                variant="outlined"
                                type="password"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Role"
                                name="roleId"
                                value={employee.roleId || ""}
                                onChange={handleChange}
                                required
                                variant="outlined"
                            >
                                <MenuItem value="" disabled>
                                    Select Role
                                </MenuItem>
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.roleName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ padding: "10px 20px", borderRadius: "20px" }}
                                >
                                    Add Employee
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default AddEmployee;
