import { useSelector } from "react-redux";

import { Avatar, ListItem, Typography } from "@mui/material";
import Popover from "@mui/material/Popover";
// import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";

import classes from "./styles.module.css";
import { Link } from "react-router-dom";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const userType = useSelector((state) => state.auth.userType);

  let name = "Test";
  let designation = "test";

  if (userType === "admin") {
    name = user?.name;
    designation = user?.designation;
  } else if (userType === "teacher") {
    name = `${user?.firstName} ${user?.middleName} ${user?.lastName}`;
    designation = user?.designation.title;
  } else if (userType === "student") {
    name = `${user?.firstName} ${user?.middleName} ${user?.lastName}`;
    designation = user?.standard.standard;
  }
  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <div>
          <Avatar
            variant="contained"
            {...bindTrigger(popupState)}
            alt={name}
            className={classes.avatar}
            src="/images/avatars/avatar_1.png"
          />
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            {/* <Typography sx={{ p: 2 }}>The content of the Popover.</Typography> */}

            <div className={classes.profile}>
              <ListItem
                components={Link}
                to="/account"
                // className={classes.listItem}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Avatar
                  alt={name}
                  className={classes.avatar}
                  src="/images/avatars/avatar_1.png"
                />
              </ListItem>
              <Typography className={`${classes.nameText}`} variant="h6">
                {name}
              </Typography>
              <Typography className={classes.bioText} variant="caption">
                {designation}
              </Typography>
            </div>
          </Popover>
        </div>
      )}
    </PopupState>
  );
};

export default Profile;
