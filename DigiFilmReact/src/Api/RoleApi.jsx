export async function fetchRoles() {
    try {
        const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/Role/all-roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.roles;
        } else {
            console.error('Failed to fetch roles');
            return [];
        }
    } catch (error) {
        console.error('Error fetching roles:', error);
        return [];
    }
}



export async function registerEmployee(employeeData) {
    try {
        const response = await fetch(`${import.meta.env.VITE_REACT_BACKEND_URL}/Authenticate/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData),
            credentials: "include"
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            return errorData;
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
}
