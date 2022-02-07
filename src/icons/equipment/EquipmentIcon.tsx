import React from "react";
import { BodyWeight } from "./bodyWeight";
import { Machine } from "./machine";
import { FoamRoller } from "./foamRoller";
import { Kettlebells } from "./kettlebells";
import { Cable } from "./cable";
import { Barbell } from "./barbell";
import { MedicineBall } from "./medicineBall";
import { Bands } from "./bands";
import { EzBar } from "./ezBar";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Dumbbell } from "../dumbbell";

export const EquipmentIcon: React.FC<Props> = ({ icon, ...props }) => {
  switch (icon) {
    case "body only":
      return <BodyWeight {...props} />;
    case "machine":
      return <Machine {...props} />;
    case "foam roll":
      return <FoamRoller {...props} />;
    case "kettlebells":
      return <Kettlebells {...props} />;
    case "cable":
      return <Cable {...props} />;
    case "barbell":
      return <Barbell {...props} />;
    case "dumbbell":
      return <Dumbbell {...props} />;
    case "medicine ball":
      return <MedicineBall {...props} />;
    case "bands":
      return <Bands {...props} />;
    case "e-z curl bar":
      return <EzBar {...props} />;

    default:
      return <MoreHorizIcon {...props} />;
  }
};

interface Props {
  icon?: string | null;
  style?: React.CSSProperties;
}
// 0: "body only"
// 1: "machine"
// 2: "other"
// 3: "foam roll"
// 4: null
// 5: "kettlebells"
// 6: "dumbbell"
// 7: "cable"
// 8: "barbell"
// 9: "medicine ball"
// 10: "bands"
// 11: "exercise ball"
// 12: "e-z curl bar"
