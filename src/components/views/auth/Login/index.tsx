import Link from 'next/link';
import styles from './Login.module.scss';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
const LoginView = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { push, query } = useRouter();

    const callbackUrl: any = query.callbackUrl || '/';
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        const form = event.target as HTMLFormElement;
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email: form.email.value,
                password: form.password.value,
                callbackUrl: Array.isArray(callbackUrl)
                    ? callbackUrl[0]
                    : callbackUrl,
            });
            console.log(res);
            if (!res?.error) {
                setIsLoading(false);
                form.reset();
                push(callbackUrl);
            } else {
                setIsLoading(false);
                setError('Invalid email or password');
            }
        } catch (error) {
            setIsLoading(false);
            setError('Invalid email or password');
        }
    };
    return (
        <div className={styles.login}>
            <h1 className={styles.login__title}>Login</h1>
            {error && <p className={styles.login__error}>{error}</p>}
            <div className={styles.login__form}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.login__form__item}>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            name='email'
                            id='email'
                            className={styles.login__form__item__input}
                        />
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            name='password'
                            id='password'
                            className={styles.login__form__item__input}
                        />
                    </div>
                    <button
                        type='submit'
                        className={styles.login__form__button}>
                        {isLoading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
            <p className={styles.login__link}>
                Don{"'"}t have an account? Sign Up{' '}
                <Link href={'/auth/register'}>here.</Link>
            </p>
        </div>
    );
};

export default LoginView;
