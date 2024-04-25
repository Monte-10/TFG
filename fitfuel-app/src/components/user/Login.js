// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      setError('');
  
      try {
        const response = await fetch(`${apiUrl}/user/frontlogin/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Falló el inicio de sesión');
        }
  
        const { token } = await response.json();
        localStorage.setItem('authToken', token); // Guardar token en el localStorage
        onLoginSuccess(token); // Actualizar estado de autenticación en el componente padre
        navigate('/dashboard'); // Redirigir al dashboard
      } catch (error) {
        setError(error.message);
      }
    };

  return (
    <main className="main">
      <div className="container">
        <section className="section login d-flex align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                      <p className="text-center small">Enter your username & password to login</p>
                    </div>

                    <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                      <div className="col-12">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                      </div>
                      <div className="col-12">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                      <div className="col-12">
                        <button className="btn btn-primary w-100" type="submit">Login</button>
                      </div>
                      {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
