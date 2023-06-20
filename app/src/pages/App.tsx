import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { useNavigate } from "react-router-dom";
import {
  AppURL,
  CreateAppUrlForm,
  EditAppUrlForm,
} from "../components/UrlForm";
import appUrlRepository from "../repositories/app-urls.repository";
import { IApp } from "../repositories/app.repository";
import { debounce } from "../utils/debounce";

const createInitialAppUrl = (appId: string): AppURL => ({
  color: "#37D67A",
  appId,
  env: "",
  url: "",
  id: "",
});

export const App = () => {
  const app = useLoaderData() as IApp;
  const navigate = useNavigate();

  const [appUrls, setAppUrls] = useState<AppURL[]>();
  const [appUrl, setAppUrl] = useState<AppURL>(createInitialAppUrl(app.id));
  const [showForm, setShowForm] = useState(false);

  const validateAppUrl = (data: AppURL) => {
    return data.url && data.env;
  };

  const loadAppUrls = async () => {
    try {
      const data = await appUrlRepository.find(app.id);
      setAppUrls(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateNewAppUrl = async () => {
    if (!validateAppUrl(appUrl)) return;

    try {
      const app = await appUrlRepository.create(appUrl);
      await loadAppUrls();
      setAppUrl(createInitialAppUrl(app.id));
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onChange = debounce(async (app: AppURL) => {
    if (!validateAppUrl(app)) return;

    try {
      await appUrlRepository.update(app);
      await loadAppUrls();
    } catch (error) {
      console.log(error);
    }
  }, 100);

  useEffect(() => {
    loadAppUrls();
  }, []);

  return (
    <div className="h-full flex flex-col justify-between pb-6">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg">{app.name}</h2>
        </div>

        <div className="flex flex-col gap-2">
          {appUrls?.map((app) => {
            return (
              <EditAppUrlForm
                key={app.id}
                data={app}
                onChange={onChange}
                onDeleted={async () => await loadAppUrls()}
              />
            );
          })}

          {showForm && (
            <CreateAppUrlForm
              data={appUrl}
              onChange={(app) => setAppUrl(app)}
              onSubmit={handleCreateNewAppUrl}
            />
          )}
        </div>
      </div>

      <button
        onClick={() => setShowForm((state) => !state)}
        className={`h-9 rounded-md flex items-center justify-center text-gray-100 hover:opacity-90 ${
          showForm ? "bg-gray-500" : "bg-blue-500"
        }`}
      >
        {showForm ? "Cancel" : <PlusIcon className="w-4 h-4 stroke-2" />}
      </button>
    </div>
  );
};
