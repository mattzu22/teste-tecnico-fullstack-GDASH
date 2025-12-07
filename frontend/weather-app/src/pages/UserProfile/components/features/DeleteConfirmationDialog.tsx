import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
}

export const DeleteConfirmationDialog = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  title = 'Confirmar Exclusão',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}: DeleteConfirmationDialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <Card className="w-[350px] border-slate-700 bg-slate-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-slate-300">{message}</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onCancel} className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 text-white hover:bg-red-700">
            {confirmText}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
