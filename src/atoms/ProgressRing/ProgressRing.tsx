import { CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { FC } from "react";

const getColor = (val: number) => {
  //   if (val <= 10) return "error.main";
  //   if (val <= 20) return "warning.main";
  return "primary.light";
};

export var ProgressRing: FC<Props> = function ({ color, ...props }) {
  const style = {
    position: "relative",
    display: "inline-flex",
    "& circle": {
      strokeWidth: 1.1,
      transition: "stroke-dashoffset 1000ms linear",
      strokeLinecap: "round",
      color: color || "primary.light",
    },
  } as const;

  return (
    <Box sx={style}>
      <CircularProgress
        variant="determinate"
        size={props.size || 120}
        {...props}
      />
      <CircularProgress
        variant="determinate"
        size={props.size || 120}
        value={100}
        sx={{
          position: "absolute",
          "& circle": { strokeWidth: "0.2 !important" },
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {props.label && (
          <Typography variant="h6" component="div" color="text.secondary">
            {`${Math.floor((props.value || 0) / 10)}/10`}
          </Typography>
        )}
        {props.children}
      </Box>
    </Box>
  );
};

interface Props {
  value?: number;
  label?: string;
  children?: JSX.Element;
  size?: number;
  color?: string;
}
