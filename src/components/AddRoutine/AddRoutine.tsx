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
import { MuscleDiagrams } from "./partials/MuscleDiagrams";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import { RoutineGenerator } from "./RoutineGenerator";

export const AddRoutine = () => {
  const theme = useTheme();
  const { addRoutine } = useRoutines();
  const routine = useSelector(routineSelector) || {};
  const dispatch = useDispatch();
  const [openExerciseList, setOpenExerciseList] = useState(false);
  const [openRoutineGenerator, setOpenRoutineGenerator] = useState(false);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<
    string[] | undefined
  >();

  const [exercises, setExercises] = useState<RoutineExercise[]>([
    ...Array.from(routine?.exercises || []),
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setRoutine({ ...routine, exercises }));
    return () => {};
  }, [exercises]);

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
          discardForm();
        });
      }
    },
  });

  const discardForm = () => {
    setExercises([]);
    formik.resetForm();
    dispatch(setRoutine(undefined));
    navigate("/");
  };

  const addExercise = (exercise: Exercise) => {
    if (exercises.filter((e) => e.name === exercise.name).length > 0) return;

    const routineExercise: RoutineExercise = {
      ...exercise,
      index: exercises.length,
    };
    setExercises((exs) => [...exs, routineExercise]);
  };

  const onAddExercise = (exercise: Exercise) => {
    addExercise(exercise);
    setSelectedMuscleGroups(undefined);
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

  useEffect(() => {
    if (selectedMuscleGroups) {
      setOpenExerciseList(true);
    }
  }, [selectedMuscleGroups]);

  const onMuscleGroupClick: React.MouseEventHandler<SVGGElement> = (e) => {
    const parentElement = (e.target as Element).parentElement;
    if (!parentElement || parentElement.nodeName !== "g") return;
    const groupName = parentElement.dataset["name"] || parentElement.id;
    if (selectedMuscleGroups?.includes(groupName)) {
      setSelectedMuscleGroups(undefined);
    } else {
      setSelectedMuscleGroups([groupName]);
    }
  };

  const onFinishGenerateRoutine = (exercises: Exercise[]) => {
    exercises.forEach((e) => addExercise(e));

    setSelectedMuscleGroups(undefined);
    setOpenRoutineGenerator(false);
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
          <MuscleDiagrams
            highlights={Array.from(
              new Set(exercises.flatMap((e) => e.primaryMuscles || ""))
            )}
            secondaryHighlights={selectedMuscleGroups || []}
            isClickable={true}
            onMuscleGroupClick={onMuscleGroupClick}
          />
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
        <DraggableList
          onDeleteExercise={onDeleteExercise}
          exercises={exercises}
          onDragEnd={onDragEnd}
        />
        <Box sx={{ py: 1 }}>
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
          <Button
            color="secondary"
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="button"
            variant="text"
            onClick={() => setOpenRoutineGenerator(true)}
            endIcon={<SettingsSuggestIcon />}
          >
            Generate Exercises
          </Button>
        </Box>
        <Box>
          <Button
            color="primary"
            disabled={formik.isSubmitting}
            size="large"
            type="submit"
            variant="outlined"
            sx={{ m: 1, mb: 2 }}
          >
            Save Routine
          </Button>
          <Button
            color="secondary"
            disabled={formik.isSubmitting}
            size="large"
            type="button"
            onClick={discardForm}
            variant="outlined"
            sx={{ m: 1, mb: 2 }}
          >
            Discard
          </Button>
        </Box>
      </form>
      <ModalDialog
        closeButton={true}
        title={"Exercises Generator"}
        open={openRoutineGenerator}
        setOpen={setOpenRoutineGenerator}
      >
        <RoutineGenerator onFinish={onFinishGenerateRoutine} />
      </ModalDialog>
      <ModalDialog
        closeButton={true}
        title={"Select Exercise"}
        open={openExerciseList}
        setOpen={setOpenExerciseList}
      >
        <ExercisesList
          onSelectExercise={onAddExercise}
          muscleGroups={selectedMuscleGroups}
        />
      </ModalDialog>
    </Container>
  );
};
