import { APIRoutes } from '@/common/ApiRoutes';
import { Constants } from '@/common/Constants';
import { buildQueryParams } from '@/common/Utils';
import { IPagination, IPaginationQuery } from '@/interfaces/IPagination';
import { ICreateUserDTO, IUpdateUserDTO, IUser } from '@/interfaces/IUser';
import { httpRequest } from '@/providers/CustomAxios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useAuthAccess } from './useAuthAccess';


export function useGetUsers(pagnationQuery?: IPaginationQuery, filterName?: string) {
    const auth = useAuthAccess();
    const token = auth?.accessToken ?? ''

    return useQuery<IPagination<IUser>>({
        queryKey: ['users', pagnationQuery, token, filterName],
        queryFn: async () => {
            let qs = pagnationQuery ? `?${buildQueryParams(pagnationQuery)}` : ''
            qs = filterName ? `${qs}${!!qs ? '&' : '?'}name=${filterName}` : qs
            const { data } = await httpRequest.get<IPagination<IUser>>(`${APIRoutes.users.getMany}${qs}`, { headers: { Authorization: `Bearer ${token}` } })
            return data
        },
        enabled: !!token,
        staleTime: Constants.defaultStaleTimeInMinutes,
    })
}

export function useGetUser(userId?: number) {
    const auth = useAuthAccess();
    const token = auth?.accessToken ?? ''

    return useQuery<IUser>({
        queryKey: ['user', userId],
        queryFn: async () => {
            const { data } = await httpRequest.get<IUser>(APIRoutes.users.get(userId!), { headers: { Authorization: `Bearer ${token}` } })
            return data
        },
        enabled: !!userId && !!token, // só executa se tiver ID
        staleTime: Constants.defaultStaleTimeInMinutes,
    })
}

export function useCreateUser() {
    const queryClient = useQueryClient()

    const auth = useAuthAccess();
    const token = auth?.accessToken ?? ''

    return useMutation<IUser, unknown, Array<ICreateUserDTO>>({
        mutationFn: async (user: Array<ICreateUserDTO>) => {
            const { data } = await httpRequest.post<Array<ICreateUserDTO>, AxiosResponse<IUser>>(APIRoutes.users.post, user, { headers: { Authorization: `Bearer ${token}` } })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}

export function useUpdateUser() {
    const queryClient = useQueryClient()

    const auth = useAuthAccess();
    const token = auth?.accessToken ?? ''

    return useMutation<IUser, unknown, IUpdateUserDTO>({
        mutationFn: async (user: IUpdateUserDTO) => {
            const { data } = await httpRequest.put<IUpdateUserDTO, AxiosResponse<IUser>>(APIRoutes.users.put, user, { headers: { Authorization: `Bearer ${token}` } })
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}

export function useDeleteUser() {
    const queryClient = useQueryClient()

    const auth = useAuthAccess();
    const token = auth?.accessToken ?? ''

    return useMutation<void, unknown, number>({
        mutationFn: async (id: number) => {
            await httpRequest.delete(APIRoutes.users.delete(id), { headers: { Authorization: `Bearer ${token}` } })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })
}