import { cookiesToObjects, emitToaster, buildQueryParams } from '@/common/Utils';
import { toast } from 'react-toastify';

// Mock do toast do react-toastify para verificar chamadas
jest.mock('react-toastify', () => ({
    toast: { success: jest.fn(), error: jest.fn(), warn: jest.fn() }
}));

describe('Funções utilitárias - Utils', () => {
    describe('emitToaster', () => {
        it('deve chamar toast.success com mensagem e configurações padrão', () => {
            emitToaster('success', 'Operação realizada com sucesso!');
            expect(toast.success).toHaveBeenCalledWith(
                'Operação realizada com sucesso!',
                expect.objectContaining({ position: 'bottom-center', autoClose: 5000 })
            );
        });
        it('deve chamar toast.error e usar tempo de fechamento customizado', () => {
            emitToaster('error', 'Ocorreu um erro', 10000);
            expect(toast.error).toHaveBeenCalledWith(
                'Ocorreu um erro',
                expect.objectContaining({ autoClose: 10000 })
            );
        });
    });

    describe('buildQueryParams', () => {
        it('deve montar query string ignorando valores vazios ou indefinidos', () => {
            const params = { page: 1, search: '', filter: undefined, sort: 'name' };
            // Resultado esperado: "page=1&sort=name" (campos vazios omitidos)
            const query = buildQueryParams(params);
            expect(query).toBe('page=1&sort=name');
        });
        it('deve incluir parâmetros aninhados para objetos', () => {
            const params = { filter: { role: 'admin', active: true }, q: 'test' };
            const query = buildQueryParams(params);
            // order dos params pode variar, então verificamos que substrings essenciais estão presentes:
            expect(decodeURIComponent(query)).toContain('filter[role]=admin');
            expect(query).toContain('q=test');
        });
    });
});
