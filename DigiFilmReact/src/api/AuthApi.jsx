export async function login(email, password) {
    try {
        const response = await fetch(
            `https://localhost:7071/Authenticate/login`,
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
        window.location.href = "https://localhost:7071/Authenticate/logout";
        
    } catch (error) {
        console.error("Network error during logout:", error);
    }
};
