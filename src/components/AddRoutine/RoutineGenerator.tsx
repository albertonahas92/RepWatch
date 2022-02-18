import { Box, Fade } from "@mui/material";
import React, { useState } from "react";
import { RoutineExercise } from "../../types/exercise";
import { MuscleDiagrams } from "./partials/MuscleDiagrams";

export const RoutineGenerator = () => {
  const [exercises, setExercises] = useState<RoutineExercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<string[]>([]);

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

  return (
    <Box>
      <MuscleDiagrams
        highlights={Array.from(
          new Set(exercises.flatMap((e) => e.primaryMuscles || ""))
        )}
        secondaryHighlights={muscleGroups}
        isClickable={true}
        onMuscleGroupClick={onMuscleGroupClick}
      />
    </Box>
  );
};
