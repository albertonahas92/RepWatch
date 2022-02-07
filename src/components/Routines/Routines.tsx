import React, { useEffect, useState, MouseEvent } from "react";
import firebase from "../../config";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
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

export const Routines = () => {
  const user = useSelector(userSelector);
  const currentRoutine = useSelector(routineSelector);
  const { deleteRoutine } = useRoutines();

  const [routines, setRoutines] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const open = Boolean(anchorEl);

  const handleRoutineMenuClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRoutineMenuClose = () => {
    setAnchorEl(null);
  };

  const createRoutine = () => {
    navigate("/routine");
  };

  const onEditRoutine = (routine: Routine) => {
    dispatch(setRoutine(routine));
    navigate("/routine");
  };

  const onDeleteRoutine = (routine: Routine) => {
    deleteRoutine(routine.id);
  };

  const startWorkout = (routine: Routine) => {
    dispatch(setRoutine({ ...routine, active: true }));
  };

  const displayRoutines = () => {
    return routines.map((r: any) => {
      const routine: Routine = { ...r.data(), id: r.id };
      return (
        <Grid item md={4} xs={12}>
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
                  onClick={handleRoutineMenuClick}
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
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button onClick={() => startWorkout(routine)} size="small">
                Start workout
              </Button>
            </CardActions>
          </Card>
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
                onEditRoutine(routine);
              }}
            >
              <EditIcon />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleRoutineMenuClose();
                onDeleteRoutine(routine);
              }}
            >
              <DeleteIcon />
              Delete
            </MenuItem>
          </StyledMenu>
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
            pt: 6,
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
            <Grid sx={{ pt: 4 }} spacing={2} justifyContent="center" container>
              {displayRoutines()}
            </Grid>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button
                onClick={createRoutine}
                variant="outlined"
                endIcon={<AddCircleSharpIcon />}
              >
                Create new
              </Button>
            </Stack>
          </Container>
        </Box>
      </main>
    </div>
  );
};
