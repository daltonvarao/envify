import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import appUrlRepository from "../repositories/app-urls.repository";
import { ColorPicker } from "./Colorpicker";

export type AppURL = {
  id: string;
  appId: string;
  url: string;
  env: string;
  color: string;
};

type CreateAppUrlFormProps = {
  data: AppURL;
  onChange: (app: AppURL) => void;
  onSubmit: () => void;
};

function validateUrl(url: string) {
  return url.match(/[http|https]:\/\/[a-zA-Z0-9w]/);
}

export const CreateAppUrlForm: React.FC<CreateAppUrlFormProps> = ({
  data,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="flex gap-2 items-center">
      <input
        className="w-3/5"
        type="text"
        placeholder="url"
        value={data.url}
        onChange={(ev) => onChange({ ...data, url: ev.target.value })}
      />

      <div className="h-9 w-24 rounded-md bg-zinc-700 relative">
        <input
          className="absolute w-full"
          type="text"
          placeholder="env"
          value={data.env}
          onChange={(ev) => onChange({ ...data, env: ev.target.value })}
          maxLength={5}
          minLength={3}
        />
        <div className="absolute right-1.5 top-1.5">
          <ColorPicker
            value={data.color}
            onChange={(color) => onChange({ ...data, color })}
          />
        </div>
      </div>

      <button
        className="primary h-9 w-10 p-2"
        disabled={!data.env || !validateUrl(data.url)}
      >
        <CheckIcon
          className="w-5 h-5 stroke-2"
          onClick={() => {
            if (onSubmit) {
              onSubmit();
            }
          }}
        />
      </button>
    </div>
  );
};

type EditAppUrlFormProps = {
  data: AppURL;
  onChange: (app: AppURL) => void;
  onDeleted: () => void;
};

export const EditAppUrlForm: React.FC<EditAppUrlFormProps> = ({
  data,
  onChange,
  onDeleted,
}) => {
  const deleteAppUrl = async () => {
    if (!confirm("deseja remove este item?")) return;

    try {
      await appUrlRepository.delete(data.id);
      onDeleted();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        className="w-3/5"
        type="text"
        placeholder="url"
        defaultValue={data.url}
        onChange={(ev) => onChange({ ...data, url: ev.target.value })}
      />

      <div className="h-9 w-24 rounded-md bg-zinc-700 relative">
        <input
          className="absolute w-full shrink-0"
          type="text"
          placeholder="env"
          defaultValue={data.env}
          onChange={(ev) => onChange({ ...data, env: ev.target.value })}
          maxLength={5}
          minLength={3}
        />
        <div className="absolute right-1.5 top-1.5">
          <ColorPicker
            value={data.color}
            onChange={(color) => onChange({ ...data, color })}
          />
        </div>
      </div>

      <button
        onClick={deleteAppUrl}
        className="flex h-9 w-11 items-center justify-center"
      >
        <TrashIcon className="w-5 h-5 stroke-zinc-300 stroke-1 hover:opacity-80" />
      </button>
    </div>
  );
};
