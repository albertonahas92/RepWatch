import { Fade, Stack } from "@mui/material";
import { useTheme } from "@mui/system";
import React, { FC } from "react";
import { BackDiagram } from "../../../icons/backDiagram";
import { FrontDiagram } from "../../../icons/frontDiagram";

export const MuscleDiagrams: FC<Props> = ({
  onMuscleGroupClick,
  isClickable,
  highlights,
  secondaryHighlights,
}) => {
  const theme = useTheme();
  return (
    <Fade
      in={true}
      timeout={200}
      style={{
        transitionDelay: `100ms`,
      }}
      unmountOnExit
    >
      <Stack
        direction="row"
        sx={{ justifyContent: "center", alignItems: "center" }}
        spacing={2}
      >
        <FrontDiagram
          highlights={highlights}
          secondaryHighlights={secondaryHighlights}
          style={{
            fontSize: "12em",
            maxWidth: 120,
            color: theme.palette.text.secondary,
            fill: theme.palette.text.secondary,
          }}
          isClickable={isClickable}
          onMuscleGroupClick={onMuscleGroupClick}
        />
        <BackDiagram
          highlights={highlights}
          secondaryHighlights={secondaryHighlights}
          style={{
            fontSize: "12em",
            maxWidth: 120,
            color: theme.palette.text.secondary,
            fill: theme.palette.text.secondary,
          }}
          isClickable={isClickable}
          onMuscleGroupClick={onMuscleGroupClick}
        />
      </Stack>
    </Fade>
  );
};

interface Props {
  onMuscleGroupClick?: React.MouseEventHandler<SVGGElement>;
  isClickable?: boolean;
  highlights: string[];
  secondaryHighlights: string[];
}
