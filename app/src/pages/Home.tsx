import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { AppItem } from "../components/AppItem";
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
    <div>
      <div>
        <p className="font-thin uppercase dark:text-zinc-400 text-zinc-500 text-xs">
          Meus apps
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 justify-between ">
        <div className="flex flex-col gap-2 mt-4 overflow-y-scroll max-h-60">
          {apps.map((app) => (
            <AppItem key={app.id} app={app} loadApps={loadApps} />
          ))}
        </div>
      </div>

      <div
        className={`flex flex-row items-center rounded-lg fixed bottom-6 left-6 right-6 ${
          showNewAppInput
            ? "bg-zinc-200 dark:bg-zinc-700 h-11"
            : "flex-row-reverse"
        }`}
      >
        <input
          type="text"
          placeholder="Name"
          className="w-full px-3"
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
  );
};
