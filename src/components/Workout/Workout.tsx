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
  updateExercises,
} from "../../store/routineSlice";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import { SetForm } from "./SetForm";
import PauseIcon from "@mui/icons-material/Pause";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import shortid from "shortid";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useExercises } from "../../hooks/useExercises";

export const Workout: FC<Props> = ({ onFinish }) => {
  const routine = useSelector(routineSelector);
  const { exercises } = useExercises();
  const dispatch = useDispatch();
  const screenSize = useWindowDimensions();

  const toggleActive = (exercise: RoutineExercise) => {
    const active = exercise.active ? false : true;
    dispatch(updateExercises({ ...exercise, active }));
  };

  const addSet = (exercise: RoutineExercise) => {
    let sets = exercise.sets || [];
    const index = exercise.sets?.length || 0;
    sets = [...sets, { id: shortid.generate(), reps: 12, weight: 0, index }];
    dispatch(updateExercises({ ...exercise, sets }));
  };

  const removeSet = (exercise: RoutineExercise, index: number) => {
    const newSets = [...Array.from(exercise.sets || [])];
    newSets?.splice(index, 1);
    dispatch(updateExercises({ ...exercise, sets: newSets }));
  };

  const duplicateSet = (exercise: RoutineExercise, index: number) => {
    let sets = exercise.sets || [];
    const duplicate: Set = {
      ...sets[index],
      elapsedTime: 0,
      elapsedRestTime: 0,
    };
    sets = [...sets, duplicate];
    dispatch(updateExercises({ ...exercise, sets }));
  };

  const discardWorkout = () => {
    dispatch(setRoutine(undefined));
  };

  return (
    <Container sx={{ p: 0 }} maxWidth="md">
      {/* <Typography
        component="h5"
        variant="h5"
        align="center"
        color="text.primary"
        gutterBottom
      >
        {routine?.name}
      </Typography> */}
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
                    <>
                      <ListItem
                        key={set.id || shortid.generate()}
                        sx={{ pl: { md: 9, xs: 0 }, pr: 0 }}
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
                    </>
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
      <Grid columnSpacing={4} container>
        <Grid item md={6} xs={12}>
          <Button
            color="secondary"
            fullWidth
            size="medium"
            type="button"
            variant="outlined"
            onClick={discardWorkout}
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
            onClick={onFinish}
            sx={{ my: 1, boxShadow: "none" }}
          >
            Finish Workout
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

interface Props {
  onFinish: () => void;
}
