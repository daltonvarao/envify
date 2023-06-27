import { useState } from "react";
import { ColorPicker } from "./Colorpicker";
import { Modal, ModalProps } from "./Modal";

export type CreateAppURL = {
  url: string;
  env: string;
  color: string;
};

type CreateAppUrlFormProps = Omit<ModalProps, "title" | "onSubmit"> & {
  onCreate: (appUrl: CreateAppURL) => void;
};

export const CreateAppUrlFormModal: React.FC<CreateAppUrlFormProps> = ({
  show,
  onClose,
  onCreate,
}) => {
  const [appUrl, setAppUrl] = useState<CreateAppURL>({
    color: "#37D67A",
    env: "",
    url: "",
  });

  return (
    <Modal
      onClose={onClose}
      onSubmit={() => {
        onCreate(appUrl);
        setAppUrl({
          color: "#37D67A",
          env: "",
          url: "",
        });
      }}
      show={show}
      title="Nova url"
    >
      <div className="flex gap-2 items-center">
        <div className="flex p-2 items-center bg-zinc-200 dark:bg-zinc-700 rounded-md">
          <input
            className="w-9/12 p-0 pl-1 pr-2 h-7 border-r rounded-none border-zinc-300 dark:border-zinc-600"
            type="text"
            placeholder="url"
            value={appUrl.url}
            onChange={(ev) => setAppUrl({ ...appUrl, url: ev.target.value })}
          />

          <input
            className="w-3/12 h-7 rounded-none"
            type="text"
            placeholder="env"
            value={appUrl.env}
            onChange={(ev) => setAppUrl({ ...appUrl, env: ev.target.value })}
            maxLength={5}
            minLength={3}
          />

          <div className="shrink-0 w-7 h-7 relative rounded">
            <ColorPicker
              value={appUrl.color}
              onChange={(color) => setAppUrl({ ...appUrl, color })}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
