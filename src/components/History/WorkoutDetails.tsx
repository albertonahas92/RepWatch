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

export const WorkoutDetails: FC<Props> = ({ routine, historicalId }) => {
  const user = useSelector(userSelector);
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
        {routine?.exercises?.map((exercise, i) => (
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
                        sx={{ fontSize: 12 }}
                        component="div"
                        variant="body2"
                        color="text.primary"
                      >
                        <strong>Set {i + 1}</strong> - {s.reps} x {s.weight}{" "}
                        {unit}
                        {/* {s.weight && ` - 1RPM ${getSetRPM(s)} ${unit}`} */}
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
        ))}
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
