import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormProfile } from './components/FormProfile';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/auth';
import type { UseAuthProps, DecodedUser } from '@/interfaces/Auth';
import type { User } from '@/interfaces/User';
import { deleteUser, listUsers } from '@/service/userService';
import { toast } from 'sonner';
import { DeleteConfirmationDialog } from './components/features/DeleteConfirmationDialog';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth() as UseAuthProps;

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  async function handleDeleteProfile() {
    setIsDeleteDialogOpen(true);
  }

  async function onConfirmDelete() {
    setIsDeleteDialogOpen(false);
    if (!user) {
      toast.error('Usuário não autenticado.');
      return;
    }
    try {
      const response = await deleteUser(user.sub);
      if (response && response.status === 200) {
        toast.success('Conta deletada');
        logout();
        navigate('/auth/signin');
      }
    } catch (error: Error | any) {
      toast.error('Falha ao deletar usuário.', error.message);
      console.error('Falha ao deletar usuário:', error.message);
    }
  }

  function onCancelDelete() {
    setIsDeleteDialogOpen(false);
  }

  async function handleListUsers() {
    setShowUsers(!showUsers);

    if (showUsers || users.length > 0) {
      setShowUsers(false);
      setUsers([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await listUsers();

      if (response && response.users) {
        setUsers(response.users);
      }
    } catch (error) {
      toast.error('Falha ao buscar usuários.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#101622] pb-10">
      <div className="flex items-center p-4">
        <button
          className="flex size-12 shrink-0 items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-white" size={24} />
        </button>
        <h2 className="flex-1 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-white">
          Profile
        </h2>
        <div className="flex size-12 shrink-0 items-center"></div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 pt-0 w-[600px] max-w-full m-auto">
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-col items-center gap-4 py-4">
            <div className="relative">
              <div
                className="aspect-square w-32 rounded-full bg-cover bg-center bg-no-repeat border-2 border-[white]"
                style={{
                  backgroundImage:
                    'url("https://i.pinimg.com/736x/ac/bc/f6/acbcf679676b96291ee935dcbda8e2ae.jpg")',
                }}
              />
              <button className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#101622] bg-[#135bec] text-white">
                <Edit size={16} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-white">
                {user?.name}
              </p>
              <p className="text-base font-normal leading-normal text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>

          <FormProfile />

          <div className="mt-4 flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={handleDeleteProfile}
              className="flex w-full items-center justify-center rounded-lg border border-red-500/50 bg-transparent px-2 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
              Deletar
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-4">
          {user?.roles?.includes('admin') && (
            <Button
              onClick={handleListUsers}
              className="flex h-14 w-full items-center justify-center rounded-xl bg-[#232f48] px-4 py-2 text-base font-semibold text-white transition-colors hover:bg-[#303e5c]"
            >
              {showUsers ? 'Ocultar Usuários' : 'Listar todos os usuários'}
            </Button>
          )}
        </div>

        {showUsers && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Todos os Usuários
            </h3>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full rounded-lg bg-gray-700" />
                <Skeleton className="h-16 w-full rounded-lg bg-gray-700" />
                <Skeleton className="h-16 w-full rounded-lg bg-gray-700" />
              </div>
            ) : (
              <ul className="space-y-4">
                {users.map((user) => (
                  <li
                    key={user.email}
                    className="flex items-center justify-between rounded-lg bg-[#232f48] p-4"
                  >
                    <div className="flex justify-center align-center">
                      <img
                        className="w-[40px] h-[40px] object-cover rounded-full mr-4"
                        src="https://i.pinimg.com/736x/ac/bc/f6/acbcf679676b96291ee935dcbda8e2ae.jpg"
                        alt="Imagem do usuário"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {user.name}
                        </span>
                        <span className="text-sm text-gray-400">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onConfirm={onConfirmDelete}
        onCancel={onCancelDelete}
        message="Esta ação é irreversível. Seus dados serão permanentemente removidos."
        title="Confirmar Exclusão de Perfil"
        confirmText="Sim, Deletar"
        cancelText="Não, Cancelar"
      />
    </div>
  );
}
