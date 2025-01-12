import React, {useEffect, useState} from 'react';
import Header from "../../components/Header.jsx";
import {fetchRoles, registerEmployee} from '../../api/RoleApi.jsx';
import "./AddEmployee.css";
import {Box, Button, MenuItem, TextField} from "@mui/material";
import Footer from "../../components/Footer.jsx";

const AddEmployee = () => {

    const [roles, setRoles] = useState([]);
    const [employee, setEmployee] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        initialPassword: '',
        roleId: ''
    });

    useEffect(() => {
        const loadRoles = async () => {
            const rolesData = await fetchRoles();
            setRoles(rolesData);
        };
        loadRoles();
    }, []);


    const handleChange = (e) => {
        const {name, value} = e.target;
        setEmployee(prevState => ({
            ...prevState,
            [name]: name === 'roleId' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submitting employee:", employee);
        try {
            await registerEmployee(employee);
            console.log("Employee registered successfully.");
            setEmployee({
                name: '',
                surname: '',
                email: '',
                phone: '',
                password: '',
                roleId: ''
            });
        } catch (error) {
            console.error("Error registering employee:", error);
        }
    };

    return (
        <div className="home">
            <Header/>
            <Box className="add-employee">

                <form  className="add-employee__form" onSubmit={handleSubmit}>
                    <fieldset className="add-employee__fieldset">
                        <legend>Add Employee</legend>

                        <TextField
                            fullWidth
                            label="Name"
                            name="firstName"
                            placeholder="Name"
                            value={employee.name}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Surname"
                            name="lastName"
                            placeholder="Surname"
                            value={employee.surname}
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
                            value={employee.password}
                            onChange={handleChange}
                            required
                        />
                        <TextField
                            fullWidth
                            label="Phone Number"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            type="tel"
                            value={employee.phone}
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
    )
}

export default AddEmployee;