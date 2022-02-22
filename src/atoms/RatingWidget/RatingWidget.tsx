import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Plate } from "../../icons/plate";
import { PlateBorder } from "../../icons/plateBorder";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

export const RatingWidget: React.FC<Props> = (props) => {
  return (
    <Box
      sx={{
        "& > legend": { mt: 2 },
      }}
    >
      <StyledRating
        name="customized-color"
        defaultValue={0}
        value={props.value || 0}
        getLabelText={(value) => `${value} Heart${value !== 1 ? "s" : ""}`}
        precision={0.5}
        icon={<Plate fontSize="large" style={{ margin: 2 }} />}
        emptyIcon={<PlateBorder fontSize="large" style={{ margin: 2 }} />}
        onChange={props.onRatingChange}
      />
    </Box>
  );
};

interface Props {
  value: number;
  onRatingChange: (
    event: React.SyntheticEvent<Element, Event>,
    newValue: number | null
  ) => void;
}
