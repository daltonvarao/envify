import { PlusIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppURL } from "../../types/app-url.type";
import {
  CreateAppURL,
  CreateAppUrlFormModal,
} from "../components/CreateAppUrl";
import { EditAppUrlForm } from "../components/EditAppUrlForm";
import appUrlRepository from "../repositories/app-urls.repository";
import appRepository, { IApp } from "../repositories/app.repository";
import { debounce } from "../utils/debounce";

export const App = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState<IApp>();
  const [appUrls, setAppUrls] = useState<AppURL[]>();
  const [showCreateAppUrlModal, setShowCreateAppUrlModal] = useState(false);

  const validateAppUrl = (data: CreateAppURL) => {
    return data.url && data.env;
  };

  const loadAppUrls = async () => {
    try {
      const data = await appUrlRepository.find(app!.id);
      setAppUrls(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadApp = useCallback(async () => {
    if (!id) {
      navigate("/");
      return;
    }

    try {
      const data = await appRepository.findOne(id);
      setApp(data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const handleCreateNewAppUrl = async (appUrl: CreateAppURL) => {
    if (!validateAppUrl(appUrl)) return;

    try {
      await appUrlRepository.create({
        color: appUrl.color,
        env: appUrl.env,
        url: appUrl.url,
        appId: id!,
      });
      await loadAppUrls();
      setShowCreateAppUrlModal(false);
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
    loadApp();
  }, []);

  useEffect(() => {
    if (app?.id) {
      loadAppUrls();
    }
  }, [app]);

  if (!app) return null;

  return (
    <div className="flex flex-col justify-between">
      <CreateAppUrlFormModal
        show={showCreateAppUrlModal}
        onClose={() => setShowCreateAppUrlModal(false)}
        onCreate={(app) => handleCreateNewAppUrl(app)}
      />

      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{app.name}</h2>
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
        </div>
      </div>

      <button
        onClick={() => setShowCreateAppUrlModal((state) => !state)}
        className={`h-9 rounded-md flex items-center justify-center text-zinc-50 hover:opacity-90 fixed bottom-6 left-6 right-6 ${
          showCreateAppUrlModal ? "bg-zinc-500" : "bg-blue-500"
        }`}
      >
        {showCreateAppUrlModal ? (
          "Cancel"
        ) : (
          <PlusIcon className="w-4 h-4 stroke-2" />
        )}
      </button>
    </div>
  );
};
