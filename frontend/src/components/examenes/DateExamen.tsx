import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useEffect, useState } from "react";

function DateExamen({ start, end }: { start: Date; end: Date }) {
  const [today, setToday] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setToday(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (today > new Date(end)) {
    return (
      <span className="mt-2 text-lg font-bold text-gray-400">Ya terminó</span>
    );
  }

  if (today >= new Date(start) && today <= new Date(end)) {
    const currentDateTime = new Date(end) - today;
    return (
      <span className="mt-2 text-lg flex items-center text-green-600 font-bold">
        En curso. Quedan {moment(currentDateTime).format("HH:mm:ss")}{" "}
        <FontAwesomeIcon className="text-4xl" icon={faClockRotateLeft} />
      </span>
    );
  }

  return (
    <>
      {today.getDate() === new Date(start).getDate() ? (
        <span className="mt-2 text-lg text-green-600 font-bold">
          Empieza {moment(start).calendar()}
        </span>
      ) : (
        <span className="mt-2 text-lg text-gray-400 font-bold">
          Disponible {moment(start).calendar()}
        </span>
      )}
    </>
  );
}

export default DateExamen;
