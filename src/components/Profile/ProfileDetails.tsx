import React, { FC } from "react";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useTheme } from "@mui/system";
import firebase from "../../config";
import { SelectGender } from "../../atoms/SelectGender/SelectGender";
import { User } from "../../types/user";
import { useUser } from "../../hooks/useUser";
import { converter, heightString, weightString } from "../../utils/utils";

export var AccountProfileDetails: FC<Props> = function ({ user, ...props }) {
  const [sucess, setSucess] = useState(false);

  const { updateUser } = useUser();

  const theme = useTheme();

  const formik = useFormik({
    initialValues: {
      age: user?.age || 25,
      gender: user?.gender || "male",
      height: user?.height || 170,
      heightIn: user?.heightIn || 0,
      weight: user?.weight || 70,
      unit: user?.unit || "metric",
    },
    validationSchema: Yup.object({
      age: Yup.number().max(90).min(8).required("Age is required"),
      height: Yup.number().max(200).min(1).required("Height is required"),
      heightIn: Yup.number().max(20),
      weight: Yup.number().max(500).min(30).required("Weight is required"),
      gender: Yup.string().required("Gender is required"),
      unit: Yup.string().required("Unit is required"),
    }),
    onSubmit: (values, { resetForm, setErrors, setSubmitting }) => {
      updateUser({
        uid: user?.uid,
        age: values.age,
        gender: values.gender,
        height: values.height,
        heightIn: values.heightIn,
        weight: values.weight,
        unit: values.unit,
      }).then(() => {
        setSucess(true);
        props.setEditMode(false);
      });
    },
  });

  const handleClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSucess(false);
  };

  return props.editMode ? (
    <form onSubmit={formik.handleSubmit}>
      <Card elevation={0} variant="outlined">
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={4} xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio size="small" />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio size="small" />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                error={Boolean(formik.touched.age && formik.errors.age)}
                helperText={formik.touched.age && formik.errors.age}
                fullWidth
                label="age"
                margin="dense"
                name="age"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                value={formik.values.age}
                variant="outlined"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Units</FormLabel>
                <RadioGroup
                  row
                  aria-label="unit"
                  name="unit"
                  value={formik.values.unit}
                  onChange={(e: React.ChangeEvent<any>) => {
                    if (e.target.value === "metric") {
                      formik.setFieldValue(
                        "height",
                        converter.ftToCm(
                          formik.values.height,
                          formik.values.heightIn
                        )
                      );
                      formik.setFieldValue(
                        "weight",
                        converter.lbsToKg(formik.values.weight)
                      );
                    } else {
                      formik.setFieldValue(
                        "height",
                        converter.cmToFt(formik.values.height).ft
                      );
                      formik.setFieldValue(
                        "heightIn",
                        converter.cmToFt(formik.values.height).inches
                      );
                      formik.setFieldValue(
                        "weight",
                        converter.kgToLbs(formik.values.weight)
                      );
                    }
                    formik.handleChange(e);
                  }}
                >
                  <FormControlLabel
                    value="metric"
                    control={<Radio size="small" />}
                    label="Metric"
                  />
                  <FormControlLabel
                    value="imperial"
                    control={<Radio size="small" />}
                    label="Impreial"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item md={4} xs={12}>
              <TextField
                error={Boolean(formik.touched.weight && formik.errors.weight)}
                helperText={formik.touched.weight && formik.errors.weight}
                fullWidth
                label="weight"
                margin="dense"
                name="weight"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="number"
                value={formik.values.weight}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {formik.values.unit === "imperial" ? "lb" : "kg"}
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Stack
                direction="row"
                sx={{ alignItems: "baseline" }}
                spacing={2}
              >
                <TextField
                  error={Boolean(formik.touched.height && formik.errors.height)}
                  helperText={formik.touched.height && formik.errors.height}
                  fullWidth
                  label="height"
                  margin="dense"
                  name="height"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="number"
                  value={formik.values.height}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {formik.values.unit === "imperial" ? "ft." : "cm"}
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
                {formik.values.unit === "imperial" && (
                  <TextField
                    error={Boolean(
                      formik.touched.heightIn && formik.errors.heightIn
                    )}
                    helperText={
                      formik.touched.heightIn && formik.errors.heightIn
                    }
                    fullWidth
                    label="in."
                    margin="dense"
                    name="heightIn"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="number"
                    value={formik.values.heightIn}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {formik.values.unit === "imperial" ? "in." : "cm"}
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
        <Divider variant="middle" />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Button color="primary" variant="outlined" type="submit">
            Save details
          </Button>
        </Box>
      </Card>
      <Snackbar open={sucess} autoHideDuration={2000} onClose={handleClose}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Profile has been saved!
        </Alert>
      </Snackbar>
    </form>
  ) : (
    <Card elevation={0} variant="outlined">
      <CardContent>
        <TableContainer component={Box}>
          <Table aria-label="exercise table" size="small">
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Gender
                </TableCell>
                <TableCell align="right">{user?.gender}</TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Age
                </TableCell>
                <TableCell align="right">{user?.age}</TableCell>
              </TableRow>
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
            </TableBody>
          </Table>
        </TableContainer>
        {/* <IconButton onClick={() => props.setEditMode(true)}>
              <EditIcon fontSize="medium" />
            </IconButton> */}
        <Button
          sx={{ mt: 2 }}
          color="primary"
          component="span"
          size="large"
          onClick={() => props.setEditMode(true)}
          endIcon={<EditIcon />}
        >
          Edit Details
        </Button>
      </CardContent>
    </Card>
  );
};

interface Props {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  user?: User | null;
}
