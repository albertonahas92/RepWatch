import React, { FC } from "react";
import { useTheme } from "@mui/system";
import { Button, Typography } from "@mui/material";

export var Landing: FC<Props> = function (props) {
  const theme = useTheme();

  return (
    <div
      style={{
        background: theme.palette.primary.main,
        flexGrow: 1,
        textAlign: "center",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "calc( 100vh - 64px )",
      }}
    >
      <Typography
        sx={{ fontWeight: "lighter", fontSize: "3em" }}
        variant="h1"
        color="white"
        aria-label="use your best photos"
      >
        Watch your reps!
      </Typography>
      <Typography sx={{ m: 2, fontSize: "18px" }} variant="h3" color="white">
        Maximaze the benefits from your workouts by starting noww
      </Typography>
      <Button
        color="primary"
        fullWidth
        size="large"
        onClick={props.login}
        sx={{
          border: "2px solid white",
          width: 200,
          color: "white",
          mt: 3,
        }}
        aria-label="get started"
      >
        Get started
      </Button>
    </div>
  );
};

interface Props {
  login: () => void;
}
