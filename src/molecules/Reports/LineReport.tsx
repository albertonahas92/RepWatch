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
} from "recharts";
import { Typography } from "@mui/material";
import { Theme, useTheme } from "@mui/material/styles";

export const LineReport: React.FC<Props> = ({ data, keys, argument, unit }) => {
  const theme = useTheme();

  return (
    <ResponsiveContainer>
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: -25,
          bottom: 0,
        }}
      >
        <CartesianGrid
          stroke={theme.palette.divider}
          strokeDasharray="3 3"
        />
        <XAxis dataKey={argument} />
        <YAxis />
        <Tooltip />
        <Legend />
        {[...keys.keys()].map((k) => (
          <Line
            type="linear"
            dataKey={k}
            stroke={theme.palette.primary.light}
          />
        ))}
      </LineChart>
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
