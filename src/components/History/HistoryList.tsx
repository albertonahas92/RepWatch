import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  styled,
  IconButton,
  MenuItem,
  Button,
  ListItemButton,
} from "@mui/material";
import React, { MouseEvent, useState } from "react";
import { Routine, RoutineHistory } from "../../types/routine";
import * as moment from "moment";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";
import { StyledMenu } from "../TopBar/TopBar";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import { useDispatch } from "react-redux";
import { setRoutine } from "../../store/routineSlice";
import { useNavigate } from "react-router-dom";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ModalDialog from "../../molecules/ModalDialog/ModalDialog";
import { WorkoutDetails } from "./WorkoutDetails";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const Label = styled("span")(({ theme }) => ({
  background: theme.palette.action.hover,
  margin: "4px 0",
  marginRight: "8px",
  padding: "2px 8px",
  borderRadius: "12px",
  display: "inline-block",
}));

const TimeLabel = styled("span")(({ theme }) => ({
  display: "block",
}));

export const HistoryList: React.FC<Props> = ({ history }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCount, setShowCount] = useState(10);

  const [openWorkoutModal, setOpenWorkoutModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [routine, setCurrentRoutine] = useState<RoutineHistory>();

  const open = Boolean(anchorEl);

  const handleRoutineMenuClick = (
    event: MouseEvent,
    routine: RoutineHistory
  ) => {
    setAnchorEl(event.currentTarget);
    if (routine) {
      setCurrentRoutine(routine);
    }
  };
  const handleRoutineMenuClose = () => {
    setAnchorEl(null);
    setCurrentRoutine(undefined);
  };

  const onSaveAsRoutine = () => {
    if (routine) {
      dispatch(setRoutine(routine.routine));
      navigate("/routine");
    }
  };

  const onEditWorkout = () => {
    if (routine) {
      dispatch(
        setRoutine({
          ...routine.routine,
          active: true,
          historicalId: routine.id,
        })
      );
    }
  };

  const showMore = () => {
    setShowCount((sc) => sc + 5);
  };

  return (
    <>
      <List sx={{ bgcolor: "background.paper" }}>
        {history
          ?.filter((el, idx) => idx < showCount)
          .map((history, i) => {
            const { routine } = history;
            return (
              <React.Fragment key={i}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton
                      onClick={(event: MouseEvent) =>
                        handleRoutineMenuClick(event, history)
                      }
                      edge="end"
                      aria-label="delete"
                    >
                      <MoreHorizOutlinedIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => {
                      setOpenWorkoutModal(true);
                      setCurrentRoutine(history);
                    }}
                  >
                    <ListItemAvatar>
                      <Typography
                        color="text.secondary"
                        variant="h6"
                        sx={{ fontWeight: "light", fontSize: 16 }}
                      >
                        {moment(routine.finishedAt?.toDate()).format("Do")}
                      </Typography>
                      <Typography color="text.secondary">
                        {moment(routine.finishedAt?.toDate()).format("MMM")}
                      </Typography>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <>
                          <Typography
                            color="text.primary"
                            component="h5"
                            variant="body1"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {routine?.name}
                          </Typography>
                        </>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline", fontSize: 12 }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {routine.exercises?.map(
                              (e) =>
                                !!e.sets?.length && (
                                  <Label key={e.name}>
                                    {e.sets?.length} x {e.name}
                                  </Label>
                                )
                            )}
                          </Typography>
                          <Typography
                            color="text.secondary"
                            component={TimeLabel}
                            variant="body2"
                          >
                            {Math.round(
                              moment.duration(routine.duration || 0).asMinutes()
                            )}{" "}
                            minutes
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            );
          })}
      </List>
      {showCount < (history?.length || 0) && (
        <Button
          onClick={showMore}
          variant="text"
          endIcon={<ExpandMoreOutlinedIcon />}
        >
          Show more
        </Button>
      )}
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
            onSaveAsRoutine();
          }}
        >
          <LibraryAddOutlinedIcon />
          Save as routine
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleRoutineMenuClose();
            onEditWorkout();
          }}
        >
          <EditOutlinedIcon />
          Edit workout
        </MenuItem>
      </StyledMenu>
      <ModalDialog
        closeButton={true}
        open={openWorkoutModal}
        setOpen={(open) => {
          setOpenWorkoutModal(open);
          if (!open) {
            setCurrentRoutine(undefined);
          }
        }}
        title={routine?.routine?.name}
      >
        <WorkoutDetails routine={routine?.routine} historicalId={routine?.id} />
      </ModalDialog>
    </>
  );
};

interface Props {
  history?: RoutineHistory[];
}
