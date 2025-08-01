import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UsersTable from '@/app/users/components/UsersTable/UsersTable';
import LoginPageComponent from '@/app/login/components/Login/Login';
import { useLogin } from '@/hooks/useAccessApi';
import { emitToaster } from '@/common/Utils';
import { useCreateUser } from '@/hooks/useUsersApi';
import CreateUsersForm from '@/app/users/components/CreateUserForm/CreateUserForm';

const dummyUsers = [
    { id: 1, name: 'Alice', email: 'alice@example.com', createdAt: new Date(), updatedAt: new Date() },
    { id: 2, name: 'Bob', email: 'bob@example.com', createdAt: new Date(), updatedAt: new Date() }
];

describe('<UsersTable />', () => {
    it('deve renderizar mensagem de vazio quando não há usuários', () => {
        render(<UsersTable users={[]} handleEdit={jest.fn()} handleDelete={jest.fn()} />);
        const emptyRow = screen.getByText(/Nenhum usuário encontrado/i);
        expect(emptyRow).toBeInTheDocument();
        // Verifica se está ocupando todas colunas (colSpan = 4, conforme esperado no JSX)
        expect(emptyRow.closest('td')?.getAttribute('colspan')).toBe("4");
    });

    it('deve listar usuários e acionar callbacks de editar/deletar ao clicar nos botões', async () => {
        const onEdit = jest.fn();
        const onDelete = jest.fn();
        render(<UsersTable users={dummyUsers} handleEdit={onEdit} handleDelete={onDelete} />);

        // Verifica se cada usuário aparece na tabela
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('alice@example.com')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();

        // Há dois usuários, cada um com dois botões (editar, deletar) -> total 4 botões
        const allButtons = screen.getAllByRole('button');
        expect(allButtons).toHaveLength(4);

        // Clica no botão "Editar" do primeiro usuário (Alice)
        await userEvent.click(allButtons[0]);
        expect(onEdit).toHaveBeenCalledWith(1);
        // Clica no botão "Deletar" do primeiro usuário
        await userEvent.click(allButtons[1]);
        expect(onDelete).toHaveBeenCalledWith(1);
    });
});


// Configura os mocks dos hooks e funções
jest.mock('@/hooks/useAccessApi');
jest.mock('@/common/Utils');
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
const pushSpy = require('next/navigation').useRouter().push;

describe('<LoginPageComponent />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve alertar se campos obrigatórios estiverem vazios', async () => {
        window.alert = jest.fn();
        // useLogin retorna um mutateAsync fake que não será chamado neste teste
        (useLogin as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
        render(<LoginPageComponent isSignUp={false} />);

        // Não preencher os campos e clicar em "Entrar"
        const entrarBtn = screen.getByRole('button', { name: /Entrar/i });
        await userEvent.click(entrarBtn);
        expect(window.alert).toHaveBeenCalledWith('Preencha todos os campos');
        // Nenhum login API chamado
        expect(useLogin().mutateAsync).not.toHaveBeenCalled();
    });
});


(useCreateUser as jest.Mock).mockReturnValue({
    mutateAsync: jest.fn().mockImplementation((users, options) => {
        options.onSuccess?.();
        return Promise.resolve();
    })
});


jest.mock('@/hooks/useUsersApi');
jest.mock('@/common/Utils');

describe('<CreateUsersForm />', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve iniciar com um conjunto de campos Nome e Email', () => {
        (useCreateUser as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
        render(<CreateUsersForm />);
        const nameInputs = screen.getAllByPlaceholderText('Nome');
        const emailInputs = screen.getAllByPlaceholderText('Email');
        expect(nameInputs).toHaveLength(1);
        expect(emailInputs).toHaveLength(1);
        // Campos devem estar vazios inicialmente
        expect((nameInputs[0] as HTMLInputElement).value).toBe('');
        expect((emailInputs[0] as HTMLInputElement).value).toBe('');
    });

    it('deve adicionar e remover campos de usuário dinamicamente', async () => {
        (useCreateUser as jest.Mock).mockReturnValue({ mutateAsync: jest.fn() });
        render(<CreateUsersForm />);
        const addBtn = screen.getByRole('button', { name: /\+ Adicionar/i });
        // Adiciona um novo par de campos
        await userEvent.click(addBtn);
        expect(screen.getAllByPlaceholderText('Nome')).toHaveLength(2);
        // Remove o segundo campo
        const removeBtns = screen.getAllByRole('button', { name: /Remover/i });
        await userEvent.click(removeBtns[0]);  // remove o primeiro grupo (index 0)
        expect(screen.getAllByPlaceholderText('Nome')).toHaveLength(1);
    });

    it('deve alertar se tentar salvar com campos vazios', async () => {
        const mutateSpy = jest.fn();
        (useCreateUser as jest.Mock).mockReturnValue({ mutateAsync: mutateSpy });
        window.alert = jest.fn();
        render(<CreateUsersForm />);
        // Não preencher nada e tentar salvar
        const saveBtn = screen.getByRole('button', { name: /Salvar/i });
        await userEvent.click(saveBtn);
        expect(window.alert).toHaveBeenCalledWith('Todos os campos são obrigatórios');
        expect(mutateSpy).not.toHaveBeenCalled();
    });

    it('deve chamar createUser e onFinish ao salvar com sucesso', async () => {
        // Simula mutação com sucesso imediato (chama onSuccess e resolve)
        const mutateSpy = jest.fn().mockImplementation((_users, options) => {
            options?.onSuccess?.();
            return Promise.resolve();
        });
        (useCreateUser as jest.Mock).mockReturnValue({ mutateAsync: mutateSpy });
        const finishSpy = jest.fn();
        (emitToaster as jest.Mock).mockImplementation(() => { });

        render(<CreateUsersForm onFinish={finishSpy} />);
        // Preenche campos obrigatórios
        await userEvent.type(screen.getByPlaceholderText('Nome'), 'Charlie');
        await userEvent.type(screen.getByPlaceholderText('Email'), 'charlie@teste.com');
        await userEvent.click(screen.getByRole('button', { name: /Salvar/i }));

        // Deve ter chamado mutateAsync com o array de usuários preenchido
        expect(mutateSpy).toHaveBeenCalledWith(
            [{ name: 'Charlie', email: 'charlie@teste.com' }],
            expect.objectContaining({ onSuccess: expect.any(Function) })
        );
        // onSuccess simulado deve ter disparado emitToaster e onFinish
        expect(emitToaster).toHaveBeenCalledWith('success', expect.stringMatching(/sucesso/i));
        expect(finishSpy).toHaveBeenCalled();
    });
});
