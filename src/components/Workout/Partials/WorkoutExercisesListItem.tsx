import {
  ListItem,
  IconButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Collapse,
  List,
  Divider,
  Button,
} from "@mui/material";
import React, { FC, useCallback, useMemo } from "react";
import shortid from "shortid";
import { EquipmentIcon } from "../../../icons/equipment/EquipmentIcon";
import { ESet, RoutineExercise } from "../../../types/exercise";
import { SetForm } from "../SetForm";
import AddCircleSharpIcon from "@mui/icons-material/AddCircleSharp";
import KeyboardArrowRightSharpIcon from "@mui/icons-material/KeyboardArrowRightSharp";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import { useSelector } from "react-redux";
import { historySelector } from "../../../store/historySlice";
import {
  getExercisesHistory,
  sortExercisesHistory,
} from "../../../utils/helpers";
import { useExercises } from "../../../hooks/useExercises";

const WorkoutExercisesListItemComp: FC<Props> = ({
  exercise,
  toggleActive,
  screenSize,
  duplicateSet,
  removeSet,
  addSet,
}) => {
  //   const history = useSelector(historySelector);

  //   const exerciseHistory = useMemo(() => {
  //     const temp = getExercisesHistory(history)
  //       ?.filter((e) => exercises?.find((ex) => ex?.name === e?.exercise?.name))
  //       ?.sort(sortExercisesHistory)
  //       ?.pop();
  //     return temp;
  //   }, [history, exercise.name]);

  return (
    <React.Fragment>
      <ListItem
        sx={{ pl: { xs: 0 } }}
        secondaryAction={
          <IconButton
            onClick={() => {
              toggleActive(exercise);
            }}
            edge="end"
            aria-label="delete"
          >
            {!exercise.active ? (
              <KeyboardArrowRightSharpIcon />
            ) : (
              <RemoveOutlinedIcon />
            )}
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
      <Collapse in={exercise.active} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {exercise.sets?.map((set: ESet, index: number) => (
            <React.Fragment key={set.id || shortid.generate()}>
              <ListItem
                key={set.id || shortid.generate()}
                sx={{ pl: { md: 7, xs: 0 }, pr: 0 }}
              >
                <ListItemText
                  primary={
                    <SetForm
                      index={index}
                      removeSet={removeSet}
                      duplicateSet={duplicateSet}
                      exercise={exercise}
                    />
                  }
                />
              </ListItem>
              {screenSize === "xs" && <Divider />}
            </React.Fragment>
          ))}
        </List>
        <Button
          color="warning"
          // disabled={formik.isSubmitting}
          fullWidth
          size="small"
          type="button"
          variant="text"
          onClick={() => addSet(exercise)}
          endIcon={<AddCircleSharpIcon />}
          sx={{ my: 1 }}
        >
          Add Set
        </Button>
      </Collapse>
    </React.Fragment>
  );
};

interface Props {
  exercise: RoutineExercise;
  screenSize: string;
  toggleActive: (exercise: RoutineExercise) => void;
  duplicateSet: (exercise: RoutineExercise, index: number) => void;
  removeSet: (exercise: RoutineExercise, index: number) => void;
  addSet: (exercise: RoutineExercise) => void;
}

export const WorkoutExercisesListItem = WorkoutExercisesListItemComp;
