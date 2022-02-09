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
} from "@mui/material";
import React from "react";
import { RoutineHistory } from "../../types/routine";
import * as moment from "moment";
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

const Label = styled("span")(({ theme }) => ({
  background: theme.palette.action.hover,
  margin: "4px 0",
  marginRight: "8px",
  padding: "2px 8px",
  borderRadius: "12px",
  display: "inline-block",
}));

export const HistoryList: React.FC<Props> = ({ history }) => {
  return (
    <List sx={{ bgcolor: "background.paper" }}>
      {history?.map(({ routine }) => (
        <>
          <ListItem
            alignItems="flex-start"
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <MoreHorizOutlinedIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Typography color="text.secondary" variant="h6">
                {moment(routine.finishedAt?.toDate()).format(
                  "Do"
                )}
              </Typography>
              <Typography color="text.secondary">
                {moment(routine.finishedAt?.toDate()).format(
                  "MMM"
                )}
              </Typography>
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <Typography color="text.primary" variant="h6">
                    {routine?.name}
                  </Typography>
                </>
              }
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: "inline", fontSize:12 }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {routine.exercises?.map(
                      (e) =>
                        e.sets?.length && (
                          <Label>
                            {e.sets?.length} x {e.name}
                          </Label>
                        )
                    )}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {Math.round(
                      moment.duration(routine.duration || 0).asMinutes()
                    )}{" "}
                    minutes
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </>
      ))}
    </List>
  );
};

interface Props {
  history?: RoutineHistory[];
}
