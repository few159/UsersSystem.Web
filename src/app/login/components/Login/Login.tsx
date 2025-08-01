'use client';

import styles from './login.module.scss';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { emitToaster } from '@/common/Utils';
import Loader from '@/components/Loader/Loader';
import { useLogin } from '@/hooks/useAccessApi';

interface Props {
    isSignUp: boolean
}
export default function LoginPageComponent({ isSignUp }: Props) {
    const router = useRouter()

    const { mutateAsync: loginAsync } = useLogin();

    const mail = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const name = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function signIn() {
        if ((!mail.current || !mail.current?.value) || (!password.current || !password.current.value)) return alert('Preencha todos os campos')
        setIsLoading(true);

        const user = await loginAsync({ username: mail.current.value, password: password.current.value })

        setIsLoading(false);
        if (user) {
            emitToaster('success', 'Sucesso')

            router.push('/users')
        }
    }

    async function signUp() {
        if (
            (!mail.current || !mail.current?.value)
            || (!password.current || !password.current.value)
            || (!name.current || !name.current.value)
        ) return alert('Preencha todos os campos')

        setIsLoading(true);
        // const user = await register({
        //     email: mail.current.value,
        //     password: password.current.value,
        //     name: name.current.value
        // })

        setIsLoading(false);
        if (true) {
            emitToaster('success', 'Sucesso')

            router.push('/users')
        }

    }

    return (
        <>
            {
                isLoading
                    ? <Loader />
                    : null
            }

            <div className={styles.pageContent}>
                <div className={styles.loginBox}>
                    <h1 className={styles.loginTitle}>
                        {isSignUp ? 'Cadastro' : 'Login'}
                    </h1>

                    <div className={styles.loginForm}>
                        {
                            isSignUp
                                ? <>
                                    <label>Nome</label>
                                    <input
                                        type="text"
                                        ref={name}
                                    />
                                </>
                                : null
                        }

                        <label>Nome de usuário</label>
                        <input
                            type="text"
                            ref={mail}
                        />

                        <label>Senha</label>
                        <input
                            type="password"
                            ref={password}
                            onKeyDown={e => {
                                if (e.key === 'Enter') isSignUp ? signUp() : signIn()
                            }}
                        />

                        <button
                            className={styles.signInBtn}
                            onClick={() => isSignUp ? signUp() : signIn()}
                        >
                            {isSignUp ? 'Cadastrar' : 'Entrar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}