import { Button, IconButton, Stack, styled, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { FC, useState } from "react";
import { ProgressRing } from "../../atoms/ProgressRing/ProgressRing";
import { Timer } from "../../atoms/Timer/Timer";
import { Chill } from "../../icons/chill";
import { keyframes } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/userSlice";
import { getRestTime } from "../../utils/helpers";
import { RoutineExercise } from "../../types/exercise";
import { useNoSleep } from "use-no-sleep";

const pulse = keyframes`
  0% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(-3px);
  }
`;

const ChillPulse = styled(Chill)(({ theme }) => ({
  animation: `${pulse} 1s infinite alternate ease`,
}));

export const RestTimer: FC<Props> = ({ onRestFinish, exercise, setIndex }) => {
  const [time, setTime] = useState(0);
  const user = useSelector(userSelector);

  useNoSleep(true);

  const [restTime, setRestTime] = useState(
    getRestTime(user, exercise, setIndex)
  );

  const onTimeChange = (t: number) => {
    setTime(t);
  };

  const onClickSubtract = () => {
    setRestTime((rt) => rt - 15);
  };
  const onClickAdd = () => {
    setRestTime((rt) => rt + 15);
  };

  return (
    <Box
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography color="secondary" variant="body2">
        Let's have some rest!
      </Typography>
      <Typography
        color="primary"
        variant="h2"
        sx={{ textAlign: "center", mb: 1 }}
      >
        <Timer
          active={true}
          countdown={true}
          endtime={restTime}
          onTimerStop={onRestFinish}
          onTimeChange={onTimeChange}
        />
      </Typography>
      <Stack direction="row" sx={{ alignItems: "center" }}>
        <IconButton color="default" component="span" onClick={onClickAdd}>
          <AddIcon />
        </IconButton>
        <ProgressRing size={150} value={(time / restTime) * 100}>
          <ChillPulse style={{ fontSize: "4rem" }} color="secondary" />
        </ProgressRing>
        <IconButton color="default" component="span" onClick={onClickSubtract}>
          <RemoveIcon />
        </IconButton>
      </Stack>
      <Button
        color="primary"
        fullWidth
        size="medium"
        type="button"
        variant="text"
        onClick={() => {
          onRestFinish(time);
        }}
        sx={{ my: 1 }}
      >
        Skip
      </Button>
    </Box>
  );
};

interface Props {
  onRestFinish: (time: number) => void;
  exercise?: RoutineExercise;
  setIndex?: number;
}
