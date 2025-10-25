'use client';

import { useState } from 'react';
import { login } from '../../../lib/api/clientApi';
import { useRouter } from 'next/navigation';
import css from './SignInPage.module.css';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

    const isAxiosError = (err: unknown): err is { response?: { data?: { message?: string } } } => {
    return typeof err === 'object' && err !== null && 'response' in err;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
        await login({ email, password });
    router.push("/profile");
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      setError(err.response?.data?.message || "Request failed");
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Something went wrong");
    }
  }
};

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
