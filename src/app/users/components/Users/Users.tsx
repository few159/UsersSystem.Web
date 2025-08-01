'use client'

import { useEffect, useState } from "react"
import UsersTable from "../UsersTable/UsersTable"
import SimplePagination from "@/components/SimplePagination/SimplePagination"
import styles from './Users.module.scss'
import { useDeleteUser, useGetUsers } from "@/hooks/useUsersApi"
import Modal from "@/components/Modal/Modal"
import CreateUsersForm from "../CreateUserForm/CreateUserForm"
import EditUserForm from "../EditUserForm/EditUserForm"
import { IUser } from "@/interfaces/IUser"
import { Constants } from "@/common/Constants"
import { emitToaster } from "@/common/Utils"

export default function UsersPageComponent() {
    const [searchText, setSearchText] = useState("")
    const [filter, setFilter] = useState("")
    const [isAddUsersModalOpen, setIsAddUsersModalOpen] = useState(false)
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false)
    const [userToUpdate, setUserToUpdate] = useState<IUser | null>(null)
    const [page, setPage] = useState(1)
    const pageSize = Constants.defaultPageSize

    const { data: users, isLoading } = useGetUsers({ page: page, pageSize: pageSize, order: { flow: 'asc', column: 'id' } }, filter);
    const { mutateAsync: deleteMutateAsync } = useDeleteUser()

    const filteredUsers = !isLoading && users?.data.filter(user =>
        user.name.toLowerCase().includes(filter.toLowerCase())
    ) || []

    function handleFilter() {
        setFilter(searchText)
        setPage(1) // Resetar para a primeira página ao aplicar filtro
    }

    async function handleDelete(id: number) {
        const confirm = window.confirm("Deseja realmente deletar este usuário?")
        if (confirm) await deleteMutateAsync(id, {
            onSuccess: () => {
                emitToaster('success', 'Usuário deletado com sucesso!')
            },
            onError: (error) => {
                emitToaster('error', 'Erro ao deletar usuário!')
            }
        })
    }

    function handleEditUser(id: number): void {
        setIsEditUserModalOpen(true)
        setUserToUpdate(users?.data.find(u => u.id == id) ?? null)
    }

    function handleCreateUser() {
        setIsAddUsersModalOpen(true)
    }

    function handlePrevPage() {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    function handleNextPage() {
        const maxPage = Math.ceil((users?.total ?? 0) / pageSize)
        if (page < maxPage) {
            setPage(page + 1)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.toolbar}>
                    <div className={styles.filterGroup}>
                        <input
                            type="text"
                            placeholder="Filtrar por nome"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className={styles.input}
                        />
                        <button onClick={handleFilter} className={styles.filterButton}>
                            Filtrar
                        </button>
                    </div>

                    <button
                        onClick={handleCreateUser}
                        className={styles.createButton}
                    >
                        Criar Usuário
                    </button>
                </div>

                <UsersTable
                    users={filteredUsers}
                    handleDelete={handleDelete}
                    handleEdit={handleEditUser}
                />

                {
                    users && users.total > users.pageSize
                        ? <SimplePagination
                            currentPage={page}
                            prevBtnDisabled={!!users && page === 1}
                            nextBtnDisabled={!!users && page >= Math.ceil(users.total / pageSize)}
                            handleNextPage={handleNextPage}
                            handlePrevPage={handlePrevPage}
                        />
                        : null
                }
            </div>

            {
                isAddUsersModalOpen
                    ? <Modal onClose={() => setIsAddUsersModalOpen(false)}>
                        <CreateUsersForm
                            onFinish={() => setIsAddUsersModalOpen(false)}
                        />
                    </Modal>
                    : null
            }

            {
                isEditUserModalOpen && !!userToUpdate
                    ? <Modal onClose={() => setIsEditUserModalOpen(false)}>
                        <EditUserForm
                            onFinish={() => setIsEditUserModalOpen(false)}
                            user={userToUpdate}
                        />
                    </Modal>
                    : null
            }
        </>
    )
}
