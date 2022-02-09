import React, { FC, MouseEvent, useEffect, useState } from "react";
import {
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { RoutineExercise, Set } from "../../types/exercise";
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

export const SetForm: FC<Props> = ({
  index,
  exercise,
  removeSet,
  duplicateSet,
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
  const set: Set = exercise?.sets
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

  const handleRepsChange = (e: any) => {
    setReps(e.target.value);
  };
  const handleWeightChange = (e: any) => {
    setWeight(e.target.value);
  };

  const updateSetState = () => {
    const updatedSet: Set = {
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
    if (elapsedTime && elapsedTime !== initialElapsedTime) {
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
        <TextField
          label="reps"
          margin="dense"
          name="reps"
          onChange={handleRepsChange}
          onBlur={updateSetState}
          type="text"
          value={reps}
          variant="outlined"
          size="small"
          sx={{ m: 0 }}
        />
      </Grid>
      <Grid item md={2} xs={4}>
        <TextField
          label="weight"
          margin="dense"
          name="weight"
          onChange={handleWeightChange}
          onBlur={updateSetState}
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
      </Grid>
      <Grid item md={1} xs={2}>
        <IconButton
          color={active ? "primary" : "default"}
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
        <RestTimer onRestFinish={onRestFinish} />
      </ModalDialog>
    </Grid>
  );
};

interface Props {
  exercise: RoutineExercise;
  index: number;
  removeSet: (exercise: RoutineExercise, index: number) => void;
  duplicateSet?: (exercise: RoutineExercise, index: number) => void;
}
