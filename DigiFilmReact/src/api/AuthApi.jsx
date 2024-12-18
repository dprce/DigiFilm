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
        // Send a POST request to the logout endpoint
        const response = await fetch(
            "https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Authenticate/logout",
            {
                method: "POST",
                credentials: "include", // Include cookies for session handling
                headers: {
                    "Content-Type": "application-json"
                }
            }
        );

        if (response.ok) {
            console.log("Logout successful");

            // Redirect to the frontend homepage
            window.location.href = "https://digi-film-react.vercel.app";
        } else {
            console.error("Logout failed:", response.statusText);
        }
    } catch (error) {
        console.error("Network error during logout:", error);
    }
};
