import { Constants } from "@/common/Constants"
import { ILoginResponse } from "@/interfaces/ILogin"
import { useQueryClient } from "@tanstack/react-query"

export function useAuthAccess() {
    const queryClient = useQueryClient()

    const user = queryClient.getQueryData<ILoginResponse>([Constants.authGlobalKey])
    const needsLogin = !user || new Date(user.expiresIn) < new Date()
    if (needsLogin) return;

    return user
}