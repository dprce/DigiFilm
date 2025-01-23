export async function login(email, password) {
    console.log("login function called with email:", email, "and password:", password);

    try {
        const response = await fetch(
            `https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Authenticate/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include",
            }
        );

        console.log("Fetch response received:", response); // Check the raw response

        if (response.ok) {
            const data = await response.json();
            console.log("Login successful:", data);

            const { accessToken } = data;
            if (accessToken) {
                localStorage.setItem("accessToken", accessToken);
                console.log("Access token stored in localStorage.");
            }

            return data;
        } else {
            const errorData = await response.json();
            console.error("Login failed:", errorData);
            return null;
        }
    } catch (error) {
        console.error("Network error:", error);
        return null;
    }
}

export const logout = async () => {
    try {
        const response = await fetch("https://digifilm-bmcje7bndqefb7e9.italynorth-01.azurewebsites.net/Authenticate/logout", {
            method: "POST",
            credentials: "include", // Include credentials (cookies)
        });

        if (response.ok) {
            // Redirect to the redirect URI after logout
            window.location.href = "https://digi-film-react.vercel.app";
        } else {
            console.error("Failed to log out:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Network error during logout:", error);
    }
};

