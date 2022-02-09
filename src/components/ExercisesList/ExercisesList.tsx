import * as React from "react";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoIcon from "@mui/icons-material/Info";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  Avatar,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  ListItemAvatar,
  ListItemIcon,
  TextField,
  Typography,
} from "@mui/material";
import { EquipmentIcon } from "../../icons/equipment/EquipmentIcon";
import { Level } from "../../atoms/Level/Level";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { Exercise, RoutineExercise } from "../../types/exercise";
import { useExercises } from "../../hooks/useExercises";
import { MultipleSelect } from "../../atoms/MultipleSelect/MultipleSelect";
import { useDispatch } from "react-redux";
import { setExercise, setExerciseModal } from "../../store/exerciseSlice";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export const ExercisesList: React.FC<Props> = ({ onSelectExercise }) => {
  const {
    exercises,
    term,
    setTerm,
    muscles,
    equipments,
    equipmentsFilter,
    musclesFilter,
    setEquipmentsFilter,
    setMusclesFilter,
  } = useExercises();

  const screenSize = useWindowDimensions();
  const dispatch = useDispatch();

  const onInfoClick = (exericse: RoutineExercise) => {
    dispatch(setExercise(exericse));
    dispatch(setExerciseModal(true));
  };

  function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;
    const exercise = exercises ? exercises[index] : undefined;
    return exercises && exercise ? (
      <ListItem
        style={style}
        key={index}
        component="div"
        disablePadding
        secondaryAction={
          <IconButton
            onClick={() => onInfoClick(exercise as RoutineExercise)}
            edge="end"
            aria-label="delete"
          >
            <InfoOutlinedIcon />
          </IconButton>
        }
      >
        <ListItemButton onClick={() => onSelectExercise?.(exercise)}>
          {/* <ListItemIcon>
              <EquipmentIcon
                style={{ fontSize: "25px" }}
                icon={exercise.equipment}
              />
            </ListItemIcon> */}
          <ListItemAvatar>
            <Avatar>
              <EquipmentIcon
                style={{ fontSize: "25px" }}
                icon={exercise.equipment}
              />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography color="text.primary" variant="body2">
                {exercise.name}
              </Typography>
            }
            secondary={exercise.primaryMuscles?.join()}
          />
          <ListItemIcon style={{ display: "flex", justifyContent: "flex-end" }}>
            <Level level={exercise.level} />
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
    ) : (
      <></>
    );
  }

  React.useEffect(() => {}, [name]);

  const handleTermChange = (e: any) => {
    setTerm(e.target.value);
  };

  return (
    <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
      <Grid sx={{ p: 2 }} spacing={2} container>
        <Grid item md={4} xs={12}>
          <TextField
            fullWidth
            label="name"
            margin="normal"
            name="name"
            onChange={handleTermChange}
            type="search"
            value={term}
            variant="outlined"
            sx={{ m: 0 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item md={4} xs={6}>
          <MultipleSelect
            label="Muscles"
            items={muscles || []}
            selectedItems={musclesFilter || []}
            setSelectedItems={setMusclesFilter}
          />
        </Grid>
        <Grid item md={4} xs={6}>
          <MultipleSelect
            label="Equipments"
            items={equipments || []}
            selectedItems={equipmentsFilter || []}
            setSelectedItems={setEquipmentsFilter}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          flexGrow: 1,
          height: "100%",
          minHeight: "50vh",
        }}
      >
        <AutoSizer defaultHeight={100} defaultWidth={100}>
          {({ height, width }: any) => (
            <FixedSizeList
              className="List"
              height={height}
              itemCount={exercises?.length || 0}
              itemSize={screenSize === "xs" ? 80 : 70}
              width={width}
            >
              {renderRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
};

interface Props {
  onSelectExercise?: (exercise: Exercise) => void;
}
