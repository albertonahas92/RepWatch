import React from "react";
import { useHistory } from "../../hooks/useHistory";
import { RoutineHistory } from "../../types/routine";

export const History = () => {
  const { history } = useHistory();

  const displayRoutines = () => {
    return history?.map((r: RoutineHistory) => {
      return <div>{r.routine.name}</div>;
    });
  };

  return (
    <div>
      History
      {/* {displayRoutines()} */}
    </div>
  );
};
