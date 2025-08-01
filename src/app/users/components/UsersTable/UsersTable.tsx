import { IUser } from '@/interfaces/IUser';
import { FaTrash, FaEdit } from "react-icons/fa"

import styles from './UsersTable.module.scss'

interface IProps {
    users: Array<IUser>
    handleDelete: (id: number) => void
    handleEdit: (id: number) => void
}
export default function UsersTable({ users, handleDelete, handleEdit }: IProps) {
    return <table className={styles.table}>
        <thead>
            <tr>
                <th>Nome</th>
                <th>Email</th>
                <th className={styles.iconCol}>Editar</th>
                <th className={styles.iconCol}>Deletar</th>
            </tr>
        </thead>
        <tbody>
            {users.length > 0 ? (
                users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td className={styles.iconCell}>
                            <button
                                className={styles.iconButton}
                                onClick={() => handleEdit(user.id)}
                            >
                                <FaEdit />
                            </button>
                        </td>
                        <td className={styles.iconCell}>
                            <button
                                className={styles.deleteButton}
                                onClick={() => handleDelete(user.id)}
                            >
                                <FaTrash />
                            </button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={4} className={styles.empty}>
                        Nenhum usuário encontrado
                    </td>
                </tr>
            )}
        </tbody>
    </table>;
}