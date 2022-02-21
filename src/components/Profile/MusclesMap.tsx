import { Stack, Typography } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import React, { FC, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import SwitchToggle from "../../atoms/SwitchToggle/SwitchToggle";
import { useExercises } from "../../hooks/useExercises";
import { useStats } from "../../hooks/useStats";
import { RadarReport } from "../../molecules/Reports/RadarReport";
import { historySelector } from "../../store/historySlice";
import { userSelector } from "../../store/userSlice";
import {
  strengthLevels,
  strengthStandards,
} from "../../utils/strengthStandards";
import { getSetRPM, getStrengthLevel } from "../../utils/utils";

export const MusclesMap: FC<Props> = () => {
  const user = useSelector(userSelector);

  const theme = useTheme();

  const [compare, setCompare] = useState(false);

  const { exercises } = useExercises();

  const { strengthData } = useStats();

  const chartKeys = useMemo(() => {
    const keysMap = new Map();
    keysMap.set("level", "Score");
    if (compare) {
      keysMap.set("elite", "Elite");
    }
    return keysMap;
  }, [compare]);

  return !!strengthData.length ? (
    <Box
      sx={{
        height: 300,
        "& tspan": { fill: theme.palette.text.secondary },
        "& .recharts-tooltip-label": {
          color: theme.palette.secondary.dark,
        },
      }}
    >
      <RadarReport argument="muscle" keys={chartKeys} data={strengthData} />
      <Stack
        direction="row"
        spacing={2}
        sx={{ justifyContent: "center", position: "relative", top: -30 }}
      >
        <Typography variant="body2" color="text.secondary">
          Compare with elite level
        </Typography>
        <SwitchToggle
          active={!!compare}
          handleToggleChange={(val) => {
            setCompare(val);
          }}
        />
      </Stack>
    </Box>
  ) : (
    <></>
  );
};

interface Props {
  compare?: string;
}
