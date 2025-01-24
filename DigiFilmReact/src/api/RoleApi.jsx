export async function fetchRoles() {
    try {
        const response = await fetch(`https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Role/all-roles`, {
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
        const response = await fetch(
            `https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Authenticate/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(employeeData),
                credentials: "include", // Include cookies or credentials
            }
        );

        if (response.ok) {
            const data = await response.json();
            console.log("Registration successful:", data);
            return { success: true, message: data.message || "Employee registered successfully." };
        } else {
            const errorData = await response.json();
            console.error("Registration failed:", errorData);
            return { success: false, message: errorData.message || "Failed to register employee." };
        }
    } catch (error) {
        console.error("Error during registration:", error);
        return { success: false, message: "An error occurred during registration." };
    }
}


export async function fetchFilms() {
    try {
        const response = await fetch(`https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Film/get-all-films`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies or credentials
        });

        if (response.ok) {
            const data = await response.json();
            return data.films; // Assuming 'films' is the key in the API response containing the film list
        } else {
            console.error('Failed to fetch films. Status:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching films:', error);
        return [];
    }
}

export async function fetchBatches() {
    try {
        const response = await fetch(`https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Film/get-all-batches`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies or credentials
        });

        if (response.ok) {
            const data = await response.json();
            return data.batches; // Assuming 'films' is the key in the API response containing the film list
        } else {
            console.error('Failed to fetch films. Status:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching films:', error);
        return [];
    }
}

export async function fetchUsers() {
    try {
        const response = await fetch(`https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/User/all-users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies or credentials
        });

        if (response.ok) {
            const data = await response.json();
            return data.users; // Assuming 'films' is the key in the API response containing the film list
        } else {
            console.error('Failed to fetch films. Status:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error fetching films:', error);
        return [];
    }
}


export const sendReturnedBatches = async (selectedBatches, allBatches, performedBy) => {

    const payload = selectedBatches.map((batchId) => {

        return {
            batchId: batchId,
            action: "Completed", //NEVAŽNO
            performedBy: performedBy,
        };
    });

    try {
      const response = await fetch("https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Film/complete-batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send data to the backend");
      }
  
      // If your backend returns JSON, parse and return it (optional):
      const data = await response.json();
      return data;
    } catch (error) {
        console.error("Error sending data to backend:", error);
        // Throw or handle error as needed
    }
};

export const fetchEmployeeBatchData = async (employeeIds) => {
    const response = await fetch("https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Film/get-employee-batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employeeIds),
    });
    return response.json();
  };