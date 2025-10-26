import React, { useState } from 'react';
import { User } from '../types';
import { MotorcycleIcon } from './Icons';

interface SignUpViewProps {
  onSignUp: (name: string, email: string, password: string) => void;
  onNavigateToLogin: () => void;
}

const SignUpView: React.FC<SignUpViewProps> = ({ onSignUp, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Por favor, introduce un email válido.');
        return;
    }
    if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
    }
    
    onSignUp(name, email, password);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex flex-col items-center mb-8">
            <MotorcycleIcon className="w-16 h-16 text-primary mb-2" />
            <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">MotoMarket</h1>
          </div>
          
          <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 text-center">
            <h2 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-4">¡Registro Exitoso!</h2>
            <p className="text-foreground-muted-light dark:text-foreground-muted-dark mb-4">
              Hemos enviado un correo de confirmación a <span className="font-semibold">{email}</span>. 
              Por favor, revisa tu bandeja de entrada y haz clic en el enlace de confirmación para completar tu registro.
            </p>
            <button
              onClick={onNavigateToLogin}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity duration-300 text-lg mt-4"
            >
              Ir a Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex flex-col items-center mb-8">
            <MotorcycleIcon className="w-16 h-16 text-primary mb-2" />
            <h1 className="text-3xl font-bold text-foreground-light dark:text-foreground-dark">Crear Cuenta</h1>
            <p className="text-foreground-muted-light dark:text-foreground-muted-dark mt-1">Únete a la comunidad de MotoMarket</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              id="signup-name"
              name="name"
              placeholder="Nombre Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              aria-label="Nombre Completo"
              required
            />
          </div>
          <div>
            <input
              type="email"
              id="signup-email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              aria-label="Email"
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="signup-password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              aria-label="Password"
              required
            />
          </div>
          <div>
            <input
              type="password"
              id="signup-confirm-password"
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              aria-label="Confirm Password"
              required
            />
          </div>

          {error && <p className="text-sm text-primary text-center">{error}</p>}

          <div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity duration-300 text-lg"
            >
              Crear Cuenta
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-8">
            ¿Ya tienes cuenta? <button type="button" onClick={onNavigateToLogin} className="font-semibold text-primary hover:underline">Inicia sesión</button>
        </p>

      </div>
      <style>{`.form-input { width: 100%; background-color: transparent; border: 1px solid #2a3c46; border-radius: 0.75rem; padding: 0.75rem 1rem; color: #F8F9FA; transition: all 0.2s; } .form-input:focus { outline: none; border-color: #1193d4; box-shadow: 0 0 0 2px rgba(17, 147, 212, 0.5); } .dark .form-input { color: #F8F9FA; }`}</style>
    </div>
  );
};

export default SignUpView;