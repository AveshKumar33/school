import React from "react";
import { Link } from "react-router-dom";

// Material components
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

// Material icons
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import PaymentIcon from "@mui/icons-material/Payment";
// import PeopleIcon from "@mui/icons-material/PeopleOutlined";
// import CodeIcon from "@mui/icons-material/Code";
// import StoreIcon from "@mui/icons-material/Store";
import MessageIcon from "@mui/icons-material/Message";

// Component styles
import theme from "../../../theme/index";
import classes from "./styles.module.css";

// const icons = {
//   order: {
//     icon: <PaymentIcon />,
//     color: "blue",
//   },
//   user: {
//     icon: <PeopleIcon />,
//     color: "red",
//   },
//   product: {
//     icon: <StoreIcon />,
//     color: "green",
//   },
//   feature: {
//     icon: <CodeIcon />,
//     color: "purple",
//   },
// };

const NotificationList = ({ notifications, onSelect }) => {
  return (
    <div className={classes.root}>
      {notifications.length > 0 ? (
        <>
          <div
            style={{ backgroundColor: theme.palette.background.default }}
            className={classes.header}
          >
            <Typography variant="h6">User Notifications</Typography>
            <Typography
              style={{ color: theme.palette.text.secondary }}
              variant="body2"
            >
              {notifications.length} new notifications
            </Typography>
          </div>
          <div className={classes.content}>
            <List component="div">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to="#"
                  style={{ textDecoration: "none" }}
                >
                  <ListItem
                    className={classes.listItem}
                    component="div"
                    onClick={onSelect}
                  >
                    <ListItemIcon
                      className={classes.listItemIcon}
                      //   style={{ color: icons[notification.type].color }}
                    >
                      {/* {icons[notification.type].icon} */}
                      <MessageIcon />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.listItemTextSecondary}
                      primary={notification.title}
                      secondary={notification.when}
                    />
                    <ArrowForwardIosIcon className={classes.arrowForward} />
                  </ListItem>
                  <Divider />
                </Link>
              ))}
            </List>
            <div className={classes.footer}>
              <Button
                color="primary"
                component={Link}
                size="small"
                to="#"
                variant="contained"
              >
                See all
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className={classes.empty}>
          <div className={classes.emptyImageWrapper}>
            <img
              alt="Empty list"
              className={classes.emptyImage}
              src="/images/empty.png"
            />
          </div>
          <Typography variant="h4">There's nothing here...</Typography>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
