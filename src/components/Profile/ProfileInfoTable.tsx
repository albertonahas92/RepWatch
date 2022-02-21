import {
  TableContainer,
  Box,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import React from "react";
import { User } from "../../types/user";
import { weightString, heightString, goalString } from "../../utils/utils";

export const ProfileInfoTable = ({ user }: { user?: User | null }) => {
  return (
    <TableContainer component={Box}>
      <Table
        sx={{
          "& th": {
            fontWeight: "bold",
          },
        }}
        aria-label="exercise table"
        size="small"
      >
        <TableBody>
          {user?.gender && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Gender
              </TableCell>
              <TableCell sx={{ textTransform: "capitalize" }} align="right">
                {user?.gender}
              </TableCell>
            </TableRow>
          )}
          {user?.age && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Age
              </TableCell>
              <TableCell align="right">{user?.age}</TableCell>
            </TableRow>
          )}
          {user?.weight && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Weight
              </TableCell>
              <TableCell align="right">
                {weightString(user || undefined)}
              </TableCell>
            </TableRow>
          )}
          {user?.height && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Height
              </TableCell>
              <TableCell align="right">
                {heightString(user || undefined)}
              </TableCell>
            </TableRow>
          )}
          {user?.weightGoal && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Weight Goal
              </TableCell>
              <TableCell align="right">
                {weightString(user || undefined, user?.weightGoal)}
              </TableCell>
            </TableRow>
          )}
          {user?.goal && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Goal
              </TableCell>
              <TableCell align="right">{goalString(user?.goal)}</TableCell>
            </TableRow>
          )}
          {user?.frequencyGoal && (
            <TableRow
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                Training Goal
              </TableCell>
              <TableCell align="right">
                {user?.frequencyGoal} Times a week
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
