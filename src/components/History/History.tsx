import { Box, Container, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { historySelector } from "../../store/historySlice";
import { RoutineHistory } from "../../types/routine";
import { HistoryList } from "./HistoryList";

export const History = () => {
  const history = useSelector(historySelector);

  const displayRoutines = () => {
    return history?.map((r: RoutineHistory) => {
      return <div>{r.routine.name}</div>;
    });
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        pt: 3,
        pb: 6,
        height: "100%",
        flexGrow: 1,
      }}
    >
      <Container>
        <Typography
          component="h5"
          variant="h5"
          align="center"
          color="text.primary"
          gutterBottom
        >
          History
        </Typography>
        <HistoryList history={history} />
      </Container>
    </Box>
  );
};
