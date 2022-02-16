import React from "react";
import {
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Grid,
  InputAdornment,
  Stack,
} from "@mui/material";
import { FormikProps } from "formik";
import { converter } from "../../../utils/utils";
import { User } from "../../../types/user";

export const MeasuresForm = (props: FormikProps<User>) => {
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    isSubmitting,
  } = props;

  return (
    <>
      <Grid item md={4} xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Units</FormLabel>
          <RadioGroup
            row
            aria-label="unit"
            name="unit"
            value={values.unit}
            onChange={(e: React.ChangeEvent<any>) => {
              if (e.target.value === "metric") {
                setFieldValue(
                  "height",
                  converter.ftToCm(values.height, values.heightIn)
                );
                setFieldValue("weight", converter.lbsToKg(values.weight));
              } else {
                setFieldValue("height", converter.cmToFt(values.height).ft);
                setFieldValue(
                  "heightIn",
                  converter.cmToFt(values.height).inches
                );
                setFieldValue("weight", converter.kgToLbs(values.weight));
              }
              handleChange(e);
            }}
          >
            <FormControlLabel
              value="metric"
              control={<Radio size="small" />}
              sx={{ color: "text.primary" }}
              label="Metric"
            />
            <FormControlLabel
              value="imperial"
              control={<Radio size="small" />}
              sx={{ color: "text.primary" }}
              label="Impreial"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          error={Boolean(touched.weight && errors.weight)}
          helperText={touched.weight && errors.weight}
          fullWidth
          label="weight"
          margin="dense"
          name="weight"
          onBlur={handleBlur}
          onChange={handleChange}
          type="number"
          value={values.weight}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {values.unit === "imperial" ? "lb" : "kg"}
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Grid>
      <Grid item md={4} xs={12}>
        <Stack direction="row" sx={{ alignItems: "baseline" }} spacing={2}>
          <TextField
            error={Boolean(touched.height && errors.height)}
            helperText={touched.height && errors.height}
            fullWidth
            label="height"
            margin="dense"
            name="height"
            onBlur={handleBlur}
            onChange={handleChange}
            type="number"
            value={values.height}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {values.unit === "imperial" ? "ft." : "cm"}
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          {values.unit === "imperial" && (
            <TextField
              error={Boolean(touched.heightIn && errors.heightIn)}
              helperText={touched.heightIn && errors.heightIn}
              fullWidth
              label="in."
              margin="dense"
              name="heightIn"
              onBlur={handleBlur}
              onChange={handleChange}
              type="number"
              value={values.heightIn}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {values.unit === "imperial" ? "in." : "cm"}
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          )}
        </Stack>
      </Grid>
    </>
  );
};

interface Props {}
