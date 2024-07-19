import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";

import { Divider, List } from "@mui/material";
import classes from "./styles.module.css";

const MenuItems = [
  {
    label: "Standard",
    path: "/standard-list",
    allowedUser: ["admin", "teacher", "student"],
  },
  {
    label: "Section",
    path: "/section-list",
    allowedUser: ["admin", "teacher"],
  },
  {
    label: "Fee Head",
    path: "/fee-head-list",
    allowedUser: ["admin"],
  },
  {
    label: "Fee Structure",
    path: "/fee-structure-list",
    allowedUser: ["admin"],
  },
  {
    label: "Designation",
    path: "/designation-list",
    allowedUser: ["admin"],
  },
  {
    label: "Locality",
    path: "/locality-list",
    allowedUser: ["admin", "teacher"],
  },
  {
    label: "Route",
    path: "/route",
    allowedUser: ["admin"],
  },
  {
    label: "Stoppage",
    path: "/stoppage",
    allowedUser: ["admin"],
  },
  {
    label: "City",
    path: "/city-list",
    allowedUser: ["admin", "teacher"],
  },
  {
    label: "State",
    path: "state-list",
    allowedUser: ["admin", "teacher", "student"],
  },
];

const MasterItems = () => {
  const userType = useSelector((state) => state.auth.userType);
  const filteredMenuItems = MenuItems?.filter((item) =>
    item?.allowedUser.includes(userType)
  );

  return (
    <List component="div" style={{ marginTop: "0px", width: "100%" }}>
      <Divider />
      {filteredMenuItems.map((item, index) => (
        <span key={index}>
          <ListItemButton
            activeclassname={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to={item.path}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listListItemButtontemText }}
              primary={item.label}
              className={classes.listItemText}
            />
          </ListItemButton>
          <Divider />
        </span>
      ))}
    </List>
  );
};

export default MasterItems;
