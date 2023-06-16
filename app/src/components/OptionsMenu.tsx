import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import React, { useRef, useState } from "react";
import { useClickOutsideRef } from "../hooks/use-click-outside.hook";

type Option = {
  label: string;
  onClick: () => void;
};

type OptionsMenuProps = {
  options: Option[];
};

export const OptionsMenu: React.FC<OptionsMenuProps> = ({ options }) => {
  const [show, setShow] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutsideRef(menuRef, () => setShow(false));

  return (
    <div className="fixed right-6 top-8 z-50" ref={menuRef}>
      <button onClick={() => setShow((state) => !state)}>
        <EllipsisVerticalIcon className="w-5 stroke-2" />
      </button>

      {show && (
        <ul className="absolute right-2 w-24 bg-zinc-700 rounded-md py-1 shadow-md">
          {options.map(({ label, onClick }) => {
            return (
              <button
                key={label}
                onClick={onClick}
                className="hover:bg-zinc-600 py-2 px-2 cursor-pointer w-full text-left"
              >
                {label}
              </button>
            );
          })}
        </ul>
      )}
    </div>
  );
};
