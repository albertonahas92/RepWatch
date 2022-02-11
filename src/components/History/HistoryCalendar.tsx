import * as React from "react";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {
  Container,
  Box,
  Stack,
  Typography,
  CardContent,
  Card,
  CardActionArea,
  CardMedia,
  CardActions,
  Grid,
  Button,
  IconButton,
  Divider,
  Tooltip,
  Avatar,
} from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import StaticDatePicker from "@mui/lab/StaticDatePicker";
import PickersDay from "@mui/lab/PickersDay";
import endOfWeek from "date-fns/endOfWeek";
import isSameDay from "date-fns/isSameDay";
import isWithinInterval from "date-fns/isWithinInterval";
import startOfWeek from "date-fns/startOfWeek";
import { RoutineHistory } from "../../types/routine";

// const CustomPickersDay = styled(PickersDay, {
//   shouldForwardProp: (prop) =>
//     prop !== "dayIsBetween" && prop !== "isFirstDay" && prop !== "isLastDay",
// })<CustomPickerDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
//   ...(dayIsBetween && {
//     borderRadius: 0,
//     backgroundColor: theme.palette.primary.main,
//     color: theme.palette.common.white,
//     "&:hover, &:focus": {
//       backgroundColor: theme.palette.primary.dark,
//     },
//   }),
//   ...(isFirstDay && {
//     borderTopLeftRadius: "50%",
//     borderBottomLeftRadius: "50%",
//   }),
//   ...(isLastDay && {
//     borderTopRightRadius: "50%",
//     borderBottomRightRadius: "50%",
//   }),
// })) as React.ComponentType<CustomPickerDayProps>;

export const HistoryCalendar: React.FC<Props> = (props) => {
  const [value, setValue] = React.useState<Date | null>(new Date());

  // const renderWeekPickerDay = (
  //   date: any,
  //   selectedDates: Array<Date | null>,
  //   props: any
  // ) => {
  //   return <PickersDay {...props} disableMargin />;
  // };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        label="History Calendar"
        value={value}
        onChange={(newValue: any) => {
          setValue(newValue);
        }}
        // renderDay={renderWeekPickerDay}
        renderInput={(params) => <TextField {...params} />}
        inputFormat="'Week of' MMM d"
      />
    </LocalizationProvider>
  );
};

interface Props {
  history?: RoutineHistory[];
}
