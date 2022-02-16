import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Typography,
  ListItemText,
  Divider,
} from "@mui/material";
import React, { FC } from "react";
import { RoutineHistory, Workout } from "../../types/routine";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { userSelector } from "../../store/userSlice";
import { useSelector } from "react-redux";

export const WorkoutDetails: FC<Props> = ({ routine }) => {
  const user = useSelector(userSelector);

  return (
    <List sx={{ bgcolor: "background.paper" }}>
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
                      {user?.unit === "imperial" ? "lbs" : "kg"}
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
  );
};

interface Props {
  routine?: Workout;
}
