import { FC } from "react";
import { useState } from "react";
import { FormikProps } from "formik";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { User } from "../../types/user";
import { useUser } from "../../hooks/useUser";
import { MeasuresForm } from "./Partials/MeasuresForm";
import { ProfileInfoTable } from "./ProfileInfoTable";
import { GoalsForm } from "./Partials/GoalsForm";
import { ProfileFormHoc } from "./ProfileFormHoc";
import { BasicInfoForm } from "./Partials/BasicInfoForm";
import { MusclesMap } from "./MusclesMap";
import { useTheme } from "@mui/system";

export const AccountProfileDetails: FC<Props> = function ({ user, ...props }) {
  const [sucess, setSucess] = useState(false);
  const theme = useTheme();
  const { updateUser } = useUser();

  const onSubmitSuccess = () => {
    setSucess(true);
    props.setEditMode(false);
  };

  const handleClose = (event: any, reason: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSucess(false);
  };

  return (
    <>
      <Box sx={{ display: !props.editMode ? "none" : "block" }}>
        {ProfileFormHoc({ user, onSubmitSuccess })(ProfileDetailsInnerForm)}
      </Box>
      <Card
        sx={{ display: props.editMode ? "none" : "block" }}
        elevation={0}
        variant="elevation"
      >
        <CardContent>
          <ProfileInfoTable user={user} />
          {/* <IconButton onClick={() => props.setEditMode(true)}>
          <EditIcon fontSize="medium" />
        </IconButton> */}
          <Button
            sx={{ mt: 2 }}
            color="primary"
            component="span"
            size="large"
            onClick={() => props.setEditMode(true)}
            endIcon={<EditIcon />}
          >
            Edit Details
          </Button>
        </CardContent>
      </Card>
      <Snackbar open={sucess} autoHideDuration={2000} onClose={handleClose}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Profile has been saved!
        </Alert>
      </Snackbar>
    </>
  );
};

interface Props {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  user?: User | null;
}

const ProfileDetailsInnerForm = (props: FormikProps<User>) => {
  return (
    <form onSubmit={props.handleSubmit}>
      <Card elevation={0} variant="outlined">
        <CardContent>
          <Grid container spacing={3}>
            <BasicInfoForm {...props} />
            <MeasuresForm {...props} />
            <GoalsForm {...props} />
          </Grid>
        </CardContent>
        <Divider variant="middle" />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Button color="primary" variant="outlined" type="submit">
            Save details
          </Button>
        </Box>
      </Card>
    </form>
  );
};
