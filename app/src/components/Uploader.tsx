import {
  ArrowUpTrayIcon,
  DocumentPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import { AppURL } from "./UrlForm";

type UploaderProps = {
  data: AppURL;
  onChange: (file: Blob | null) => void;
};

export const Uploader: React.FC<UploaderProps> = ({ data, onChange }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className="h-7 w-7 p-0 rounded-full overflow-clip cursor-pointer shrink-0 items-center flex justify-center"
      >
        {data.faviconUrl ? (
          <img src={data.faviconUrl} />
        ) : (
          <img src={data.originalFaviconUrl} />
        )}
      </div>
      <Modal
        show={showModal}
        value={data.faviconUrl}
        onChange={(file) => onChange(file)}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

type ModalProps = {
  value: string | null;
  show: boolean;
  onClose: () => void;
  onChange: (file: Blob | null) => void;
};

const Modal: React.FC<ModalProps> = ({ value, show, onChange, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    ev
  ) => {
    const target = ev.target as HTMLInputElement;

    const [file] = Array.from(target.files || []);

    if (file) {
      if (!["image/png", "image/jpeg"].includes(file.type)) return;
      if (file.size > 5e6) return;
      onChange(file);
    }
  };

  const handleClickImage = () => {
    if (value) {
      onChange(null);
    } else {
      inputRef.current?.click();
    }
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-black/30 z-50 flex justify-center items-center">
      <div className="w-3/4 bg-zinc-700 rounded-lg py-4 px-4">
        <div className="w-full py-10 rounded-full">
          <div className="rounded-full w-fit bg-zinc-600 p-2 m-auto relative flex items-center justify-center">
            {value ? (
              <img
                src={value}
                className="w-12 h-12 rounded-full object-scale-down cursor-pointer"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center">
                <DocumentPlusIcon className="h-8 w-8 stroke-white duration-200" />
              </div>
            )}

            <button
              onClick={handleClickImage}
              className="absolute w-12 h-12 rounded-full backdrop-blur-sm opacity-0 duration-200 hover:opacity-100 flex bg-white/5 items-center justify-center"
            >
              {value ? (
                <XMarkIcon className="h-6 w-6 stroke-2 stroke-red-600 duration-200" />
              ) : (
                <ArrowUpTrayIcon className="h-6 w-6 stroke-2 stroke-white duration-200" />
              )}
            </button>
          </div>

          <input
            ref={inputRef}
            onChange={handleInputChange}
            type="file"
            hidden
            accept="image/png, image/jpeg"
          />
        </div>

        <button onClick={onClose} className="primary w-full">
          Fechar
        </button>
      </div>
    </div>
  );
};
