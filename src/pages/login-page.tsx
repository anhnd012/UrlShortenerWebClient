import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link2, Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginFormSchema = z.object({
  email: z.string()
    .min(1, 'Email is required.')
    .email('Enter a valid email format.')
    .max(254, 'Email must not exceed 254 characters.'),
  password: z.string()
    .min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // Mode B: final submission is disabled.
    console.log('Login attempt with', data);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Column: Form Area */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md space-y-8 lg:w-[420px]">
          {/* Logo & Header */}
          <div className="space-y-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <Link2 className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight text-text-primary">
                LinkFlow
              </span>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight text-text-primary">
              Log in and start sharing
            </h2>
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <span className="text-text-muted cursor-not-allowed">Sign up (disabled)</span>
            </p>
          </div>

          {/* Mode B Authentication Notice banner */}
          <div className="rounded-card border border-warning/20 bg-warning-soft p-4 text-warning space-y-1">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Auth Notice</h4>
            </div>
            <p className="text-xs leading-relaxed font-semibold">
              Authentication backend is not available yet. The login action is currently disabled.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-text-primary">
                Email address
              </label>
              <input
                {...register('email')}
                type="email"
                id="email"
                disabled
                placeholder="user@example.com"
                className={`block w-full rounded-input border ${
                  errors.email ? 'border-danger' : 'border-border'
                } bg-surface-muted px-4 py-2.5 text-sm text-text-muted focus:outline-none cursor-not-allowed`}
              />
              {errors.email && (
                <p className="text-xs font-semibold text-danger">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-text-primary">
                Password
              </label>
              <div className="relative rounded-input shadow-sm">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  disabled
                  placeholder="••••••••"
                  className={`block w-full rounded-input border ${
                    errors.password ? 'border-danger' : 'border-border'
                  } bg-surface-muted pl-4 pr-10 py-2.5 text-sm text-text-muted focus:outline-none cursor-not-allowed`}
                />
                <button
                  type="button"
                  disabled
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary cursor-not-allowed"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs font-semibold text-danger">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled
              className="w-full rounded-button bg-primary/50 cursor-not-allowed py-3 px-4 text-sm font-semibold text-white shadow-sm transition-colors"
            >
              Log in
            </button>
          </form>

          {/* Back button */}
          <div className="text-center">
            <Link to="/" className="text-xs text-primary font-semibold hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Branded Visual Panel (CSS gradient / shapes) */}
      <div className="hidden lg:block relative flex-1 bg-slate-900 overflow-hidden">
        {/* Glow circles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.15),transparent)]" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-info/10 rounded-full blur-3xl" />

        {/* Dynamic center shape graphic */}
        <div className="flex h-full flex-col justify-center items-center p-12 text-center text-white relative z-10">
          <div className="max-w-md space-y-4">
            <div className="mx-auto rounded-2xl bg-white/5 border border-white/10 p-6 w-fit shadow-2xl animate-pulse">
              <Link2 className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-bold">LinkFlow Analytics</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Shorten links with customized local expiration ranges, map redirection targets, and access granular click analytics dashboards instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
