import {
  Container,
  Divider,
  Fade,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import { Box } from "@mui/system";
import React, { FC } from "react";
import { BackDiagram, backHighlights } from "../../icons/backDiagram";
import { FrontDiagram, frontHighlights } from "../../icons/frontDiagram";
import { RoutineExercise } from "../../types/exercise";

export const ExerciseDetails: FC<Props> = ({ exercise }) => {
  const ommitedProps = ["instructions", "name", "index", "active"];
  const theme = useTheme();

  const diagramStyle = {
    maxWidth: 100,
    color: theme.palette.text.secondary,
    fill: theme.palette.text.secondary,
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

      <Box sx={{ p: 2 }}>
        <Typography color="textPrimary" variant="body2">
          {exercise.instructions}
        </Typography>
      </Box>
      <Divider />

      <TableContainer sx={{ my: 2 }} component={Paper}>
        <Table aria-label="exercise table" size="small">
          <TableBody>
            {Object.entries(exercise).map(
              (entry) =>
                !ommitedProps.includes(entry[0]) &&
                entry[1] != "" && (
                  <TableRow
                    key={entry[0]}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {entry[0]}
                    </TableCell>
                    <TableCell align="right">{entry[1]}</TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  ) : (
    <></>
  );
};

interface Props {
  exercise?: RoutineExercise;
}
