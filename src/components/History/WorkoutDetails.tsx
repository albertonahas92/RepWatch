import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  ListItemText,
  Divider,
  Button,
  Box,
  Alert,
  Chip,
} from "@mui/material";
import React, { FC, useMemo } from "react";
import { RoutineHistory, Workout } from "../../types/routine";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { userSelector } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setRoutine } from "../../store/routineSlice";
import EditIcon from "@mui/icons-material/Edit";
import { typography } from "@mui/system";
import { getSetRPM } from "../../utils/utils";
import { historySelector } from "../../store/historySlice";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

export const WorkoutDetails: FC<Props> = ({ routine, historicalId }) => {
  const user = useSelector(userSelector);
  const history = useSelector(historySelector);
  const dispatch = useDispatch();

  const unit = useMemo(
    () => (user?.unit === "imperial" ? "lbs" : "kg"),
    [user]
  );

  const onEditWorkout = () => {
    if (routine) {
      dispatch(
        setRoutine({
          ...routine,
          active: true,
          historicalId: historicalId,
        })
      );
    }
  };

  return (
    <Box>
      {/* <Typography variant="body1">{routine?.name}</Typography> */}
      <Typography variant="caption">
        {routine?.finishedAt?.toDate().toLocaleString()}
      </Typography>
      <List>
        {routine?.exercises
          ?.filter((e) => e.sets?.length)
          .map((exercise, i) => {
            const prevRPM = Math.max(
              ...(history
                ?.filter((h) => h.id !== routine.id)
                .flatMap((h) => h.routine.exercises)
                .filter((e) => e?.name === exercise.name)
                .flatMap((e) => e?.sets)
                .map((s) => getSetRPM(s) || 0) || [0])
            );

            return (
              <React.Fragment key={i}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>
                      <Typography
                        component="span"
                        sx={{ fontWeight: "light" }}
                        variant="body2"
                      >
                        {exercise.sets?.length}
                      </Typography>
                      <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <>
                        <Typography
                          color="text.primary"
                          component="h5"
                          variant="body1"
                        >
                          {exercise?.name}
                        </Typography>
                      </>
                    }
                    secondary={
                      <React.Fragment>
                        {exercise.sets?.map((s, i) => (
                          <Typography
                            sx={{ fontSize: 14 }}
                            component="div"
                            variant="body2"
                            color="text.primary"
                          >
                            <Chip
                              label={`Set ${i + 1}`}
                              color="primary"
                              variant="filled"
                              size="small"
                              // icon={<CheckCircleOutlinedIcon />}
                              sx={{ my: 0.4, mr: 1 }}
                            />
                            {s.reps}{" "}
                            {!!s.weight && (
                              <span style={{ marginRight: 8 }}>
                                x {s.weight}
                                {unit}
                              </span>
                            )}
                            {/* {s.weight && ` - 1RM ${getSetRPM(s)} ${unit}`} */}
                            {getSetRPM(s) > prevRPM && (
                              <Chip
                                label={`New 1RM! ${getSetRPM(s)}${unit}`}
                                color="success"
                                variant="outlined"
                                size="small"
                                // icon={<CheckCircleOutlinedIcon />}
                                sx={{ my: 0.2 }}
                              />
                            )}
                          </Typography>
                        ))}

                        {/* <Typography
                color="text.secondary"
                component="span"
                sx={{ display: "inline-block" }}
                variant="body2"
                >
                {Math.round(
                  moment.duration(routine.duration || 0).asMinutes()
                )}{" "}
                minutes
              </Typography> */}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            );
          })}
      </List>
      {historicalId && (
        <Button
          color="secondary"
          fullWidth
          size="medium"
          type="button"
          variant="outlined"
          onClick={onEditWorkout}
          sx={{ my: 1 }}
          endIcon={<EditIcon />}
        >
          Edit
        </Button>
      )}
    </Box>
  );
};

interface Props {
  routine?: Workout;
  historicalId?: string;
}
