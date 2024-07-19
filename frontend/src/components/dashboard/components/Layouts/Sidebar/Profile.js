import { useSelector } from "react-redux";

import { Avatar, ListItem, Typography } from "@mui/material";

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
  );
};

export default Profile;
