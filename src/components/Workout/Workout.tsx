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
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { EquipmentIcon } from "../../icons/equipment/EquipmentIcon";
import { Exercise, RoutineExercise, Set } from "../../types/exercise";
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

export const Workout: FC<Props> = ({ onFinish }) => {
  const [openExerciseList, setOpenExerciseList] = useState(false);

  const routine = useSelector(routineSelector);
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const screenSize = useWindowDimensions();

  const toggleActive = (exercise: RoutineExercise) => {
    const active = exercise.active ? false : true;
    dispatch(updateExercise({ ...exercise, active }));
  };

  const addSet = (exercise: RoutineExercise) => {
    let sets = exercise.sets || [];
    const index = exercise.sets?.length || 0;
    sets = [...sets, { id: shortid.generate(), reps: 12, weight: 0, index }];
    dispatch(updateExercise({ ...exercise, sets }));
  };

  const removeSet = (exercise: RoutineExercise, index: number) => {
    const newSets = [...Array.from(exercise.sets || [])];
    newSets?.splice(index, 1);
    dispatch(updateExercise({ ...exercise, sets: newSets }));
  };

  const duplicateSet = (exercise: RoutineExercise, index: number) => {
    let sets = exercise.sets || [];
    const duplicate: Set = {
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
    };
    dispatch(
      updateExercises([
        ...Array.from(routine?.exercises || []),
        routineExercise,
      ])
    );
    setOpenExerciseList(false);
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
      routine?.exercises?.flatMap((e) => e.sets).some((s) => !s?.elapsedTime)
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
    <Container sx={{ p: 0 }} maxWidth="md">
      <List dense={true}>
        {routine?.exercises?.map((exercise: RoutineExercise) => {
          // if (exercises) {
          //   exercise = {
          //     ...exercise,
          //     ...exercises.find((e) => e.name === exercise.name),
          //   };
          // }
          return (
            <React.Fragment key={exercise.name}>
              <ListItem
                sx={{ pl: { xs: 0 } }}
                secondaryAction={
                  <IconButton
                    onClick={() => {
                      toggleActive(exercise);
                    }}
                    edge="end"
                    aria-label="delete"
                  >
                    {!exercise.active ? (
                      <KeyboardArrowRightSharpIcon />
                    ) : (
                      <RemoveOutlinedIcon />
                    )}
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <EquipmentIcon
                      style={{ fontSize: "25px" }}
                      icon={exercise.equipment || ""}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={exercise.name} />
              </ListItem>
              <Collapse in={exercise.active} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {exercise.sets?.map((set: Set, index: number) => (
                    <React.Fragment key={set.id || shortid.generate()}>
                      <ListItem
                        key={set.id || shortid.generate()}
                        sx={{ pl: { md: 7, xs: 0 }, pr: 0 }}
                      >
                        <ListItemText
                          primary={
                            <SetForm
                              index={index}
                              removeSet={removeSet}
                              duplicateSet={duplicateSet}
                              exercise={exercise}
                            />
                          }
                        />
                      </ListItem>
                      {screenSize === "xs" && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
                <Button
                  color="warning"
                  // disabled={formik.isSubmitting}
                  fullWidth
                  size="small"
                  type="button"
                  variant="text"
                  onClick={() => addSet(exercise)}
                  endIcon={<AddCircleSharpIcon />}
                  sx={{ my: 1 }}
                >
                  Add Set
                </Button>
              </Collapse>
            </React.Fragment>
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
            Discard Workout
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
            Finish Workout
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
            onClick={() => discardWorkout()}
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
