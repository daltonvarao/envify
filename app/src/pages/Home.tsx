import {
  CheckIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import appRepository, { IApp } from "../repositories/app.repository";

export const Home = () => {
  const [showNewAppInput, setShowNewInputApp] = useState(false);
  const [name, setName] = useState("");
  const [apps, setApps] = useState<IApp[]>([]);

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

      <div className="flex flex-1 flex-col gap-3 justify-between">
        <div className="flex flex-col gap-2 mt-4 divide-zinc-600 overflow-y-scroll max-h-52">
          {apps.map((app) => (
            <Link
              className="p-3 rounded-md bg-zinc-700 flex justify-between items-center hover:opacity-80 cursor-pointer"
              key={app.id}
              to={`/apps/${app.id}`}
            >
              <div>
                <p className="text-gray-300 font-semibold">{app.name}</p>
              </div>
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
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
