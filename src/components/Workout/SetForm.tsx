import React, { FC, MouseEvent, useEffect, useState } from "react";
import {
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { RoutineExercise, ESet } from "../../types/exercise";
import { useDispatch, useSelector } from "react-redux";
import { updateExercises, updateSet } from "../../store/routineSlice";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import { Timer } from "../../atoms/Timer/Timer";
import TimerOffOutlinedIcon from "@mui/icons-material/TimerOffOutlined";
import ModalDialog from "../../molecules/ModalDialog/ModalDialog";
import { Performer } from "./Performer";
import { RestTimer } from "./RestTimer";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { userSelector } from "../../store/userSlice";
import { StyledMenu } from "../TopBar/TopBar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { setExercise, setExerciseModal } from "../../store/exerciseSlice";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import anime from "animejs";
import {
  nonWeightedEquipments,
  noRepsCategory,
  toMMSS,
} from "../../utils/utils";
import { TimePicker } from "@mui/lab";
import InputMask, { BeforeMaskedStateChangeStates } from "react-input-mask";
import moment from "moment";

export const SetFormComp: FC<Props> = ({
  index,
  exercise,
  removeSet,
  duplicateSet,
  standBy,
}) => {
  const user = useSelector(userSelector);

  const initialReps = exercise?.sets ? exercise.sets[index].reps : 12;
  const initialWeight = exercise?.sets ? exercise.sets[index].weight : 10;
  const initialElapsedTime = exercise?.sets
    ? exercise.sets[index].elapsedTime
    : 0;
  const initialElapsedRestTime = exercise?.sets
    ? exercise.sets[index].elapsedRestTime
    : 0;
  const initialActive =
    exercise?.sets && exercise.sets[index].active ? true : false;
  const initialResting =
    exercise?.sets && exercise.sets[index].resting ? true : false;
  const set: ESet = exercise?.sets
    ? exercise.sets[index]
    : { index: 0, reps: 0, weight: 0 };

  const [reps, setReps] = useState(initialReps);
  const [weight, setWeight] = useState(initialWeight);
  const [resting, setResting] = useState(initialResting);
  const [elapsedRestTime, setRestElapsedTime] = useState(
    initialElapsedRestTime || 0
  );
  const [active, setActive] = useState(initialActive);
  const [elapsedTime, setElapsedTime] = useState(initialElapsedTime);

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const dispatch = useDispatch();
  const theme = useTheme();

  const handleRepsChange = (e: any) => {
    setReps(e.target.value);
  };
  const handleInputFocus = (e: any) => {
    if (e.target.value === "0") {
      e.target.select();
    }
  };
  const handleWeightChange = (e: any) => {
    setWeight(e.target.value);
  };

  const updateSetState = () => {
    const updatedSet: ESet = {
      ...set,
      reps,
      weight,
      active,
      elapsedTime,
      elapsedRestTime,
    };
    dispatch(updateSet({ index, set: updatedSet, name: exercise?.name || "" }));
  };

  const onTimerClick = () => {
    setActive((ac) => !ac);
    // updateSetState();
  };

  const handleTimerStop = (elapsedTime: number) => {
    setElapsedTime(elapsedTime);
  };

  const onClickDone = () => {
    setActive(false);
    setResting(true);
  };

  const onRestFinish = (time: number) => {
    setResting(false);
    setRestElapsedTime(time);
  };

  const handleResetTimmer = () => {
    setRestElapsedTime(0);
    setElapsedTime(0);
  };

  useEffect(() => {
    return () => {
      if (active) {
        setActive(false);
      }
    };
  }, []);

  useEffect(() => {
    if (elapsedTime !== initialElapsedTime) {
      updateSetState();
    }
  }, [elapsedTime]);

  const open = Boolean(anchorEl);

  const handleSetMenuClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSetMenuClose = () => {
    setAnchorEl(null);
  };

  const animation = () => {
    anime({
      targets: ".standby",
      color: [theme.palette.primary.main, theme.palette.secondary.main],
      easing: "easeInOutSine",
      duration: 500,
      loop: true,
      direction: "alternate",
    });
  };

  useEffect(() => {
    if (standBy) {
      animation();
    }
    return () => {};
  }, [standBy]);


  return (
    <Grid columnSpacing={2} container>
      <Grid
        item
        md={4}
        xs={8}
        sx={{ display: "flex", alignItems: "center", mb: { xs: 2, md: 0 } }}
      >
        <Typography
          color={active ? "primary" : "default"}
          variant="body2"
          sx={{ fontWeight: "bolder" }}
        >
          Set {index + 1}
        </Typography>
        {!!elapsedTime && (
          <CheckCircleOutlinedIcon
            color="primary"
            sx={{ fontSize: "1em", ml: 1 }}
          />
        )}
      </Grid>
      <Grid item md={2} xs={3} sx={{ display: "flex", alignItems: "center" }}>
        <Chip
          label={
            <Timer
              startingTime={elapsedTime}
              onTimerStop={handleTimerStop}
              active={active}
            />
          }
          sx={{ mb: { xs: 1, md: 0 } }}
          onDelete={handleResetTimmer}
          deleteIcon={<RestartAltIcon />}
          variant="filled"
        ></Chip>
      </Grid>
      <Grid item md={2} xs={4}>
        {!noRepsCategory.includes(exercise.category || "") ? (
          <TextField
            label="reps"
            margin="dense"
            name="reps"
            onChange={handleRepsChange}
            onBlur={updateSetState}
            onFocus={handleInputFocus}
            type="text"
            value={reps}
            variant="outlined"
            size="small"
            sx={{ m: 0 }}
          />
        ) : (
          <TimePicker
            label="Time"
            value={moment(toMMSS(elapsedTime || 0), ["mm:ss"])}
            onChange={(val) => {
              const time = moment(val);
              if (!time.isValid()) {
                return;
              }
              const seconds = time.seconds();
              const minutes = time.minutes() * 60;
              setElapsedTime(seconds + minutes);
            }}
            ampm={false}
            ampmInClock={false}
            disableOpenPicker={true}
            views={["minutes", "seconds"]}
            inputFormat="mm:ss"
            mask="__:__"
            renderInput={(params) => <TextField size="small" {...params} />}
          />
        )}
      </Grid>
      <Grid item md={2} xs={4}>
        {!nonWeightedEquipments.includes(exercise.equipment || "") &&
          !noRepsCategory.includes(exercise.category || "") && (
            <TextField
              label="weight"
              margin="dense"
              name="weight"
              onChange={handleWeightChange}
              onBlur={updateSetState}
              onFocus={handleInputFocus}
              type="text"
              value={weight}
              variant="outlined"
              size="small"
              sx={{ m: 0 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <small>{user?.unit === "imperial" ? "lb" : "kg"}</small>
                  </InputAdornment>
                ),
              }}
            />
          )}
      </Grid>
      <Grid item md={1} xs={2}>
        <IconButton
          color={active ? "primary" : elapsedTime ? "default" : "primary"}
          className={!active && standBy ? "standby" : ""}
          type="button"
          onClick={onTimerClick}
        >
          {active ? <TimerOffOutlinedIcon /> : <TimerOutlinedIcon />}
        </IconButton>
      </Grid>
      <Grid item md={1} xs={1}>
        <IconButton
          type="button"
          disabled={active}
          onClick={handleSetMenuClick}
        >
          <MoreVertIcon />
        </IconButton>
      </Grid>
      <StyledMenu
        id="set-menu"
        MenuListProps={{
          "aria-labelledby": "set-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleSetMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleSetMenuClose();
            dispatch(setExercise(exercise));
            dispatch(setExerciseModal(true));
          }}
        >
          <InfoOutlinedIcon />
          Exercise Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSetMenuClose();
            onTimerClick();
          }}
        >
          <PlayCircleOutlineIcon />
          {!active ? "Start" : "Pause"} Set
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSetMenuClose();
            setElapsedTime(60);
          }}
        >
          <CheckCircleOutlinedIcon />
          Mark as done
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSetMenuClose();
            duplicateSet?.(exercise, index);
          }}
        >
          <ContentCopyIcon />
          Duplicate Set
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSetMenuClose();
            removeSet(exercise, index);
          }}
        >
          <ClearSharpIcon />
          Delete Set
        </MenuItem>
      </StyledMenu>
      <ModalDialog
        closeButton={true}
        title={`${exercise.name} - Set ${index + 1}`}
        open={active}
        setOpen={(open) => {
          setActive(open);
        }}
        maxWidth="sm"
      >
        <Performer onClickDone={onClickDone} exercise={exercise} set={set} />
      </ModalDialog>
      <ModalDialog
        closeButton={false}
        open={resting}
        setOpen={(open) => {
          setResting(open);
        }}
        maxWidth="sm"
      >
        <RestTimer
          onRestFinish={onRestFinish}
          exercise={exercise}
          setIndex={index}
        />
      </ModalDialog>
    </Grid>
  );
};

interface Props {
  exercise: RoutineExercise;
  index: number;
  removeSet: (exercise: RoutineExercise, index: number) => void;
  duplicateSet?: (exercise: RoutineExercise, index: number) => void;
  standBy?: boolean;
}

export const SetForm = React.memo(SetFormComp);
