import { Container } from "@mui/material";
import React from "react";
import { useHistory } from "../../hooks/useHistory";
import { RoutineHistory } from "../../types/routine";
import { HistoryList } from "./HistoryList";
import { HistoryTimeline } from "./HistoryTimeline";

export const History = () => {
  const { history } = useHistory();

  const displayRoutines = () => {
    return history?.map((r: RoutineHistory) => {
      return <div>{r.routine.name}</div>;
    });
  };

  return (
    <Container>
      History
      <HistoryList history={history} />
    </Container>
  );
};
