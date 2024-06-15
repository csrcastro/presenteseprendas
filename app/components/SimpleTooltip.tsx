import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function SimpleTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative text-[0] z-50">
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className="mr-2 transition-colors duration-200 focus:outline-none hover:text-cold"
      >
        <InformationCircleIcon
          className="h-6 w-6"
          aria-hidden="true"
        />
      </button>

      {open ? <p className="text-sm absolute flex items-center justify-center p-3 text-colder bg-white rounded-lg shadow -left-3 -top-14 shadow-text/50">
          <span className="whitespace-nowrap">
            Valores referentes à data de publicação
          </span>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 absolute rotate-45 left-3 bottom-0.5 -mb-3 transform text-white fill-white"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"></path>
          </svg>
        </p> : null}
    </div>
  );
}
