import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthAccess } from '@/hooks/useAuthAccess';

// Mock do roteamento do Next.js
jest.mock('next/navigation', () => ({ useRouter: jest.fn() }));
const useRouterMock = require('next/navigation').useRouter;
// Mock do httpRequest para evitar chamadas reais
jest.mock('@/providers/CustomAxios', () => ({
  httpRequest: { post: jest.fn(), get: jest.fn() /* ... outros métodos se necessário */ }
}));

describe('Hooks de autenticação', () => {
  // Helper para criar wrapper com QueryClient isolado por teste
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('useAuthAccess - deve redirecionar para /login se token expirou ou não existe', () => {
    // Prepara QueryClient com usuário expirado ou sem user
    const queryClient = new QueryClient();
    // Não definimos nenhum cache para simular ausência de usuário logado
    const pushSpy = jest.fn();
    useRouterMock.mockReturnValue({ push: pushSpy });  // fake router

    const { result } = renderHook(() => useAuthAccess(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    // Como não havia user, esperamos que o hook tenha tentado redirecionar
    expect(pushSpy).toHaveBeenCalledWith('/login');
    expect(result.current).toBeUndefined();  // não retorna usuário
  });

  it('useAuthAccess - deve retornar dados do usuário se token válido no cache', () => {
    // Simula dados de login armazenados (user com token não expirado)
    const fakeUser = { accessToken: 'token123', expiresIn: new Date(Date.now() + 60000).toISOString() };
    const queryClient = new QueryClient();
    queryClient.setQueryData(['authAccess'], fakeUser);
    const pushSpy = jest.fn();
    useRouterMock.mockReturnValue({ push: pushSpy });

    const { result } = renderHook(() => useAuthAccess(), {
      wrapper: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    });

    expect(pushSpy).not.toHaveBeenCalled();             // não deve redirecionar
    expect(result.current).toEqual(fakeUser);           // retorna o objeto do usuário
  });
});
