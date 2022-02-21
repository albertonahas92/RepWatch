import {
  Box,
  Typography,
  Divider,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import CrossFadeImage from "../../atoms/CrossFadeImage/CrossFadeImage";
import { RoutineExercise } from "../../types/exercise";
import { PUBLIC_DOMAIN_URL } from "../../utils/constants";

export const ExerciseInfo: FC<Props> = ({ exercise }) => {
  const ommitedProps = ["instructions", "name", "index", "active", "sets"];

  const [image, setImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImage((im) => 1 - im);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography color="textPrimary" variant="body2">
          {exercise.instructions}
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <CrossFadeImage
        src={`${PUBLIC_DOMAIN_URL}/${exercise?.name.replaceAll(
          /[ \/]/g,
          "_"
        )}/images/${image}.jpg`}
      />
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
                    <TableCell align="right">
                      {!Array.isArray(entry[1])
                        ? entry[1]
                        : entry[1].join(", ")}
                    </TableCell>
                  </TableRow>
                )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

interface Props {
  exercise: RoutineExercise;
}
