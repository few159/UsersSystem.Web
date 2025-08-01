import { useMutation, useQueryClient } from '@tanstack/react-query'
import { APIRoutes } from '@/common/ApiRoutes'
import { ILogin, ILoginResponse } from '@/interfaces/ILogin'
import { httpRequest } from '@/providers/CustomAxios'
import { AxiosResponse } from 'axios'
import { Constants } from '@/common/Constants'
import { useRouter } from 'next/navigation'

const LOGIN_KEY = [Constants.authGlobalKey] // chave global

export function useLogin() {
    const queryClient = useQueryClient()

    return useMutation<ILoginResponse, unknown, ILogin>({
        mutationFn: async (access: ILogin) => {
            const { data } = await httpRequest.post<ILogin, AxiosResponse<ILoginResponse>>(
                APIRoutes.access.login,
                access
            )
            return data
        },
        onSuccess: (data) => {
            // Guarda os dados do login globalmente
            queryClient.setQueryData(LOGIN_KEY, data)
        },
    })
}