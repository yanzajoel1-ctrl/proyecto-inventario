import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../services/api';
import '../App.css';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        setError('');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Error al iniciar sesión');
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/dashboard');
        } catch (error) {
            setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Sistema de Inventario</h1>

                <h2>Inicio de Sesión</h2>

                <form className="login-form" onSubmit={handleLogin}>

                    <div className="form-group">
                        <label htmlFor="email">
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Ingrese su correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        className="login-button"
                        type="submit"
                    >
                        Ingresar
                    </button>

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                </form>

            </div>

        </div>
    );
}

export default Login;