import * as React from "react";
import Paper from "@mui/material/Paper";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";
import { Typography } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";

export const RadarReport: React.FC<Props> = ({
  data,
  keys,
  argument,
  unit,
}) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer>
      <RadarChart outerRadius={90} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={argument} />
        <PolarRadiusAxis
          allowDataOverflow={false}
          angle={90}
          axisLine={false}
          tick={false}
          //   domain={[0, 100]}
        />
        <PolarRadiusAxis />
        {[...keys.keys()].map((k: string, i: number) => (
          <Radar
            key={k}
            name={keys.get(k)}
            dataKey={k}
            dot={true}
            stroke={theme.palette.primary.light}
            fill={theme.palette.primary.light}
            fillOpacity={0.6 - i * 0.5}
          />
        ))}
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

interface Props {
  data: any[];
  keys: Map<string, string>;
  argument?: string;
  unit?: string;
}

export interface ChartT {}
