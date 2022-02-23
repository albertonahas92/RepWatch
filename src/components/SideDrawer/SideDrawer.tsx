import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { drawerSelector, setDrawer } from "../../store/drawerSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import GradingOutlinedIcon from "@mui/icons-material/GradingOutlined";
import PrivacyTipOutlinedIcon from "@mui/icons-material/PrivacyTipOutlined";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Dumbbell } from "../../icons/dumbbell";
import { userSelector } from "../../store/userSlice";
import SettingsIcon from '@mui/icons-material/Settings';

export const SideDrawer: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const drawerOpen = useSelector(drawerSelector);
  const user = useSelector(userSelector);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      dispatch(setDrawer(open));
    };

  const list = () => (
    <Box
      sx={{ width: 275 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <Dumbbell style={{ fontSize: "25px" }} />
          </ListItemIcon>
          <ListItemText primary="Home" color="text.secondary" />
        </ListItem>

        <ListItem button component={Link} to="/settings">
          <ListItemIcon>
            <SettingsIcon  />
          </ListItemIcon>
          <ListItemText primary="Settings" color="text.secondary" />
        </ListItem>

        <ListItem button component={Link} to="/contact">
          <ListItemIcon>
            <ForumOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Contact us" color="text.secondary" />
        </ListItem>

        <ListItem button component={Link} to="/privacy">
          <ListItemIcon>
            <PrivacyTipOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Privacy policy" color="text.secondary" />
        </ListItem>

        <ListItem button component={Link} to="/terms">
          <ListItemIcon>
            <GradingOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary="Terms &#38; Condictions"
            color="text.secondary"
          />
        </ListItem>
      </List>
      <Divider />
      {user && (
        <List>
          <ListItem button onClick={props.signOut}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign out" color="text.secondary" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <div>
      <React.Fragment>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
  );
};

interface Props {
  signOut: () => void;
}
