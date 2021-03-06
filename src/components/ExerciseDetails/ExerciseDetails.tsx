import {
  Container,
  Divider,
  Fade,
  Paper,
  Stack,
  Tab,
  tabClasses,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import { Box } from "@mui/system";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import CrossFadeImage from "../../atoms/CrossFadeImage/CrossFadeImage";
import { BackDiagram, backHighlights } from "../../icons/backDiagram";
import { FrontDiagram, frontHighlights } from "../../icons/frontDiagram";
import { historySelector } from "../../store/historySlice";
import { RoutineExercise } from "../../types/exercise";
import { PUBLIC_DOMAIN_URL } from "../../utils/constants";
import { ExerciseInfo } from "./ExerciseInfo";
import { ExerciseReport } from "./ExerciseReport";

export const ExerciseDetails: FC<Props> = ({ exercise }) => {
  const theme = useTheme();

  const history = useSelector(historySelector);

  const exerciseHistory = useMemo(() => {
    return history
      ?.flatMap((h) => h.routine?.exercises)
      .filter((e) => e?.name === exercise?.name && !!e?.sets?.length);
  }, [history, exercise]);

  const [tab, setTab] = useState(0);

  const diagramStyle = {
    fontSize: "11em",
    maxWidth: 100,
    color: theme.palette.text.secondary,
    fill: theme.palette.text.secondary,
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return exercise ? (
    <Box>
      <Box>
        <Fade
          in={true}
          timeout={200}
          style={{
            transitionDelay: `200ms`,
          }}
          unmountOnExit
        >
          <Stack
            direction="row"
            sx={{ justifyContent: "center", alignItems: "center" }}
            spacing={2}
          >
            {frontHighlights.some((h: string) =>
              exercise.primaryMuscles?.includes(h)
            ) && (
              <FrontDiagram
                highlights={exercise.primaryMuscles || []}
                secondaryHighlights={[]}
                style={diagramStyle}
              />
            )}
            {backHighlights.some((h: string) =>
              exercise.primaryMuscles?.includes(h)
            ) && (
              <BackDiagram
                highlights={exercise.primaryMuscles || []}
                secondaryHighlights={[]}
                style={diagramStyle}
              />
            )}
          </Stack>
        </Fade>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab label="Details" />
          <Tab label="Progress" />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <ExerciseInfo exercise={exercise} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {(exerciseHistory?.length || 0) < 2 ? (
          <Typography color="text.secondary" sx={{ p: 2 }}>
            You don't have enough data yet to show the progress, let's go do it!
          </Typography>
        ) : (
          <ExerciseReport exercise={exercise} />
        )}
      </TabPanel>
    </Box>
  ) : (
    <></>
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
      id={`exercise-tabpanel-${index}`}
      aria-labelledby={`exercise-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

interface Props {
  exercise?: RoutineExercise;
}
