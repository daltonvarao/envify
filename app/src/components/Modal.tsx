export type ModalProps = {
  show: boolean;
  title: string;
  onClose: () => void;
  onSubmit?: () => void;
};

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  show,
  title,
  onClose,
  onSubmit,
  children,
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 flex items-center justify-center z-40 shadow">
      <div className="dark:bg-zinc-800 bg-zinc-50 rounded-md p-4 w-5/6 flex flex-col gap-4">
        <div>
          <h1 className="text-base font-semibold text-center">{title}</h1>
        </div>
        <div>{children}</div>
        <div className="w-full flex gap-2">
          <button onClick={onClose} className="w-full h-9 rounded bg-zinc-500">
            Fechar
          </button>

          {onSubmit && (
            <button
              onClick={onSubmit}
              className="w-full h-9 rounded bg-blue-500"
            >
              Salvar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
