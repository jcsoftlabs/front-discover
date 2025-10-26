'use client';

import { useState } from 'react';
import { X, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/lib/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 
      'Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial'),
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  role: z.enum(['USER', 'PARTNER']),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthModal({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register: registerUser, loginWithGoogle } = useAuth();

  const {
    register: registerForm,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerFormRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors },
    reset: resetRegister,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'USER' },
  });

  const selectedRole = watch('role');

  const handleLoginForm = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      resetLogin();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterForm = async (data: RegisterFormData) => {
    setError(null);
    setIsLoading(true);
    try {
      await registerUser(data);
      resetRegister();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Erreur lors de la connexion avec Google');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
    resetLogin();
    resetRegister();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {mode === 'login' ? (
                  <>
                    <LogIn className="w-6 h-6" />
                    Connexion
                  </>
                ) : (
                  <>
                    <UserPlus className="w-6 h-6" />
                    Inscription
                  </>
                )}
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 p-2 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-blue-100 mt-2">
              {mode === 'login'
                ? 'Connectez-vous pour accéder à toutes les fonctionnalités'
                : 'Créez votre compte et découvrez Haïti'}
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit(handleLoginForm)} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...registerForm('email')}
                      type="email"
                      placeholder="votre@email.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{loginErrors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...registerForm('password')}
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {loginErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit(handleRegisterForm)} className="space-y-4">
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de compte
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input
                        {...registerFormRegister('role')}
                        type="radio"
                        value="USER"
                        className="sr-only"
                      />
                      <div
                        className={`p-4 border-2 rounded-lg text-center transition ${
                          selectedRole === 'USER'
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <User className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                        <span className="font-medium">Utilisateur</span>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        {...registerFormRegister('role')}
                        type="radio"
                        value="PARTNER"
                        className="sr-only"
                      />
                      <div
                        className={`p-4 border-2 rounded-lg text-center transition ${
                          selectedRole === 'PARTNER'
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <UserPlus className="w-8 h-8 mx-auto mb-2 text-green-600" />
                        <span className="font-medium">Partenaire</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <input
                      {...registerFormRegister('firstName')}
                      type="text"
                      placeholder="Jean"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {registerErrors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{registerErrors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      {...registerFormRegister('lastName')}
                      type="text"
                      placeholder="Dupont"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {registerErrors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{registerErrors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...registerFormRegister('email')}
                      type="email"
                      placeholder="votre@email.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {registerErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...registerFormRegister('password')}
                      type="password"
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {registerErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                >
                  {isLoading ? 'Inscription...' : 'S&apos;inscrire'}
                </button>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                text={mode === 'login' ? 'signin_with' : 'signup_with'}
              />
            </div>

            {/* Switch Mode */}
            <div className="mt-6 text-center">
              <button
                onClick={switchMode}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {mode === 'login'
                  ? "Pas encore de compte ? S&apos;inscrire"
                  : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
