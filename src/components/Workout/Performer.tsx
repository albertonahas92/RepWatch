import { Button, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { FC, useEffect, useState } from "react";
import CrossFadeImage from "../../atoms/CrossFadeImage/CrossFadeImage";
import { Timer } from "../../atoms/Timer/Timer";
import { RoutineExercise, ESet } from "../../types/exercise";
import { PUBLIC_DOMAIN_URL } from "../../utils/constants";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { Done } from "../../icons/done";
import { useNoSleep } from "use-no-sleep";

export const Performer: FC<Props> = ({ exercise, set, onClickDone }) => {
  const [image, setImage] = useState(0);
  useNoSleep(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setImage((im) => 1 - im);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let _navigator: any;
    _navigator = window.navigator;

    let screenLock: any;
    if (_navigator.wakeLock) {
      _navigator.wakeLock.request("screen").then((lock: any) => {
        screenLock = lock;
      });
    }

    return () => {
      if (screenLock) {
        screenLock.release();
      }
    };
  }, []);

  return (
    <Box
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {/* <Typography variant="h5" sx={{ textAlign: "center" }}>
        {exercise?.name}
      </Typography> */}
      <Typography
        color="secondary"
        variant="h2"
        sx={{ textAlign: "center", mb: 1 }}
      >
        <Timer startingTime={set?.elapsedTime} active={true} />
      </Typography>
      <CrossFadeImage
        src={`${PUBLIC_DOMAIN_URL}/${exercise?.name.replaceAll(
          " ",
          "_"
        )}/images/${image}.jpg`}
      />
      <Button
        sx={{ mt: 2 }}
        color="primary"
        component="span"
        size="large"
        onClick={onClickDone}
        endIcon={<Done />}
      >
        Done
      </Button>
      {/* <IconButton
        sx={{ mt: 2 }}
        color="primary"
        component="span"
        onClick={onClickDone}
      >
        <Done style={{ fontSize: "40px" }} />
      </IconButton> */}
    </Box>
  );
};

interface Props {
  exercise?: RoutineExercise;
  set?: ESet;
  onClickDone: () => void;
}

interface BaseWebLockSentinelEventMap {
  onrelease: Event;
}
