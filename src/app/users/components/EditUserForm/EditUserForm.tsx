'use client'

import { useState } from 'react'
import { IUser } from '@/interfaces/IUser'
import { useUpdateUser } from '@/hooks/useUsersApi'
import styles from './EditUserForm.module.scss'
import { emitToaster } from '@/common/Utils'

interface EditUserFormProps {
  user: IUser
  onFinish?: () => void
}

export default function EditUserForm({ user, onFinish }: EditUserFormProps) {
  const [form, setForm] = useState<IUser>(user)
  const { mutateAsync: updateUserAsync } = useUpdateUser();

  function handleChange(field: keyof IUser, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.name || !form.email) {
      alert('Todos os campos são obrigatórios')
      return
    }

    await updateUserAsync(form, {
      onSuccess: () => {
        emitToaster('success', 'Usuário atualizado com sucesso')
        if (onFinish) onFinish()
      },
      onError: () => {
        emitToaster('error', 'Erro ao atualizar usuário')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Editar Usuário</h2>

      <div className={styles.userRow}>
        <input
          type="text"
          placeholder="Nome"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />
      </div>

      <div className={styles.buttons}>
        <button type="submit">Salvar Alterações</button>
      </div>
    </form>
  )
}
