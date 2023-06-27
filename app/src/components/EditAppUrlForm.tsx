import { TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import { AppURL } from "../../types/app-url.type";
import appUrlRepository from "../repositories/app-urls.repository";
import { ColorPicker } from "./Colorpicker";

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
      <div className="flex p-2 items-center bg-zinc-200 dark:bg-zinc-700 rounded-md">
        <input
          className="w-9/12 p-0 pl-1 pr-2 h-7 border-r rounded-none border-zinc-300 dark:border-zinc-600"
          type="text"
          placeholder="url"
          defaultValue={data.url}
          onChange={(ev) => onChange({ ...data, url: ev.target.value })}
        />

        <input
          className="w-3/12 h-7 rounded-none"
          type="text"
          placeholder="env"
          defaultValue={data.env}
          onChange={(ev) => onChange({ ...data, env: ev.target.value })}
          maxLength={5}
          minLength={3}
        />

        <div className="shrink-0 w-7 h-7 relative">
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
        <TrashIcon className="w-5 h-5 dark:stroke-zinc-500 stroke-zinc-400 hover:opacity-80" />
      </button>
    </div>
  );
};
