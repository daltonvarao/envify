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
  const menuRightOffset =
    (menuRef.current?.offsetLeft ?? 0) - (4 * 24) / 2 - 5 * 4 - 4; // position of menu - icon width / 2 - button padding / 2

  const menuTopOffset = menuRef.current?.offsetTop ?? 0; // position of menu - icon width / 2 - button padding / 2

  useClickOutsideRef(menuRef, () => setShow(false));

  return (
    <div ref={menuRef}>
      <button
        onClick={() => setShow((state) => !state)}
        className="p-2 rounded-full flex items-center justify-center relative hover:bg-zinc-600 duration-200"
      >
        <EllipsisVerticalIcon className="w-5 h-5 stroke-2" />
      </button>

      {show && (
        <ul
          className={`fixed w-24 bg-zinc-600 rounded-md py-1 shadow-md z-50`}
          style={{ left: menuRightOffset + "px", top: menuTopOffset + "px" }}
        >
          {options.map(({ label, onClick }) => {
            return (
              <button
                key={label}
                onClick={onClick}
                className="hover:bg-zinc-500 py-2 px-2 cursor-pointer w-full text-left"
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
