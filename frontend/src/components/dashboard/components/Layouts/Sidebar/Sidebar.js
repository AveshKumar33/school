import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import AssignmentIcon from "@mui/icons-material/Assignment";

// import LayersIcon from "@mui/icons-material/Layers";

import { Divider, List } from "@mui/material";
import theme from "../../theme/index";
import classes from "./styles.module.css";
import MasterItems from "./Maters";
// import Profile from "./Profile";

import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
// import LockOpenIcon from "@mui/icons-material/LockOpenOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreIcon from "@mui/icons-material/More";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

const MainListItems = () => {
  const userType = useSelector((state) => state.auth.userType);

  return (
    <nav style={{ backgroundColor: theme.palette.common.white }}>
      {/* <Profile /> */}
      {/* <Divider className={classes.profileDivider} /> */}
      <List component="div" disablePadding>
        <ListItemButton
          className={classes.listItem}
          component={NavLink}
          to="/dashborad"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="Dashboard"
          />
        </ListItemButton>
        {userType === "teacher" && (
          <ListItemButton
            className={classes.listItem}
            component={NavLink}
            to="/assignment"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="Assignment"
            />
          </ListItemButton>
        )}
        <ListItemButton
          activeclassname={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/student-list"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <PersonAddAlt1Icon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="Admission"
          />
        </ListItemButton>
        {userType !== "student" && (
          <ListItemButton
            activeclassname={classes.activeListItem}
            className={classes.listItem}
            component={NavLink}
            to="/employee-list"
          >
            <ListItemIcon className={classes.listItemIcon}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText
              classes={{ primary: classes.listItemText }}
              primary="School Staff"
            />
          </ListItemButton>
        )}

        {/* Transport Start */}
        <ListItemButton
          className={classes.listItem}
          activeclassname={classes.activeListItem}
        >
          <Accordion
            disableGutters
            className={classes.acrItem}
            style={{
              boxShadow: "none",
              marginTop: "-8px",
              marginBottom: "-8px",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ padding: "0px", margin: "0px" }}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <DirectionsBusIcon />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Transport"
                style={{ padding: "0px", margin: "0px" }}
              />
            </AccordionSummary>
            <AccordionDetails
              className={classes.transportItem}
              style={{ padding: "0px", margin: "0px", width: "100%" }}
            >
              <Divider />
              <ListItemButton
                activeclassname={classes.activeListItem}
                className={classes.listItem}
                component={NavLink}
                to="/driver"
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  className={classes.listItemText}
                  primary="Bus Driver"
                />
              </ListItemButton>
              <Divider />
              <ListItemButton
                activeclassname={classes.activeListItem}
                className={classes.listItem}
                component={NavLink}
                to="/transport"
              >
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  className={classes.listItemText}
                  primary="Transport"
                />
              </ListItemButton>
              <Divider />
            </AccordionDetails>
          </Accordion>
        </ListItemButton>
        {/* Transport end */}

        {/* Account start */}
        <ListItemButton
          className={classes.listItem}
          activeclassname={classes.activeListItem}
        >
          <Accordion
            disableGutters
            className={classes.acrItem}
            style={{
              boxShadow: "none",
              marginTop: "-8px",
              marginBottom: "-8px",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ padding: "0px", margin: "0px" }}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <PersonRoundedIcon />
              </ListItemIcon>

              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Accounts"
                style={{ padding: "0px", margin: "0px" }}
                className={classes.listItemText}
              />
            </AccordionSummary>
            <AccordionDetails
              style={{ padding: "0px", margin: "0px", width: "100%" }}
            >
              <Divider />
              <ListItemButton
                activeclassname={classes.activeListItem}
                className={classes.listItem}
                component={NavLink}
                to="/account-group"
              >
                <ListItemIcon>
                  <GroupRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  className={classes.listItemText}
                  primary="Account Group"
                />
              </ListItemButton>
              <Divider />
              <ListItemButton
                activeclassname={classes.activeListItem}
                className={classes.listItem}
                component={NavLink}
                to="/account"
              >
                <ListItemIcon>
                  <SupervisedUserCircleIcon />
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItemButton>
              <Divider />
            </AccordionDetails>
          </Accordion>
        </ListItemButton>
        {/* Account end */}

        {/* Master start */}
        <ListItemButton
          className={classes.listItem}
          activeclassname={classes.activeListItem}
        >
          <Accordion
            disableGutters
            className={classes.acrItem}
            style={{
              boxShadow: "none",
              marginTop: "-8px",
              marginBottom: "-8px",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              style={{ padding: "0px", margin: "0px" }}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <MoreIcon />
              </ListItemIcon>
              <ListItemText
                classes={{ primary: classes.listItemText }}
                primary="Masters"
                style={{ padding: "0px", margin: "0px" }}
              />
            </AccordionSummary>
            <AccordionDetails
              className={classes.masterItem}
              style={{ margin: "0px", width: "100%" }}
            >
              <MasterItems />
            </AccordionDetails>
          </Accordion>
        </ListItemButton>
        {/* Master end */}

        <ListItemButton
          activeclassname={classes.activeListItem}
          className={classes.listItem}
          component={NavLink}
          to="/setting"
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listItemText }}
            primary="Settings"
          />
        </ListItemButton>
      </List>
      <Divider className={classes.listDivider} />
      <List
        component="div"
        disablePadding
        subheader={
          <ListSubheader className={classes.listSubheader}>
            Support
          </ListSubheader>
        }
      >
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>

        <ListItemButton
          className={classes.listItem}
          component="a"
          href="https://oiyniuo.boiu"
          target="_blank"
        >
          <ListItemIcon className={classes.listItemIcon}>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText
            classes={{ primary: classes.listListItemButtontemText }}
            primary="Customer support"
          />
        </ListItemButton>
      </List>
    </nav>
  );
};

export default MainListItems;
