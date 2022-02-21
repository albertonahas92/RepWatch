import React, { FC } from "react";
import { useTheme } from "@mui/system";
import { Box, Button, Typography } from "@mui/material";

export var Landing: FC<Props> = function (props) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "multiply",
        flexGrow: 1,
        textAlign: "center",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "calc( 100vh - 64px )",
        backgroundImage: `url('https://firebasestorage.googleapis.com/v0/b/gymplanner-e1632.appspot.com/o/repwatch-15.jpg?alt=media&token=91021122-11ee-40a1-b44c-ee5885b69f71') !important`,
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
        Maximaze the benefits from your workouts by starting now
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
    </Box>
  );
};

interface Props {
  login: () => void;
}
