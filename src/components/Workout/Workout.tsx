import {
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Container,
  Collapse,
  Button,
  Divider,
  Grid,
  Box,
  Typography,
  Stack,
  Chip,
  TextField,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { EquipmentIcon } from "../../icons/equipment/EquipmentIcon";
import { Exercise, RoutineExercise, ESet } from "../../types/exercise";
import KeyboardArrowRightSharpIcon from "@mui/icons-material/KeyboardArrowRightSharp";
import MinimizeOutlinedIcon from "@mui/icons-material/MinimizeOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  routineSelector,
  setRoutine,
  setRoutineModal,
  updateExercise,
  updateExercises,
} from "../../store/routineSlice";
import firebase from "../../config";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import { SetForm } from "./SetForm";
import PauseIcon from "@mui/icons-material/Pause";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import shortid from "shortid";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useExercises } from "../../hooks/useExercises";
import ModalDialog from "../../molecules/ModalDialog/ModalDialog";
import { ExercisesList } from "../ExercisesList/ExercisesList";
import { WorkoutSummary } from "./WorkoutSummary";
import { useConfirm } from "material-ui-confirm";
import EditIcon from "@mui/icons-material/Edit";
import { DateTimePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { historySelector } from "../../store/historySlice";
import {
  getExercisesHistory,
  getNextWeight,
  getRepsCount,
  sortExercisesHistory,
} from "../../utils/helpers";
import { WorkoutExercisesListItem } from "./Partials/WorkoutExercisesListItem";
import { userSelector } from "../../store/userSlice";
import { setFeedback } from "../../store/feedbackSlice";

export const Workout: FC<Props> = ({ onFinish }) => {
  const [openExerciseList, setOpenExerciseList] = useState(false);
  const [editDate, setEditDate] = useState(false);

  const routine = useSelector(routineSelector);
  const user = useSelector(userSelector);

  const dispatch = useDispatch();
  const confirm = useConfirm();

  const screenSize = useWindowDimensions();

  const toggleActive = (exercise: RoutineExercise) => {
    const active = exercise.active ? false : true;
    dispatch(updateExercise({ ...exercise, active }));
  };

  const handleDateChange = (newValue: Date | null) => {
    const finishedAt = newValue
      ? firebase.firestore.Timestamp.fromDate(newValue)
      : undefined;
    dispatch(
      setRoutine({
        ...routine,
        finishedAt,
      })
    );
    setEditDate(false);
  };

  const addSet = (exercise: RoutineExercise) => {
    let sets = exercise.sets || [];
    const index = exercise.sets?.length || 0;
    let repsCount = 0,
      prevWeight = 0,
      weight = 0;
      
    try {
      repsCount = getRepsCount(user, exercise, index);
      prevWeight = index === 0 ? 0 : exercise.sets?.at(index - 1)?.weight || 0;
      weight = getNextWeight(user, exercise, prevWeight);
    } catch (error) {
      alert(error);
    }

    sets = [
      ...sets,
      { id: shortid.generate(), reps: repsCount, weight: weight, index },
    ];
    dispatch(updateExercise({ ...exercise, sets }));
  };

  const removeSet = (exercise: RoutineExercise, index: number) => {
    const newSets = [...Array.from(exercise.sets || [])];
    newSets?.splice(index, 1);
    dispatch(updateExercise({ ...exercise, sets: newSets }));
  };

  const duplicateSet = (exercise: RoutineExercise, index: number) => {
    let sets = exercise.sets || [];
    const duplicate: ESet = {
      ...sets[index],
      elapsedTime: 0,
      elapsedRestTime: 0,
    };
    sets = [...sets, duplicate];
    dispatch(updateExercise({ ...exercise, sets }));
  };

  const onAddExercise = (exercise: Exercise) => {
    if (routine?.exercises?.filter((e) => e.name === exercise.name).length)
      return;

    const routineExercise: RoutineExercise = {
      ...exercise,
      index: routine?.exercises?.length || 0,
      active: true,
    };
    dispatch(
      updateExercises([
        ...Array.from(routine?.exercises || []),
        routineExercise,
      ])
    );
    setOpenExerciseList(false);
  };

  const onCompleteWorkout = () => {
    discardWorkout();
    if (!user?.feedback) {
      dispatch(setFeedback(true));
    }
  };

  const discardWorkout = (showComfirmation?: boolean) => {
    if (
      routine?.exercises?.flatMap((e) => e.sets).some((s) => s?.elapsedTime) &&
      showComfirmation
    ) {
      confirm({
        title: "Are you sure?",
        description: "Your current workout data will be lost",
      })
        .then(() => {
          dispatch(setRoutine(undefined));
        })
        .catch((e: any) => {
          console.log(e);
        });
    } else {
      dispatch(setRoutine(undefined));
    }
  };

  const onFinishWorkout = () => {
    if (
      routine?.exercises?.flatMap((e) => e.sets).some((s) => !s?.elapsedTime) &&
      !routine.historicalId
    ) {
      confirm({
        title: "You have some unfinished sets",
        description:
          "Do you want to finish your workout and mark all sets as done?",
      })
        .then(() => {
          onFinish();
        })
        .catch((e: any) => {
          console.log(e);
        });
    } else {
      onFinish();
    }
  };

  return routine && !routine?.done ? (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container sx={{ p: 0 }} maxWidth="md">
        {routine?.finishedAt && (
          <Box sx={{ float: "right", "& div": { zIndex: 999 } }}>
            {!editDate ? (
              <Chip
                label={
                  <Typography variant="caption">
                    {routine?.finishedAt?.toDate().toDateString()}
                  </Typography>
                }
                onDelete={() => {
                  setEditDate(true);
                }}
                deleteIcon={<EditIcon />}
                variant="filled"
              ></Chip>
            ) : (
              <DateTimePicker
                label="Workout date"
                value={routine.finishedAt.toDate()}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField variant="standard" {...params} />
                )}
              />
            )}
          </Box>
        )}
        <List dense={true}>
          {routine?.exercises?.map((exercise: RoutineExercise) => {
            return (
              <WorkoutExercisesListItem
                exercise={exercise}
                addSet={addSet}
                removeSet={removeSet}
                duplicateSet={duplicateSet}
                screenSize={screenSize}
                toggleActive={toggleActive}
                key={exercise.name}
              />
            );
          })}
        </List>
        {/* <Divider variant="fullWidth" sx={{ my: 3 }} /> */}
        <Button
          color="primary"
          // disabled={formik.isSubmitting}
          fullWidth
          size="small"
          type="button"
          variant="text"
          onClick={() => setOpenExerciseList(true)}
          endIcon={<AddCircleSharpIcon />}
          sx={{ my: 1 }}
        >
          Add New Exercise
        </Button>
        <Grid columnSpacing={4} container>
          <Grid item md={6} xs={12}>
            <Button
              color="secondary"
              fullWidth
              size="medium"
              type="button"
              variant="outlined"
              onClick={() => discardWorkout(true)}
              sx={{ my: 1 }}
            >
              Discard {routine.historicalId ? "Changes" : "Workout"}
            </Button>
          </Grid>
          <Grid item md={6} xs={12}>
            <Button
              color="primary"
              fullWidth
              size="medium"
              type="button"
              variant="contained"
              onClick={onFinishWorkout}
              sx={{ my: 1, boxShadow: "none" }}
            >
              {routine.historicalId ? "Save" : "Finish"} Workout
            </Button>
          </Grid>
        </Grid>
        <ModalDialog
          closeButton={true}
          title={"Select Exercise"}
          open={openExerciseList}
          setOpen={setOpenExerciseList}
        >
          <ExercisesList onSelectExercise={onAddExercise} />
        </ModalDialog>
      </Container>
    </LocalizationProvider>
  ) : routine ? (
    <Box>
      <WorkoutSummary />
      <Grid columnSpacing={4} container>
        <Grid item md={12} xs={12}>
          <Button
            color="primary"
            fullWidth
            size="medium"
            type="button"
            variant="contained"
            onClick={onCompleteWorkout}
            sx={{ my: 1 }}
          >
            Complete
          </Button>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <></>
  );
};

interface Props {
  onFinish: () => void;
}
