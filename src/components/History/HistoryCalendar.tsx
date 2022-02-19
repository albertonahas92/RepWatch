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
import PickersDay, { PickersDayProps } from "@mui/lab/PickersDay";
import endOfWeek from "date-fns/endOfWeek";
import isSameDay from "date-fns/isSameDay";
import isWithinInterval from "date-fns/isWithinInterval";
import startOfWeek from "date-fns/startOfWeek";
import { RoutineHistory } from "../../types/routine";
import { compareDates } from "../../utils/utils";
import ModalDialog from "../../molecules/ModalDialog/ModalDialog";
import { WorkoutDetails } from "./WorkoutDetails";
import moment from "moment";

const CELL_SIZE = 36;
const HIGHLIGHT_DIFF_SIZE = 6;

type CustomPickerDayProps = PickersDayProps<Date> & {
  istrainingday: boolean;
};

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== "istrainingday",
})<CustomPickerDayProps>(({ theme, istrainingday }) => ({
  ...(istrainingday && {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    width: CELL_SIZE - HIGHLIGHT_DIFF_SIZE,
    height: CELL_SIZE - HIGHLIGHT_DIFF_SIZE,
    margin: HIGHLIGHT_DIFF_SIZE / 2,

    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
})) as React.ComponentType<CustomPickerDayProps>;

export const HistoryCalendar: React.FC<Props> = ({ history }) => {
  const [value, setValue] = React.useState<Date | null>(new Date());
  const [allowModal, setAllowModal] = React.useState<boolean>(false);
  const [openWorkoutsModal, setOpenWorkoutsModal] =
    React.useState<boolean>(false);
  const workouts = React.useMemo(() => {
    return history?.filter((h) => {
      return (
        h.routine.finishedAt &&
        compareDates(h.routine.finishedAt.toDate(), value || undefined)
      );
    });
  }, [value, history]);

  React.useEffect(() => {
    setOpenWorkoutsModal(!!workouts?.length);
  }, [workouts]);

  const historyDates = React.useMemo(() => {
    const datesList = history?.map((h) => {
      return { date: h.routine.finishedAt?.toDate(), name: h.routine.name };
    });
    return datesList;
  }, [history]);

  const renderWeekPickerDay = (
    date: Date,
    selectedDates: Array<Date | null>,
    pickersDayProps: PickersDayProps<Date>
  ) => {
    const workouts = historyDates?.filter(
      (d) => d && compareDates(d.date, date)
    );
    const istrainingday = !!workouts?.length;
    return (
      <Stack>
        <CustomPickersDay
          istrainingday={istrainingday}
          {...pickersDayProps}
          disableMargin
        />
        {istrainingday && (
          <Typography
            component="small"
            color="primary"
            sx={{
              fontSize: 12,
              whiteSpace: 'nowrap',
              maxWidth: 35,
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            variant="body2"
          >
            {workouts[0].name}
          </Typography>
        )}
      </Stack>
    );
  };

  const onChangeDate = (newValue: any) => {
    setValue(newValue);
    setAllowModal(true);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          label="History Calendar"
          value={value}
          onChange={onChangeDate}
          renderDay={renderWeekPickerDay}
          renderInput={(params) => <TextField {...params} />}
          inputFormat="'Week of' MMM d"
        />
      </LocalizationProvider>
      <ModalDialog
        closeButton={true}
        open={openWorkoutsModal && allowModal}
        setOpen={(open) => {
          setOpenWorkoutsModal(open);
        }}
        title={`${moment(value || new Date()).format("ddd Do")} Workout`}
      >
        <>
          {workouts?.map((w) => (
            <WorkoutDetails routine={w.routine} historicalId={w.id} />
          ))}
        </>
      </ModalDialog>
    </>
  );
};

interface Props {
  history?: RoutineHistory[];
}
