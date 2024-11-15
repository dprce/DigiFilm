import React, {useState} from 'react';

const AddEmployee = () => {
    const [employee, setEmployee] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        password: '',
        role: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    }
    return (
        <form className="HomeAdmin" onSubmit={handleSubmit}>
            <fieldset>
                <legend>Add Employee</legend>
                <p><label><input type="text" name="name" placeholder="Name" value={employee.name} onChange={handleChange} required></input></label></p>
                <p><label><input type="text" name="surname" placeholder="Surname" value={employee.surname} onChange={handleChange} required></input></label></p>
                <p><label><input type="email" name="email" placeholder="Mail" value={employee.email} onChange={handleChange} required></input></label></p>
                <p><label><input type="text" name="password" placeholder="Initial Password" value={employee.password} onChange={handleChange} required></input></label></p>
                <p><label><input type="tel" name="phone" placeholder="Phone Number" value={employee.phone} onChange={handleChange} required></input></label></p>
                <p>
                    <label>Role</label>
                    <select name="roles" aria-placeholder="Select Role" value={employee.role} onChange={handleChange} required>
                        <option value="DataReview">Data Review</option>
                        <option value="DataEntry">Data Entry</option>
                        <option value="DigitizationProcessManager">Digitization Process Manager</option>
                    </select>
                </p>
                <button type="submit">Add Employee</button>
            </fieldset>
        </form>
    )
}

export default AddEmployee;