'use client'

import { useState } from 'react'
import styles from './CreateUserForm.module.scss'
import { useCreateUser } from '@/hooks/useUsersApi'
import { ICreateUserDTO } from '@/interfaces/IUser'
import { emitToaster } from '@/common/Utils'

interface IProps {
    onFinish?: () => void;
}
export default function CreateUsersForm({ onFinish }: IProps) {
    const [users, setUsers] = useState<Array<ICreateUserDTO>>([
        { name: '', email: '' }
    ])
    const { mutateAsync: createUserAsync } = useCreateUser();

    function handleChange(index: number, field: keyof ICreateUserDTO, value: string) {
        const updated = [...users]
        updated[index][field] = value
        setUsers(updated)
    }

    function handleAddUserField() {
        setUsers([...users, { name: '', email: '' }])
    }

    function handleRemoveUserField(index: number) {
        setUsers(users.filter((_, i) => i !== index))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        for (const user of users) {
            if (!user.name || !user.email) {
                alert('Todos os campos são obrigatórios')
                return
            }
        }

        await createUserAsync(users, {
            onSuccess: () => {
                emitToaster('success', 'Usuários criados com sucesso!')
                if (onFinish) onFinish()
            },
            onError: (err) => {
                emitToaster('error', 'Erro ao criar usuários!')
                console.error(err)
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2>Adicionar Usuários</h2>

            {
                users.map((user, index) => (
                    <div key={index} className={styles.userRow}>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={user.name}
                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={user.email}
                            onChange={(e) => handleChange(index, 'email', e.target.value)}
                        />
                        {users.length > 1 && (
                            <button type="button" onClick={() => handleRemoveUserField(index)}>
                                Remover
                            </button>
                        )}
                    </div>
                ))
            }

            <div className={styles.buttons}>
                <button type="button" onClick={handleAddUserField}>+ Adicionar</button>
                <button type="submit">Salvar</button>
            </div>
        </form>
    )
}
