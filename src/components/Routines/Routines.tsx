import React, { useEffect, useState, MouseEvent } from "react";
import firebase from "../../config";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Fab,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import { routineSelector, setRoutine } from "../../store/routineSlice";
import { Routine } from "../../types/routine";
import { userSelector } from "../../store/userSlice";
import EditIcon from "@mui/icons-material/Edit";
import "./Routine.css";
import { StyledMenu } from "../TopBar/TopBar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRoutines } from "../../hooks/useRoutines";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { WorkoutSummary } from "../Workout/WorkoutSummary";
import { historySelector } from "../../store/historySlice";
import { omitSetKeys, Set } from "../../types/exercise";
import _ from "lodash";
import { setAlert } from "../../store/alertSlice";

export const Routines = () => {
  const user = useSelector(userSelector);
  const history = useSelector(historySelector);
  const currentRoutine = useSelector(routineSelector);
  const { deleteRoutine, addRoutine } = useRoutines();

  const [routines, setRoutines] = useState<any[]>([]);
  const [loadingRoutines, setLoadingRoutines] = useState<boolean>(true);
  const [routine, setCurrentRoutine] = useState<Routine>();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const open = Boolean(anchorEl);

  const handleRoutineMenuClick = (event: MouseEvent, routine: Routine) => {
    setAnchorEl(event.currentTarget);
    setCurrentRoutine(routine);
  };
  const handleRoutineMenuClose = () => {
    setAnchorEl(null);
    setCurrentRoutine(undefined);
  };

  const createRoutine = () => {
    navigate("/routine");
  };

  const onEditRoutine = () => {
    if (!routine) {
      return;
    }
    if (currentRoutine?.active) {
      dispatch(
        setAlert({
          title: "You have a workout in progress",
          message:
            "Please finish or discard your current workout before editing",
          open: true,
        })
      );
      return;
    }
    dispatch(setRoutine(routine));
    navigate("/routine");
  };

  const onDeleteRoutine = () => {
    if (!routine) {
      return;
    }
    deleteRoutine(routine.id);
  };

  const onDuplicateRoutine = () => {
    if (!routine) {
      return;
    }
    const duplicate = { ...routine };
    delete duplicate.id;
    addRoutine(duplicate);
  };

  const startWorkout = (routine: Routine) => {
    if (routine?.exercises && routine?.exercises.length > 0) {
      routine.exercises[0].active = true;
    }
    const exercises = routine.exercises?.map((e) => {
      return {
        ...e,
        sets: history
          ?.flatMap((h) => h.routine.exercises)
          .find((he) => he?.name === e.name)
          ?.sets?.map((s) => _.omit(s, omitSetKeys) as Set),
      };
    });
    dispatch(
      setRoutine({ ...routine, active: true, startedAt: new Date(), exercises })
    );
  };

  const displayRoutines = () => {
    return routines.map((r: any) => {
      const routine: Routine = { ...r.data(), id: r.id };
      return (
        <Grid key={r.id} item md={4} xs={12}>
          <Card key={routine.name} variant={"outlined"}>
            <CardHeader
              avatar={
                <Avatar>
                  {routine.name ? routine.name[0].toUpperCase() : ""}
                </Avatar>
              }
              title={
                <Typography
                  sx={{ fontSize: 16, textTransform: "capitalize" }}
                  color="text.secondary"
                  gutterBottom
                >
                  {routine.name}
                </Typography>
              }
              className="RoutineHeader"
              // subheader="Card sub heading"
              action={
                <IconButton
                  onClick={(event: MouseEvent) =>
                    handleRoutineMenuClick(event, routine)
                  }
                  aria-label="options"
                  size="small"
                  className="RoutineAction"
                >
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <Typography
                color="secondary"
                className="RoutineDescription"
                variant="body2"
              >
                {routine.exercises?.map((e) => e.name).join()}
              </Typography>
              {/* <Typography
                color="secondary"
                className="RoutineDescription"
                variant="body2"
              >
                {history
                  ?.find((he) => he?.routine.name === routine?.name)
                  ?.routine.finishedAt?.toDate()
                  .toLocaleString()}
              </Typography> */}
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button onClick={() => startWorkout(routine)} size="small">
                Start workout
              </Button>
            </CardActions>
          </Card>
        </Grid>
      );
    });
  };

  useEffect(() => {
    if (!user) {
      return;
    }
    const unsubscribe = firebase
      .firestore()
      .collection(`users/${user.uid}/routines`)
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot: any) => {
        let routinesArr: any[] = [];
        querySnapshot.forEach((doc: any) => {
          // doc.data() is never undefined for query doc snapshots
          routinesArr.push(doc);
        });
        setRoutines(routinesArr);
        setLoadingRoutines(false);
      });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <div className="HomeWrapper">
      <main>
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 3,
            pb: 6,
            height: "100%",
            flexGrow: 1,
          }}
        >
          <Container maxWidth="md">
            <Typography
              component="h4"
              variant="h4"
              align="center"
              color="text.primary"
              gutterBottom
            >
              My Routines
            </Typography>
            <Button
              onClick={() => startWorkout({})}
              variant="outlined"
              sx={{ my: 1 }}
              endIcon={<AddCircleSharpIcon />}
            >
              Start an empty workout
            </Button>
            <Grid sx={{ p: 2 }} spacing={2} justifyContent="center" container>
              {routines.length
                ? displayRoutines()
                : loadingRoutines && <CircularProgress />}
            </Grid>
            <Stack
              sx={{ pt: 2 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                onClick={createRoutine}
                variant="outlined"
                endIcon={<AddCircleSharpIcon />}
              >
                Create New Routine
              </Button>
            </Stack>
          </Container>
          <StyledMenu
            id="routine-menu"
            MenuListProps={{
              "aria-labelledby": "routine-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleRoutineMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleRoutineMenuClose();
                onDuplicateRoutine();
              }}
            >
              <ContentCopyIcon />
              Duplicate
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleRoutineMenuClose();
                onEditRoutine();
              }}
            >
              <EditIcon />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleRoutineMenuClose();
                onDeleteRoutine();
              }}
            >
              <DeleteIcon />
              Delete
            </MenuItem>
          </StyledMenu>
        </Box>
      </main>
    </div>
  );
};
