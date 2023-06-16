import { useRef, useState } from "react";
import { useClickOutsideRef } from "../hooks/use-click-outside.hook";

type ColorPickerProps = {
  onChange: (color: string) => void;
  value: string;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange: onSelect,
}) => {
  const [showSwatch, setShowSwatch] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useClickOutsideRef(pickerRef, () => setShowSwatch(false));

  const handleSelect = (color: string) => {
    onSelect(color);
    setShowSwatch(false);
  };

  const colors = [
    "#555555",
    "#ba68c8",
    "#3a6afc",
    "#00daad",
    "#dce775",
    "#ff6262",
    "#FF703D",
  ];
  return (
    <div
      ref={pickerRef}
      className="h-6 w-6 rounded-lg cursor-pointer hover:brightness-105 duration-200"
      style={{ background: value }}
      onClick={() => {
        if (!showSwatch) {
          setShowSwatch(true);
        }
      }}
    >
      {showSwatch && (
        <div className="grid grid-flow-col gap-1 p-2 rounded-md shadow-sm -top-2 items-center justify-between absolute transition-all right-7 bg-zinc-700 border border-gray-600">
          {colors.map((color) => {
            return (
              <div
                key={color}
                className={`
                  h-6 w-6 cursor-pointer hover:shadow-md rounded-lg hover:scale-110 duration-200 flex items-center justify-center
                `}
                style={{ background: color }}
                onClick={() => handleSelect(color)}
              >
                {color === value && (
                  <div className="h-3 w-3 bg-white rounded"></div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
