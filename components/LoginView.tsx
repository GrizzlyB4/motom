import React, { useState } from 'react';
import { User } from '../types';
import { MotorcycleIcon } from './Icons';

interface LoginViewProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToSignUp: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
        setError("Por favor, introduce tu email.");
        return;
    }
    if (!password.trim()) {
        setError("Por favor, introduce tu contraseña.");
        return;
    }
    onLogin(email, password);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
            <MotorcycleIcon className="w-16 h-16 text-primary mb-2" />
            <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">MotoMarket</h1>
            <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-1">Inicia sesión para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              id="login-email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              aria-label="Email"
            />
          </div>
          <div>
            <input
              type="password"
              id="login-password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              aria-label="Password"
            />
          </div>

          {error && <p className="text-sm text-primary text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity duration-300 text-lg"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-8">
            ¿No tienes cuenta? <button type="button" onClick={onNavigateToSignUp} className="font-semibold text-primary hover:underline">Regístrate</button>
        </p>

      </div>
      <style>{`.form-input { width: 100%; background-color: transparent; border: 1px solid #2a3c46; border-radius: 0.75rem; padding: 0.75rem 1rem; color: inherit; transition: all 0.2s; } .form-input:focus { outline: none; border-color: #1193d4; box-shadow: 0 0 0 2px rgba(17, 147, 212, 0.5); }`}</style>
    </div>
  );
};

export default LoginView;