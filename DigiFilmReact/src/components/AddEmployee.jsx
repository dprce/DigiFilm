import React, {useEffect, useState} from 'react';
import {fetchRoles, registerEmployee} from '../api/RoleApi.jsx';
import "./AddEmployee.css";

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
                            >
                                <option value="" disabled>Select Role</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.roleName}</option>
                                ))}
                            </select>
                        </p>
                        <button type="submit">Add Employee</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
