import React, { useEffect, useState } from "react";
import { fetchRoles, registerEmployee } from "../api/RoleApi.jsx";
import { Container, Paper, Typography, TextField, Button, MenuItem, Grid, Box } from "@mui/material";
import "./AddEmployee.css";
import {Box, Button, MenuItem, TextField} from "@mui/material";

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

    /*return (
        <div className="add-employee">
            <div className="add-employee__form">
                <form className="HomeAdmin" onSubmit={handleSubmit}>
                    <fieldset>
                        <legend>Add Employee</legend>
                        <p><label><input type="text" name="firstName" placeholder="Name" value={employee.name}
                                         onChange={handleChange} required/></label></p>
                        <p><label><input type="text" name="lastName" placeholder="Surname" value={employee.surname}
                                         onChange={handleChange} required/></label></p>
                        <p><label><input type="email" name="email" placeholder="Mail" value={employee.email}
                                         onChange={handleChange} required/></label></p>
                        <p><label><input type="text" name="initialPassword" placeholder="Initial Password"
                                         value={employee.password} onChange={handleChange} required/></label></p>
                        <p><label><input type="tel" name="phoneNumber" placeholder="Phone Number" value={employee.phone}
                                         onChange={handleChange} required/></label></p>
                        <p>
                            <label>Role</label>
                            <select
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
            </div>
        </div>



    );*/
    //sa mui material, da bude responzivno
    return (
       < Box className="add-employee">

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
    );
};

export default AddEmployee;
