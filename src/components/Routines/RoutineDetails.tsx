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

export const RoutineDetails: FC<Props> = ({ routine }) => {
    
  return (
    <Box>
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
              <ListItem sx={{ pl: { xs: 0 } }}>
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
