import {
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  styled,
  ListItemIcon,
  Typography,
} from "@mui/material";
import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import { EquipmentIcon } from "../../../icons/equipment/EquipmentIcon";
import { RoutineExercise } from "../../../types/exercise";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useDispatch } from "react-redux";
import { setExercise, setExerciseModal } from "../../../store/exerciseSlice";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "isDragging",
})<{ isDragging?: boolean }>(({ theme, isDragging }) => ({
  background: isDragging ? "#efefef" : "inherit",
}));

export type DraggableListItemProps = {
  exercise: RoutineExercise;
  index: number;
  onDeleteExercise: (exercise: RoutineExercise) => void;
};

const DraggableListItem = ({
  exercise,
  index,
  onDeleteExercise,
}: DraggableListItemProps) => {
  const dispatch = useDispatch();
  const onInfoClick = (exericse: RoutineExercise) => {
    dispatch(setExercise(exericse));
    dispatch(setExerciseModal(true));
  };

  return (
    <Draggable draggableId={exercise.name} index={index}>
      {(provided, snapshot: any) => (
        <StyledListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
          sx={{ pl: 0 }}
          secondaryAction={
            <>
              <IconButton
                onClick={() => onInfoClick(exercise as RoutineExercise)}
                aria-label="delete"
              >
                <InfoOutlinedIcon />
              </IconButton>
              <IconButton
                onClick={() => onDeleteExercise(exercise)}
                edge="end"
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </>
          }
        >
          <ListItemIcon sx={{ minWidth: 30 }}>
            <DragIndicatorIcon color="secondary" />
          </ListItemIcon>
          <ListItemAvatar>
            <Avatar>
              <EquipmentIcon
                style={{ fontSize: "25px" }}
                icon={exercise.equipment}
              />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{ color: "text.primary", mr: 4 }}
            primary={
              <Typography variant="body2" component="div">
                {exercise.name}
              </Typography>
            }
          />
        </StyledListItem>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
