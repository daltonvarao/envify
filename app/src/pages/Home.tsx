import {
  CheckIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import appRepository, { IApp } from "../repositories/app.repository";
import { debounce } from "../utils/debounce";

export const Home = () => {
  const [showNewAppInput, setShowNewInputApp] = useState(false);
  const [name, setName] = useState("");
  const [apps, setApps] = useState<IApp[]>([]);
  const [editApp, setEditApp] = useState(false);

  const handleToggleNewApp = () => {
    setShowNewInputApp((state) => !state);
  };

  const handleCreateNewApp = async () => {
    if (!name) return;

    console.log(name);

    try {
      await appRepository.create(name);
      setName("");
      setShowNewInputApp(false);
      await loadApps();
    } catch (error) {}
  };

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

  const loadApps = async () => {
    const apps = await appRepository.find();
    setApps(apps);
  };

  useEffect(() => {
    loadApps();
  }, []);

  return (
    <div className="flex pb-6 h-full flex-col">
      <div>
        <p className="font-thin uppercase text-neutral-400 text-xs">
          Meus apps
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 justify-between ">
        <div className="flex flex-col gap-2 mt-4 divide-zinc-600 overflow-y-scroll max-h-52">
          {apps.map((app) => (
            <>
              <Modal show={editApp} onClose={() => setEditApp(false)}>
                <div className="my-2">
                  <input
                    type="text"
                    className="input w-full bg-zinc-600"
                    placeholder="Nome"
                    defaultValue={app.name}
                    onChange={(ev) =>
                      updateApp({ ...app, name: ev.target.value })
                    }
                  />
                </div>
              </Modal>
              <div
                className="rounded-md bg-zinc-700 flex justify-between px-2 items-center cursor-pointer"
                key={app.id}
              >
                <Link to={`/apps/${app.id}`} className="py-3 px-1 flex-1">
                  <p className="text-gray-300 font-semibold">{app.name}</p>
                </Link>

                <div className="group/options flex flex-row-reverse gap-1">
                  <button className="p-2 rounded-full flex items-center justify-center relative group-hover/options:rotate-90 hover:bg-zinc-600 duration-200">
                    <EllipsisHorizontalIcon className="w-5 h-5 " />
                  </button>

                  <div className="hidden group-hover/options:flex gap-2 pl-4">
                    <button className="flex items-center justify-center relative hover:opacity-80">
                      <PencilIcon
                        className="w-4 h-4 stroke-blue-400"
                        onClick={() => setEditApp(true)}
                      />
                    </button>
                    <button
                      onClick={() => deleteApp(app.id)}
                      className="flex items-center justify-center relative hover:opacity-80"
                    >
                      <TrashIcon className="w-4 h-4 stroke-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ))}
        </div>

        <div
          className={`flex flex-row items-center rounded-lg h-11 ${
            showNewAppInput ? "bg-zinc-700" : "flex-row-reverse"
          }`}
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full pl-3"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            hidden={!showNewAppInput}
            onKeyDown={async (ev) => {
              if (ev.key === "Enter") {
                await handleCreateNewApp();
              }
            }}
          />

          <button
            onClick={!showNewAppInput ? handleToggleNewApp : handleCreateNewApp}
            disabled={showNewAppInput && !name}
            className={`${showNewAppInput ? "w-10 mr-1" : "w-full"} primary`}
          >
            {showNewAppInput ? (
              <CheckIcon className="w-4 h-4 stroke-2" />
            ) : (
              <PlusIcon className="w-4 h-4 stroke-2" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

type ModalProps = {
  show: boolean;
  onClose: () => void;
};

const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({
  show,
  onClose,
  children,
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-zinc-700 rounded-md p-4 w-3/4 flex flex-col gap-2">
        <div>
          <h1 className="text-lg text-center">Editar app</h1>
        </div>
        {children}
        <div className="w-full flex gap-2">
          <button onClick={onClose} className="w-full h-9 rounded bg-gray-500">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
