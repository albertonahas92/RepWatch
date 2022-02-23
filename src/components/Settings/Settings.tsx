import {
  Alert,
  Box,
  Button,
  Container,
  InputAdornment,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import firebase from "firebase";
import { useFormik } from "formik";
import * as Yup from "yup";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SwitchToggle from "../../atoms/SwitchToggle/SwitchToggle";
import { userSelector } from "../../store/userSlice";
import { weightString, heightString, goalString } from "../../utils/utils";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { setSnackbar } from "../../store/snackbarSlice";

export const Settings = () => {
  const user = useSelector(userSelector);
  const { updateUser } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      ...user?.settings,
    },
    // validationSchema: Yup.object({
    //   message: Yup.string().max(255).min(3),
    // }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      updateUser({ ...user, settings: values }).then((res) => {
        dispatch(
          setSnackbar({
            open: true,
            message: "Settings have been saved!",
            type: "success",
          })
        );
        navigate("/");
      });
    },
  });

  return (
    <Container>
      <Typography
        component="h5"
        variant="h5"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Settings
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TableContainer component={Box}>
          <Table aria-label="settings table" size="medium">
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Autofill repeated workouts volume from previous sessions
                </TableCell>
                <TableCell sx={{ textTransform: "capitalize" }} align="right">
                  <SwitchToggle
                    active={formik.values.autofillVolume || false}
                    handleToggleChange={(val) => {
                      formik.setFieldValue("autofillVolume", val);
                    }}
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Recommend reps, weights and rest time based on your goals
                </TableCell>
                <TableCell align="right">
                  <SwitchToggle
                    active={formik.values.applyRecommendation || false}
                    handleToggleChange={(val) => {
                      formik.setFieldValue("applyRecommendation", val);
                    }}
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Auto start the next set
                </TableCell>
                <TableCell align="right">
                  <SwitchToggle
                    active={formik.values.autostartSet || false}
                    handleToggleChange={(val) => {
                      formik.setFieldValue("autostartSet", val);
                    }}
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Show rest timer after a set is done
                </TableCell>
                <TableCell align="right">
                  <SwitchToggle
                    active={formik.values.restTimer || false}
                    handleToggleChange={(val) => {
                      formik.setFieldValue("restTimer", val);
                    }}
                  />
                </TableCell>
              </TableRow>

              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Show warmup timer when starting a set
                </TableCell>
                <TableCell align="right">
                  <SwitchToggle
                    active={formik.values.warmupTimer || false}
                    handleToggleChange={(val) => {
                      formik.setFieldValue("warmupTimer", val);
                    }}
                  />
                </TableCell>
              </TableRow>

              {formik.values.warmupTimer && (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    Warmup time in seconds
                  </TableCell>
                  <TableCell align="right">
                    <TextField
                      sx={{ width: 35 }}
                      label="time"
                      margin="dense"
                      size="small"
                      name="warmupTime"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      type="number"
                      value={formik.values.warmupTime}
                      variant="standard"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ py: 2 }}>
          <Button
            color="primary"
            disabled={formik.isSubmitting}
            fullWidth
            size="large"
            type="submit"
            variant="outlined"
          >
            Save
          </Button>
        </Box>
      </form>
    </Container>
  );
};
