import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// Material components
import { Badge, IconButton, Popover } from "@mui/material";

// Material icons
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

// Custom components
import NotificationList from "./NotifictionList/notification";
import notifications from "../../../data/notifications";
import instance from "../../../../../util/axios/config";
import { authActions } from "../../../../../redux/auth-slice";

// Component styles
import classes from "./styles.module.css";

const Topbar = () => {
  const [notification, setNotification] = useState({
    notifications: [],
    notificationsLimit: 4,
    notificationsCount: 0,
    notificationsEl: null,
  });

  const disapatch = useDispatch();
  const userType = useSelector((state) => state.auth.userType);

  useEffect(() => {
    let isMounted = true;

    const getNotifications = async (limit = 6) => {
      try {
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              notifications: notifications.slice(0, limit),
              notificationsCount: notifications.length,
            });
          }, 700);
        });

        if (isMounted) {
          setNotification((prevState) => ({
            ...prevState,
            notifications: response.notifications,
            notificationsCount: response.notificationsCount,
          }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    getNotifications();

    return () => {
      isMounted = false;
    };
  }, []);

  const logoutHandler = async () => {
    try {
      const response = await instance.post(`/logout?user=${userType}`);

      if (response.data.status === "success") {
        disapatch(authActions.logout());

        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message, {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    }
  };

  const handleShowNotifications = (event) => {
    setNotification((prevState) => ({
      ...prevState,
      notificationsEl: event.currentTarget,
    }));
  };

  const handleCloseNotifications = () => {
    setNotification((prevState) => ({
      ...prevState,
      notificationsEl: null,
    }));
  };

  const showNotifications = Boolean(notification.notificationsEl);

  return (
    <>
      <div className={classes.root}>
        <IconButton
          color="inherit"
          className={classes.notificationsButton}
          onClick={handleShowNotifications}
        >
          <Badge
            badgeContent={notification.notificationsCount}
            color="secondary"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton
          color="inherit"
          className={classes.signOutButton}
          onClick={logoutHandler}
        >
          <LogoutIcon />
        </IconButton>
      </div>
      <Popover
        anchorEl={notification.notificationsEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={handleCloseNotifications}
        open={showNotifications}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <NotificationList
          notifications={notification.notifications}
          onSelect={handleCloseNotifications}
        />
      </Popover>
    </>
  );
};
export default Topbar;
