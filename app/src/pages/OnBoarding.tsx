import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon128 from "../assets/icons/icon128.png";
import configRepository, { Config } from "../repositories/config.repository";

export const OnBoarding = () => {
  const [config, setConfig] = useState<Config>();
  const navigate = useNavigate();

  const loadConfig = async () => {
    const data = await configRepository.find();

    if (data.dontShowOnboard) {
      navigate("/apps", {
        replace: true,
      });
    }

    setConfig(data);
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = async (
    ev
  ) => {
    console.log(ev.target.checked);
    await configRepository.update({
      dontShowOnboard: ev.target.checked,
    });
  };

  return (
    <main className="flex h-full p-8">
      <div className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <img src={icon128} alt="" className="w-12 h-12" />

          <h1 className="text-5xl font-bold dark:text-zinc-100">envify</h1>

          <p className="text-center font-light dark:text-zinc-400 text-zinc-400">
            your favorite <br />
            <strong className="font-bold text-zinc-500 dark:text-zinc-200 text-sm">
              enviroment{" "}
            </strong>
            manager
          </p>
        </div>

        <div>
          <Link
            to="/apps"
            replace
            className="flex items-center bg-blue-500 rounded-lg h-12 px-4"
          >
            <span className="flex-1 text-center text-sm font-semibold text-white">
              take me to my apps
            </span>
            <span>
              <ArrowRightIcon className="w-6 h-6 self-end stroke-2 stroke-white" />
            </span>
          </Link>

          <div className="flex items-center gap-1 mt-2 justify-center">
            <input
              id="checkbox"
              type="checkbox"
              defaultChecked={config?.dontShowOnboard}
              onChange={onCheckboxChange}
            />
            <label htmlFor="checkbox">dont show me again</label>
          </div>
        </div>
      </div>
    </main>
  );
};
