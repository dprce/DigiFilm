export async function login(email, password) {
    try {
        const response = await fetch(
            `${import.meta.env.VITE_REACT_BACKEND_URL}/Authenticate/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({email, password}),
              credentials: "include"
            }
          );

        if (response.ok) {
            const data = await response.json();
            console.log('Login successful:', data);

            return data;

        } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData);

            return null;
        }
    } catch (error) {
        console.error('Network error:', error);

        return null;
    }
}

export const logout = async () => {
    try {
        const response = await fetch('https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Authenticate/logout', { // Update this to match your backend endpoint
            method: 'POST',
            credentials: 'include', // Include cookies or any session data
        });

        if (response.ok) {
            return true;
        } else {
            throw new Error('Failed to logout');
        }
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
};
