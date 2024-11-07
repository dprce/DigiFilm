import { useState } from "react";
import './App.css';

const App = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Polja Korisnik i Lozinka moraju biti ispunjeni.");
        } else if (
            !username.includes("@fer.hr") &&
            !username.includes("@fer.unizg.hr")
        ) {
            setError("Morate se prijaviti FER računom.");
        } else {
            setError("");
            alert("Uspješno ste se prijavili, podatci poslani serveru.");
        }
    };

    return (
        <div className="app">
            <form className="login" onSubmit={handleSubmit}>
                <h1>Welcome to DigiFilm!</h1>
                <h2>Login</h2>

                {error && <p className="error">{error}</p>}

                <div>
                    <input
                        className="tekst"
                        type="text"
                        name="username"
                        placeholder="Korisnik"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="tekst"
                        type="password"
                        name="password"
                        placeholder="Lozinka"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <input className="submit" type="submit" value="Login"></input>
            </form>
        </div>
    );
};

export default App;
