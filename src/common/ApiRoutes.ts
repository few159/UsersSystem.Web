const apiBaseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

export const APIRoutes = {
    users: {
        getMany: `${apiBaseUrl}/users`,
        get: (id: string | number) => `${apiBaseUrl}/users/${id}`,
        post: `${apiBaseUrl}/users`,
        put: `${apiBaseUrl}/users`,
        delete: (id: string | number) => `${apiBaseUrl}/users/${id}`
    },
    access: {
        login: `${apiBaseUrl}/auth/login`
    }
} 