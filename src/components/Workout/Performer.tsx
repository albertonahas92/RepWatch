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
import { ProgressRing } from "../../atoms/ProgressRing/ProgressRing";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/userSlice";
import countdown from "../../sounds/countdown_2.wav";
import useSound from "use-sound";

export const Performer: FC<Props> = ({ exercise, set, onClickDone }) => {
  const [image, setImage] = useState(0);
  const [warmupTime, setWarmupTime] = useState(0);

  const user = useSelector(userSelector);

  const [started, setStarted] = useState(!user?.settings?.warmupTimer);
  const totalWarmupTime = user?.settings?.warmupTime;
  const [play] = useSound(countdown);

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
    if (warmupTime === 2) {
      play();
    }
  }, [warmupTime]);

  const onWarmupTimeChange = (t: number) => {
    setWarmupTime(t);
  };

  const onPreTimerDone = () => {
    setStarted(true);
  };

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

  const prepare = started || (set?.elapsedTime || 0) > 0;

  return (
    <Box
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {prepare ? (
        <Box>
          <Typography
            color="secondary"
            variant="body2"
            sx={{ textAlign: "center" }}
          >
            Elapsed time
          </Typography>
          <Typography
            color="secondary"
            variant="h2"
            sx={{ textAlign: "center", mb: 1 }}
          >
            <Timer startingTime={set?.elapsedTime} active={true} />
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography
            color="secondary"
            variant="body2"
            sx={{ textAlign: "center", mb: 1 }}
          >
            Warmup timer
          </Typography>
          <Typography
            color="secondary.main"
            variant="h5"
            sx={{ textAlign: "center" }}
          >
            Get Ready!
          </Typography>

          <Typography
            color="warning.light"
            variant="h2"
            sx={{ textAlign: "center", mt: 2 }}
          >
            <ProgressRing
              color="warning.light"
              size={200}
              value={(warmupTime / (totalWarmupTime || 1)) * 100}
            >
              <Timer
                countdown={true}
                active={true}
                endtime={totalWarmupTime}
                onTimeChange={onWarmupTimeChange}
                onTimerStop={onPreTimerDone}
              />
            </ProgressRing>
          </Typography>
        </Box>
      )}
      <CrossFadeImage
        src={`${PUBLIC_DOMAIN_URL}/${exercise?.name.replaceAll(
          /[ \/]/g,
          "_"
        )}/images/${image}.jpg`}
        style={{ display: prepare ? "flex" : "none" }}
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
