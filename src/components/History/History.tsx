import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { historySelector } from "../../store/historySlice";
import { RoutineHistory } from "../../types/routine";
import { HistoryCalendar } from "./HistoryCalendar";
import { HistoryList } from "./HistoryList";

export const History = () => {
  const history = useSelector(historySelector);
  const [tab, setTab] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        pt: 3,
        pb: 6,
        height: "100%",
        flexGrow: 1,
      }}
    >
      <Container>
        <Typography
          component="h5"
          variant="h5"
          align="center"
          color="text.primary"
          gutterBottom
        >
          History
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="List" />
            <Tab label="Calendar" />
          </Tabs>
        </Box>
        <TabPanel value={tab} index={0}>
          <HistoryList history={history} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Box
            sx={{
              "& .MuiCalendarPicker-root": {
                color: "text.primary",
              },
              "& .PrivatePickersToolbar-root": {
                color: "text.primary",
              },
            }}
          >
            <HistoryCalendar history={history} />
          </Box>
        </TabPanel>
      </Container>
    </Box>
  );
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}
