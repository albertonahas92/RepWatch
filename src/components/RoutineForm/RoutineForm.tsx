import { Autocomplete, Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { exercisesSelector } from "../../store/exercisesSlice";
import { Routine } from "../../types/routine";

type Inputs = {
  name: string;
  exercise: string;
};

export const RoutineForm: FC<Props> = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const exercises = useSelector(exercisesSelector);

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Routine Name"
          {...register("name", { required: true })}
          variant="standard"
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        {exercises && (
          <Autocomplete
            disablePortal
            id="exercise"
            options={exercises}
            getOptionLabel={(option: any) => option.name}
            // onChange={(event, newValue: any) => {}}
            renderInput={(params) => (
              <TextField
                {...register("exercise", { required: true })}
                variant="standard"
                {...params}
                label="Exercise"
              />
            )}
          />
        )}
      </Box>

      {/* errors will return when field validation fails  */}
      {errors.exercise && <span>This field is required</span>}
      <Button type="submit" variant="outlined">
        Create
      </Button>
    </form>
  );
};

interface Props {
  onSubmit: (data: Routine) => SubmitHandler<Routine>;
}
