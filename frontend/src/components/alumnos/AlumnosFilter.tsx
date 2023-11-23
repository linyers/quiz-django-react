import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const ModalFilter = () => {
  return (
    <ul className="absolute right-9 top-32 rounded-md bg-white shadow-lg">
      <li className="hover:bg-gray-200 px-6 rounded-t-md">Año</li>
      <li className="hover:bg-gray-200 px-6 rounded-b-md">Curso</li>
    </ul>
  );
};

function AlumnosFilter() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <a
        onClick={(e) => setOpen(!open)}
        className="text-lg pr-3 cursor-pointer hover:text-gray-700"
      >
        Filtrar{" "}
        <FontAwesomeIcon
          className={`${open && "rotate-180"} transition-all duration-200`}
          icon={faChevronDown}
        />
      </a>
      {open && <ModalFilter />}
    </>
  );
}

export default AlumnosFilter;
