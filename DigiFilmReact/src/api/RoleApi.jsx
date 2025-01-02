export async function fetchRoles() {
    try {
        const response = await fetch(`https://localhost:7071/Role/all-roles`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies or credentials
        });

        if (response.ok) {
            const data = await response.json();
            return data.roles;
        } else {
            console.error('Failed to fetch roles. Status:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching roles:', error);
        return [];
    }
}

export async function registerEmployee(employeeData) {
    try {
        const response = await fetch(`https://localhost:7071/Authenticate/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
            credentials: 'include', // Include cookies or credentials
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Registration successful:", data);
            return data;
        } else {
            const errorData = await response.json();
            console.error("Registration failed:", errorData);
            return errorData;
        }
    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
}

