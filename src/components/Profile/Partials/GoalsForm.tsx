import {
  TextField,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { FormikProps } from "formik";
import { User } from "../../../types/user";

export const GoalsForm = (props: FormikProps<User>) => {
  return (
    <>
      <Grid item md={4} xs={12}>
        <TextField
          error={Boolean(props.touched.weightGoal && props.errors.weightGoal)}
          helperText={props.touched.weightGoal && props.errors.weightGoal}
          fullWidth
          label="weight goal"
          margin="dense"
          name="weightGoal"
          onBlur={props.handleBlur}
          onChange={props.handleChange}
          type="number"
          value={props.values.weightGoal}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {props.values.unit === "imperial" ? "lb" : "kg"}
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Grid>
      <Grid item md={4} xs={12}>
        <FormControl fullWidth sx={{ minWidth: 80, mt: 1 }}>
          <InputLabel id="goal-select-label">Goal</InputLabel>
          <Select
            labelId="goal-select-label"
            id="goal-select-autowidth"
            value={props.values.goal}
            onBlur={props.handleBlur}
            onChange={(e) => {
              props.setFieldValue("goal", e.target.value);
              props.handleChange(e);
            }}
            label="Fitness Goal"
            fullWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="general">General Fitness</MenuItem>
            <MenuItem value="strength">Build Strength</MenuItem>
            <MenuItem value="muscle">Gain Muscle</MenuItem>
            <MenuItem value="endurance">Endurance</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </>
  );
};

interface Props {}
