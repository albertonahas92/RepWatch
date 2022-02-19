import {
  Box,
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@mui/material";
import React, { FC } from "react";
import { EquipmentIcon } from "../../icons/equipment/EquipmentIcon";
import { RoutineExercise } from "../../types/exercise";
import { Routine } from "../../types/routine";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useDispatch } from "react-redux";
import { setExercise, setExerciseModal } from "../../store/exerciseSlice";

export const RoutineDetails: FC<Props> = ({ routine }) => {
  const dispatch = useDispatch();
  const onInfoClick = (exericse: RoutineExercise) => {
    dispatch(setExercise(exericse));
    dispatch(setExerciseModal(true));
  };

  return (
    <Box>
      <List dense={true}>
        {routine?.exercises?.map((exercise: RoutineExercise) => {
          return (
            <React.Fragment key={exercise.name}>
              <ListItem
                sx={{ pl: { xs: 0 } }}
                secondaryAction={
                  <IconButton
                    onClick={() => onInfoClick(exercise as RoutineExercise)}
                    aria-label="delete"
                  >
                    <InfoOutlinedIcon />
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
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

interface Props {
  routine?: Routine;
}
