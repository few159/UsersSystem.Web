export interface IUser {
    id: number
    name: string
    email: string
    createdAt: Date
    updatedAt: Date
}

export interface ICreateUserDTO extends Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> { }

export interface IUpdateUserDTO extends Omit<Partial<IUser>, 'createdAt' | 'updatedAt'> {
    id: number
}