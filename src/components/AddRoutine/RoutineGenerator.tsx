import { Avatar, Box, Chip, Container, Fade, Grid } from "@mui/material";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Exercise, RoutineExercise } from "../../types/exercise";
import { MuscleDiagrams } from "./partials/MuscleDiagrams";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  getLevelNum,
  getPlaceEquipments,
  getWorkoutSplits,
} from "../../utils/utils";
import { useSelector } from "react-redux";
import { exercisesSelector } from "../../store/exercisesSlice";
import { RoutineDetails } from "../Routines/RoutineDetails";
import { useExercises } from "../../hooks/useExercises";
import { EquipmentIcon } from "../../icons/equipment/EquipmentIcon";
import { useTheme } from "@mui/system";
import { deepOrange } from "@mui/material/colors";
import { userSelector } from "../../store/userSlice";
import _ from "lodash";
import chance from "chance";
import { splits, workoutPlaces, muscles } from "../../utils/constants";

const steps = ["Muscles", "Equipments", "Generate"];

export const RoutineGenerator: FC<Props> = ({ onFinish }) => {
  const user = useSelector(userSelector);

  const [exercises, setExercises] = useState<RoutineExercise[]>();
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);
  const [equipments, setEquipments] = useState<string[]>([]);
  const exercisesUtils = useExercises();
  const workoutSplits = useMemo(getWorkoutSplits, []);
  const placeEquipments = useMemo(getPlaceEquipments, []);

  const selectedSplits = useMemo<string[]>(() => {
    return splits.filter((p) =>
      workoutSplits[p]?.every((ws: string) => muscleGroups?.includes(ws))
    );
  }, [muscleGroups, workoutSplits]);

  const selectedPlaces = useMemo<string[]>(() => {
    return workoutPlaces.filter((p) =>
      placeEquipments[p]?.every((pe: string) => equipments?.includes(pe))
    );
  }, [equipments, placeEquipments]);

  const onMuscleGroupClick: React.MouseEventHandler<SVGGElement> = (e) => {
    const parentElement = (e.target as Element).parentElement;
    if (!parentElement || parentElement.nodeName !== "g") return;
    const groupName = parentElement.dataset["name"] || parentElement.id;
    if (muscleGroups?.includes(groupName)) {
      setMuscleGroups(muscleGroups.filter((m) => m != groupName));
    } else {
      setMuscleGroups([...muscleGroups, groupName]);
    }
  };

  const [activeStep, setActiveStep] = React.useState(0);

  const theme = useTheme();

  useEffect(() => {
    if (activeStep === steps.length - 1) {
      let categories = ["strength"];
      if (["general", "endurance"].includes(user?.goal || "")) {
        categories = [...categories, "cardio", "stretching"];
      }

      const generatedExcersises = exercisesUtils.exercises
        ?.filter(
          (e) =>
            categories.includes(e.category || "strength") &&
            !!muscleGroups.filter((m) => e.primaryMuscles?.includes(m))
              .length &&
            !!equipments.filter((m) => e.equipment === m).length
        )
        .map((e) => {
          return {
            ...e,
            index:
              muscleGroups.filter((m) => e.primaryMuscles?.includes(m)).length +
              muscleGroups.filter((m) => e.secondaryMuscles?.includes(m))
                .length +
              (3 - getLevelNum(e.level)),
          };
        })
        .sort((a, b) => b.index - a.index) as Array<RoutineExercise>;

      const groups = _.groupBy(generatedExcersises, "primaryMuscles");
      const groupsArr = Object.values(groups);
      if (!groupsArr.length) {
        return;
      }

      const exercisesCount = _.random(5, 7);
      const finalExercises = [];
      while (finalExercises.length < exercisesCount) {
        const group: RoutineExercise[] =
          groupsArr[finalExercises.length % groupsArr.length];
        const exercise = chance().weighted(
          group,
          group.map((e: RoutineExercise, i: number) => e.index || 0)
        );
        finalExercises.push(exercise);
      }

      setExercises(_.uniqBy(finalExercises, "name"));
    }

    if (activeStep === steps.length) {
      onFinish?.(exercises as Exercise[]);
    }
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSplitClick = (s: string) => {
    if (s === "full") {
      setMuscleGroups(Object.keys(muscles));
    }
    if (workoutSplits[s]) {
      setMuscleGroups(workoutSplits[s]);
    }
  };

  const handleEquipmentClick = (e: string) => {
    if (equipments?.includes(e)) {
      setEquipments((eqps) => eqps?.filter((eq) => eq !== e));
    } else {
      setEquipments((eqps) => [...(eqps || []), e]);
    }
  };

  const handleWorkoutPlaceClick = (p: string) => {
    if (p === "all") {
      setEquipments(exercisesUtils.equipments || []);
    }
    if (placeEquipments[p]) {
      setEquipments(placeEquipments[p]);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} sx={{ mb: 2 }} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Submitting exercises ...
          </Typography>
        </React.Fragment>
      ) : (
        <React.Fragment>
          {activeStep === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                Highlitght all muscle groups that you want to hit in your
                routine
              </Typography>
              <MuscleDiagrams
                highlights={[]}
                // highlights={Array.from(
                //   new Set(exercises?.flatMap((e) => e.primaryMuscles || ""))
                // )}
                secondaryHighlights={muscleGroups}
                isClickable={true}
                onMuscleGroupClick={onMuscleGroupClick}
              />
              <Box sx={{ mt: 2 }}>
                {splits.map((t: string, i: number) => {
                  const active = selectedSplits.indexOf(t) !== -1;
                  return (
                    <Chip
                      sx={{
                        backgroundColor: `${
                          active ? "text.secondary" : "bg.paper"
                        }`,
                        color: `${active ? "background.default" : "inherit"}`,
                        m: 0.4,
                      }}
                      onClick={() => handleSplitClick(t)}
                      key={t}
                      label={t}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
          {activeStep === 1 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                Highlitght all equipments you can use in your routine
              </Typography>
              <Container
                maxWidth="xs"
                sx={{ display: "flex", gap: 2.5, flexWrap: "wrap" }}
              >
                {exercisesUtils.equipments?.map(
                  (e) =>
                    e && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                        onClick={() => {
                          handleEquipmentClick(e);
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: equipments?.includes(e)
                              ? "primary.light"
                              : "secondary.light",
                          }}
                          key={e}
                        >
                          <EquipmentIcon
                            style={{ fontSize: "25px" }}
                            icon={e}
                          />
                        </Avatar>
                        <Typography variant="caption">{e}</Typography>
                      </Box>
                    )
                )}
              </Container>
              <Box sx={{ mt: 2 }}>
                {workoutPlaces.map((t: string, i: number) => {
                  const active = selectedPlaces.indexOf(t) !== -1;
                  return (
                    <Chip
                      sx={{
                        backgroundColor: `${
                          active ? "text.secondary" : "bg.paper"
                        }`,
                        color: `${active ? "background.default" : "inherit"}`,
                        m: 0.4,
                      }}
                      onClick={() => handleWorkoutPlaceClick(t)}
                      key={t}
                      label={t}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
          {activeStep === 2 && <RoutineDetails routine={{ exercises }} />}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {activeStep === steps.length - 1 && (
              <Button onClick={handleReset}>Reset</Button>
            )}

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
};

interface Props {
  onFinish?: (exercises: Exercise[]) => void;
}
