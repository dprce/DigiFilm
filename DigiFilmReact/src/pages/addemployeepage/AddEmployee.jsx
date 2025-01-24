import React, {useEffect, useState} from "react";
import Header from "../../components/Header.jsx";
import {jwtDecode} from "jwt-decode";
import "./AddEmployee.css";
import Footer from "../../components/Footer.jsx";
import Navbar from '../../components/Navbar.jsx';
import {fetchRoles, registerEmployee} from "../../api/RoleApi.jsx";
import {Box, Button, MenuItem, TextField} from "@mui/material";
import "../../css/common.css"


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
            const result = await registerEmployee(employee);
    
            if (result.success) {
                alert(result.message); // Show success alert
                setEmployee({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phoneNumber: "",
                    initialPassword: "",
                    roleId: "",
                });
                setError("");
            } else {
                alert(result.message); // Show failure alert
                setError(result.message);
            }
        } catch (error) {
            console.error("Error registering employee:", error);
            setError("An unexpected error occurred. Please try again.");
        }
    };
    


    return (
        <div className="app-container">
            <Navbar /> {/* Add the Navbar here */}
            <Box className="add-employee">

                <form  className="add-employee__form" onSubmit={handleSubmit}>
                    <fieldset className="add-employee__fieldset">
                        <legend>Add Employee</legend>

                        <TextField
                            fullWidth
                            label="Name"
                            name="firstName"
                            placeholder="Name"
                            value={employee.firstName}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Surname"
                            name="lastName"
                            placeholder="Surname"
                            value={employee.lastName}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            placeholder="Mail"
                            type="email"
                            value={employee.email}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Initial Password"
                            name="initialPassword"
                            placeholder="Initial Password"
                            type="password"
                            value={employee.initialPassword}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            type="tel"
                            value={employee.phoneNumber}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            select
                            label="Role"
                            name="roleId"
                            value={employee.roleId || ""}
                            onChange={handleChange}
                            required
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
                        <Button
                            variant="contained"
                            type="submit"
                            fullWidth
                            sx={{
                                backgroundColor: "#bcaaa4",
                                color: "#5d4037",
                                '&:hover': {
                                    backgroundColor: "#9e9e9e",
                                },
                            }}
                        >
                            Add Employee
                        </Button>

                    </fieldset>
                </form>
            </Box>
            <Footer/>
        </div>
    );
};

export default AddEmployee;
