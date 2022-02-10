import {
  Avatar,
  Box,
  Button,
  Container,
  Fade,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useRoutines } from "../../hooks/useRoutines";
import ModalDialog from "../../molecules/ModalDialog/ModalDialog";
import { ExercisesList } from "../ExercisesList/ExercisesList";
import { Exercise, RoutineExercise } from "../../types/exercise";
import DeleteIcon from "@mui/icons-material/Delete";
import { EquipmentIcon } from "../../icons/equipment/EquipmentIcon";
import DraggableList from "./partials/DraggableList";
import { reorder } from "../../utils/utils";
import { DropResult } from "react-beautiful-dnd";
import { FrontDiagram } from "../../icons/frontDiagram";
import { BackDiagram } from "../../icons/backDiagram";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import { useNavigate } from "react-router-dom";
import { routineSelector, setRoutine } from "../../store/routineSlice";
import { useDispatch, useSelector } from "react-redux";
import { useExercises } from "../../hooks/useExercises";
import { useTheme } from "@mui/system";
import { AlertDialog } from "../../molecules/AlertDialog/AlertDialog";
import { setAlert } from "../../store/alertSlice";

export const AddRoutine = () => {
  const theme = useTheme();
  const { addRoutine } = useRoutines();
  const routine = useSelector(routineSelector);
  const dispatch = useDispatch();
  const [openExerciseList, setOpenExerciseList] = useState(false);

  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (routine) {
      setExercises(routine.exercises || []);
    }
    return () => {};
  }, [routine]);

  const formik = useFormik({
    initialValues: {
      name: routine?.name || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Routine title is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      if (routine?.active) {
        dispatch(
          setAlert({
            title: "Routine is in progress",
            message:
              "Please finish or discard your current workout before updating",
            open: true,
          })
        );
        formik.setSubmitting(false);
      } else {
        addRoutine({
          ...routine,
          name: values.name,
          exercises,
        }).then((doc) => {
          setExercises([]);
          resetForm();
          navigate("/");
        });
      }
    },
  });

  const onAddExercise = (exercise: Exercise) => {
    if (exercises.filter((e) => e.name === exercise.name).length > 0) return;

    const routineExercise: RoutineExercise = {
      ...exercise,
      index: exercises.length,
    };
    setExercises((exs) => [...exs, routineExercise]);
    setOpenExerciseList(false);
  };

  const onDeleteExercise = (exercise: RoutineExercise) => {
    setExercises((exs) => exs.filter((e) => e.name != exercise.name));
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    // dropped outside the list
    if (!destination) return;
    const reorderedList = reorder(exercises, source.index, destination.index);
    setExercises(reorderedList);
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <Box sx={{ my: 3 }}>
          <Typography color="textPrimary" variant="h4">
            {routine?.id ? "Edit" : "Create"} Routine
          </Typography>
          <Typography color="textSecondary" gutterBottom variant="body2">
            Fill in the information below to get started
          </Typography>
        </Box>
        <Box>
          <Fade
            in={true}
            timeout={200}
            style={{
              transitionDelay: `100ms`,
            }}
            unmountOnExit
          >
            <Stack
              direction="row"
              sx={{ justifyContent: "center", alignItems: "center" }}
              spacing={2}
            >
              <FrontDiagram
                highlights={Array.from(
                  new Set(exercises.flatMap((e) => e.primaryMuscles || ""))
                )}
                // secondaryHighlights={Array.from(
                //   new Set(exercises.flatMap((e) => e.secondaryMuscles || ""))
                // )}
                secondaryHighlights={[]}
                style={{
                  fontSize: "12em",
                  maxWidth: 120,
                  color: theme.palette.text.secondary,
                  fill: theme.palette.text.secondary,
                }}
              />
              <BackDiagram
                highlights={Array.from(
                  new Set(exercises.flatMap((e) => e.primaryMuscles || ""))
                )}
                // secondaryHighlights={Array.from(
                //   new Set(exercises.flatMap((e) => e.secondaryMuscles || ""))
                // )}
                secondaryHighlights={[]}
                style={{
                  fontSize: "12em",
                  maxWidth: 120,
                  color: theme.palette.text.secondary,
                  fill: theme.palette.text.secondary,
                }}
              />
            </Stack>
          </Fade>
        </Box>
        <TextField
          error={Boolean(formik.touched.name && formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
          label="title"
          margin="normal"
          name="name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="text"
          value={formik.values.name}
          variant="filled"
        />
        {/* <List dense={true}>
          {exercises.map((exercise: Exercise) => (
            <ListItem
              key={exercise.name}
              secondaryAction={
                <IconButton
                  onClick={() => onDeleteExercise(exercise)}
                  edge="end"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <EquipmentIcon
                    style={{ fontSize: "25px" }}
                    icon={exercise.equipment}
                  />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={exercise.name} />
            </ListItem>
          ))}
        </List> */}
        <DraggableList
          onDeleteExercise={onDeleteExercise}
          exercises={exercises}
          onDragEnd={onDragEnd}
        />
        <Box sx={{ py: 2 }}>
          <Button
            color="warning"
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="button"
            variant="text"
            onClick={() => setOpenExerciseList(true)}
            endIcon={<AddCircleSharpIcon />}
          >
            Add Exercise
          </Button>
        </Box>
        <Box sx={{ py: 2 }}>
          <Button
            color="primary"
            disabled={formik.isSubmitting}
            size="large"
            type="submit"
            variant="outlined"
          >
            Save Routine
          </Button>
        </Box>
      </form>
      <ModalDialog
        closeButton={true}
        title={"Select Exercise"}
        open={openExerciseList}
        setOpen={setOpenExerciseList}
      >
        <ExercisesList onSelectExercise={onAddExercise} />
      </ModalDialog>
    </Container>
  );
};
