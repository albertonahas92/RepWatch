import {
  TextField,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Grid,
} from "@mui/material";
import { FormikProps } from "formik";
import { User } from "../../../types/user";

export const BasicInfoForm = (props: FormikProps<User>) => {
  return (
    <>
      <Grid item md={4} xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            aria-label="gender"
            name="gender"
            value={props.values.gender}
            onChange={props.handleChange}
          >
            <FormControlLabel
              value="female"
              control={<Radio size="small" />}
              sx={{ color: "text.primary" }}
              label="Female"
            />
            <FormControlLabel
              value="male"
              control={<Radio size="small" />}
              sx={{ color: "text.primary" }}
              label="Male"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={12}>
        <TextField
          error={Boolean(props.touched.age && props.errors.age)}
          helperText={props.touched.age && props.errors.age}
          fullWidth
          label="age"
          margin="dense"
          name="age"
          onBlur={props.handleBlur}
          onChange={props.handleChange}
          type="number"
          value={props.values.age}
          variant="outlined"
        />
      </Grid>
    </>
  );
};

interface Props {}
