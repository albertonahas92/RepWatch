import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import HotelIcon from "@mui/icons-material/Hotel";
import RepeatIcon from "@mui/icons-material/Repeat";
import Typography from "@mui/material/Typography";
import { RoutineHistory } from "../../types/routine";
import { EquipmentIcon } from "../../icons/equipment/EquipmentIcon";
import { Avatar } from "@mui/material";
import * as moment from "moment";

export const HistoryTimeline: React.FC<Props> = ({ history }) => {
  return (
    <>
      {history?.map(({ id, routine }) => (
        <Timeline key={id} position="alternate">
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              align="right"
              variant="body2"
              color="text.secondary"
            >
              {/* {routine.finishedAt?.toDate().toLocaleString()} */}
              {/* {moment(routine.finishedAt?.toDate()).format('dd MM, hh:mm')} */}
              {moment(routine.finishedAt?.toDate()).format(
                // "ddd, MMM Do, h:mma"
                "ddd, MMM Do"
              )}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot sx={{ my: '5px' }}>
                <Avatar sx={{ width: 25, height: 25 }}>
                  {routine.name ? routine.name[0].toUpperCase() : ""}
                </Avatar>
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: "12px", px: 2 }}>
              <Typography variant="h6" component="span">
                {routine.name}
              </Typography>
              <Typography variant="body2">
                {/* {routine.duration} */}
                {/* {new Date(routine.duration || 0).toISOString().substr(11, 8)} */}
                {Math.round(moment.duration(routine.duration || 0).asMinutes())}{" "}
                minutes
              </Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      ))}
    </>
  );
};

interface Props {
  history?: RoutineHistory[];
}
