import * as React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(item: string, selectedItems: string[], theme: Theme) {
  return {
    fontWeight:
      selectedItems.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const MultipleSelect: React.FC<Props> = ({
  label,
  items,
  selectedItems,
  setSelectedItems,
}) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof selectedItems>) => {
    const {
      target: { value },
    } = event;
    setSelectedItems(
      // On autofill we get a the stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id={`multiple-${label}-label`}>{label}</InputLabel>
        <Select
          labelId={`multiple-${label}-label`}
          id={`multiple-${label}`}
          multiple
          value={selectedItems}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
        >
          {items.map((item) => (
            <MenuItem
              key={item}
              value={item}
              style={getStyles(item, selectedItems, theme)}
            >
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

interface Props {
  label: string;
  items: string[];
  selectedItems: string[];
  setSelectedItems: (items: string[]) => void;
}
