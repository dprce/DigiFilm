export async function login(email, password) {
    try {
        const response = await fetch(
            ${import.meta.env.VITE_REACT_BACKEND_URL}/Authenticate/login,
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

export async function logout(){
    try {
        const response = await fetch(
            ${import.meta.env.VITE_REACT_BACKEND_URL}/Authenticate/logout,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include"
            }
          );

        if (response.ok) {
            const data = await response.json();
            console.log('Logout successful:', data);

            return data;

        } else {
            const errorData = await response.json();
            console.error('Logout failed:', errorData);

            return null;
        }
    } catch (error) {
        console.error('Network error:', error);

        return null;
    }
}