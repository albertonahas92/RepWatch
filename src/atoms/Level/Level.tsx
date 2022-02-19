import { styled } from "@mui/material";
import React from "react";
import { getLevelNum } from "../../utils/utils";

const Bars = styled("span", {
  shouldForwardProp: (prop) => prop !== "level",
})<{ level?: string }>(({ theme, level }) => ({
  "& > *": {
    // backgroundColor: getLevelColor(level),
    height: "50%",
    width: "5px",
    borderRadius: 4,
    margin: "0px 2px",
    display: "inline-block",
  },
}));

const getLevelColor = (l?: number) => {
  switch (l) {
    case 1:
      return "#8DC832";
    case 2:
      return "#C9DA2C";
    default:
      return "#E1B514";
  }
};

export const Level: React.FC<Props> = ({ level }) => {
  const levelNum = getLevelNum(level);

  return (
    <Bars>
      {[...Array(3)].map((e, i) => (
        <span
          key={i}
          style={{
            backgroundColor: i < levelNum ? getLevelColor(levelNum) : "#eee",
          }}
        />
      ))}
    </Bars>
  );
};

interface Props {
  level?: string;
}
