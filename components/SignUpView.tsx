import React, { useState } from 'react';
import { MotorcycleIcon } from './Icons';
import Spinner from './Spinner';

interface SignUpViewProps {
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onNavigateToLogin: () => void;
}

const SignUpView: React.FC<SignUpViewProps> = ({ onSignUp, onNavigateToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate name
    if (!name.trim()) {
      setError('Por favor, introduce tu nombre.');
      return;
    }
    
    if (name.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return;
    }

    // Validate email
    if (!email.trim()) {
      setError('Por favor, introduce tu email.');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Por favor, introduce un email válido.');
        return;
    }

    // Validate passwords
    if (!password) {
      setError('Por favor, introduce una contraseña.');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    
    if (!confirmPassword) {
      setError('Por favor, confirma tu contraseña.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    
    setIsLoading(true);
    try {
        await onSignUp(name, email, password);
    } catch(err: any) {
        setError(err.message || 'Error al crear la cuenta.');
    } finally {
        setIsLoading(false);
    }
  };

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
              placeholder="Nombre Completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              aria-label="Nombre Completo"
              required
              autoComplete="name"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              aria-label="Email"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              aria-label="Password"
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              aria-label="Confirm Password"
              required
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-sm text-primary text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl hover:opacity-90 transition-opacity duration-300 text-lg flex justify-center items-center disabled:opacity-50"
            >
              {isLoading ? <Spinner /> : 'Crear Cuenta'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-foreground-muted-light dark:text-foreground-muted-dark mt-8">
            ¿Ya tienes cuenta? <button type="button" onClick={onNavigateToLogin} className="font-semibold text-primary hover:underline">Inicia sesión</button>
        </p>

      </div>
      <style>{`.form-input { width: 100%; background-color: transparent; border: 1px solid #2a3c46; border-radius: 0.75rem; padding: 0.75rem 1rem; color: inherit; transition: all 0.2s; } .form-input:focus { outline: none; border-color: #1193d4; box-shadow: 0 0 0 2px rgba(17, 147, 212, 0.5); }`}</style>
    </div>
  );
};

export default SignUpView;