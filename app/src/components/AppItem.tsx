import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";
import appRepository, { IApp } from "../repositories/app.repository";
import { debounce } from "../utils/debounce";
import { Modal } from "./Modal";

type AppItemProps = {
  app: IApp;
  loadApps: () => Promise<void>;
};

export const AppItem: React.FC<AppItemProps> = ({ app, loadApps }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteApp = async (id: string) => {
    if (!confirm("deseja remover este item?")) return;

    try {
      await appRepository.delete(id);
      await loadApps();
    } catch (err) {
      console.error(err);
    }
  };

  const updateApp = debounce(async (app: IApp) => {
    try {
      await appRepository.update(app);
      await loadApps();
    } catch (error) {
      console.error(error);
    }
  }, 200);

  return (
    <>
      <Modal
        title="Editar app"
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
      >
        <div className="my-2">
          <input
            type="text"
            className="input w-full dark:bg-zinc-600"
            placeholder="Nome"
            defaultValue={app.name}
            onChange={(ev) => updateApp({ ...app, name: ev.target.value })}
          />
        </div>
      </Modal>
      <div
        className="rounded-md bg-zinc-200 dark:bg-zinc-700 flex justify-between items-center cursor-pointer"
        key={app.id}
      >
        <Link to={`/apps/${app.id}`} className="flex-1 p-3">
          <p className="text-zinc-600 dark:text-zinc-300 font-semibold">
            {app.name}
          </p>
        </Link>

        <div className="flex gap-2 px-3">
          <button className="flex items-center justify-center relative hover:opacity-80">
            <PencilSquareIcon
              className="w-5 h-5 stroke-blue-400"
              onClick={() => setShowEditModal(true)}
            />
          </button>

          <button
            className="flex items-center justify-center relative hover:opacity-80"
            onClick={() => deleteApp(app.id)}
          >
            <TrashIcon className="w-5 h-5 stroke-red-400" />
          </button>
        </div>
      </div>
    </>
  );
};
