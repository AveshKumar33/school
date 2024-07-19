import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";

// Material components
import { Badge, IconButton, Popover } from "@mui/material";

// Material icons
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

// Custom components
import NotificationList from "../dashboard/components/Layouts/Topbar/NotifictionList/notification";
import notifications from "../dashboard/data/notifications";
import instance from "../../util/axios/config";
import { authActions } from "../../redux/auth-slice";
import classes from "./styles.module.css";
// import Profile from "./Profile";
import {
  MasterDropdownFirst,
  MasterDropdownSecond,
  MasterDropdownThird,
  MasterDropdownFourth,
} from "./Dorpdown";

const Navbar = () => {
  const [notification, setNotification] = useState({
    notifications: [],
    notificationsLimit: 4,
    notificationsCount: 0,
    notificationsEl: null,
  });

  const disapatch = useDispatch();
  const userType = useSelector((state) => state.auth.userType);

  const initialstate = {
    browse: false,
    discover: false,
    transport: false,
    attendance: false,
  };
  const [click, setClick] = useState(initialstate);
  const [mobileView, setMobileView] = useState(false);

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
      const confirm = window.confirm("Are you sure you want to log out");

      if (!confirm) {
        return;
      }

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

  const onMouseEnter = (activeMenu) => {
    if (!mobileView || window.innerWidth > 760) {
      setClick({ ...initialstate, [activeMenu]: true });
      setMobileView(false);
    }
  };

  const onMouseLeave = () => {
    if (!mobileView || window.innerWidth > 760) {
      setClick({ ...initialstate });
      setMobileView(false);
    }
  };

  const handleMobileViewClick = (activeMenu) => {
    if (mobileView) {
      setClick({ ...initialstate, [activeMenu]: !click[activeMenu] });
    }
  };

  const handleMobileView = () => {
    setMobileView(!mobileView);
    setClick(initialstate);
  };

  // const filteredNavBar = (navLinks) => {
  //   const filteredMenuItems = navLinks?.filter((link) =>
  //     link?.allowedUser.includes(userType)
  //   );

  //   return filteredMenuItems;
  // };

  return (
    <header className={classes["nav-menu"]} aria-label="navigation bar">
      <div className={classes.container}>
        <div className={classes["nav-start"]}>
          {/* <Profile /> */}
          <h1 className={classes.hamburger}>Innov8x</h1>
          <nav
            className={
              mobileView ? `${classes.menu} ${classes.show}` : classes.menu
            }
          >
            <ul className={classes["menu-bar"]} style={{ paddingLeft: "0px" }}>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? `${classes["nav-link"]} ${classes["active-link"]}`
                      : classes["nav-link"]
                  }
                  to="/dashborad"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <button
                  className={`${classes["nav-link"]} ${classes["dropdown-btn"]}`}
                  onMouseEnter={() => onMouseEnter("admission")}
                  onMouseLeave={onMouseLeave}
                  onClick={() => handleMobileViewClick("admission")}
                >
                  Admission
                </button>
                <div
                  id="dropdown2"
                  className={`${
                    click.admission
                      ? `${classes.dropdown} ${classes.active}`
                      : classes.dropdown
                  }`}
                  onMouseLeave={onMouseLeave}
                  onMouseEnter={() => onMouseEnter("admission")}
                >
                  <ul role="menu">
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/enquiry/post-enquiry"
                      >
                        Enquiry
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/student-form"
                      >
                        Registration List
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/student-list"
                      >
                        Admission List
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <button
                  className={`${classes["nav-link"]} ${classes["dropdown-btn"]}`}
                  onMouseEnter={() => onMouseEnter("registration")}
                  onMouseLeave={onMouseLeave}
                  onClick={() => handleMobileViewClick("registration")}
                >
                  Registration
                </button>
                <div
                  id="dropdown2"
                  className={`${
                    click.registration
                      ? `${classes.dropdown} ${classes.active}`
                      : classes.dropdown
                  }`}
                  onMouseLeave={onMouseLeave}
                  onMouseEnter={() => onMouseEnter("registration")}
                >
                  <ul role="menu">
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/student-form"
                      >
                        Student Registration
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/employee-form"
                      >
                        Staff Registration
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/student-list"
                      >
                        Student List
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/employee-list"
                      >
                        Staff List
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/student-migration"
                      >
                        Students Migration
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/student-import"
                      >
                        Students Import
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/student/fee/fee-import"
                      >
                        Fee Record Import
                      </NavLink>
                    </li>
                    {/* <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/employee-list"
                      >
                        Class Section Change
                      </NavLink>
                    </li> */}
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/teacher-specialization"
                      >
                        Teacher Specialization
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <button
                  className={`${classes["nav-link"]} ${classes["dropdown-btn"]}`}
                  onMouseEnter={() => onMouseEnter("fee")}
                  onMouseLeave={onMouseLeave}
                  onClick={() => handleMobileViewClick("fee")}
                >
                  Fees
                </button>
                <div
                  id="dropdown2"
                  className={`${
                    click.fee
                      ? `${classes.dropdown} ${classes.active}`
                      : classes.dropdown
                  }`}
                  onMouseLeave={onMouseLeave}
                  onMouseEnter={() => onMouseEnter("fee")}
                >
                  <ul role="menu">
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/fee/fee-collection"
                      >
                        Fee Collection
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/fee/generate-voucher"
                      >
                        Generate Voucher
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/fee/fee-head-list"
                      >
                        Fee Head
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/fee/fee-structure-list"
                      >
                        Fee Structure
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/fee/fee-discount"
                      >
                        Fee Discounts
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/fee/fee-outstanding"
                      >
                        Fee Outstanding
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/fee/fee-increment"
                      >
                        Fee Increment
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <button
                  className={`${classes["nav-link"]} ${classes["dropdown-btn"]}`}
                  onMouseEnter={() => onMouseEnter("attendance")}
                  onMouseLeave={onMouseLeave}
                  onClick={() => handleMobileViewClick("attendance")}
                >
                  Attendance
                </button>
                <div
                  id="dropdown2"
                  className={`${
                    click.attendance
                      ? `${classes.dropdown} ${classes.active}`
                      : classes.dropdown
                  }`}
                  onMouseLeave={onMouseLeave}
                  onMouseEnter={() => onMouseEnter("attendance")}
                >
                  <ul role="menu">
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/staff-attendance"
                      >
                        Staff Attendance
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/student-attendance"
                      >
                        Student Attendance
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/attendance-history"
                      >
                        Attendance History
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li className={classes["dropdown-li"]}>
                <button
                  className={`${classes["nav-link"]} ${classes["dropdown-btn"]}`}
                  onMouseEnter={() => onMouseEnter("browse")}
                  onMouseLeave={onMouseLeave}
                  onClick={() => handleMobileViewClick("browse")}
                >
                  Masters
                </button>
                <div
                  id="dropdown1"
                  className={`${
                    click.browse
                      ? `${classes.dropdown} ${classes.active}`
                      : classes.dropdown
                  }`}
                  onMouseLeave={onMouseLeave}
                  onMouseEnter={() => onMouseEnter("browse")}
                >
                  <MasterDropdownFirst onMouseLeave={onMouseLeave} />
                  <MasterDropdownSecond onMouseLeave={onMouseLeave} />
                  <MasterDropdownThird onMouseLeave={onMouseLeave} />
                  <MasterDropdownFourth onMouseLeave={onMouseLeave} />
                </div>
              </li>
              <li>
                <button
                  className={`${classes["nav-link"]} ${classes["dropdown-btn"]}`}
                  onMouseEnter={() => onMouseEnter("discover")}
                  onMouseLeave={onMouseLeave}
                  onClick={() => handleMobileViewClick("discover")}
                >
                  Account
                </button>
                <div
                  id="dropdown2"
                  className={`${
                    click.discover
                      ? `${classes.dropdown} ${classes.active}`
                      : classes.dropdown
                  }`}
                  onMouseLeave={onMouseLeave}
                  onMouseEnter={() => onMouseEnter("discover")}
                >
                  <ul role="menu">
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/account-group"
                      >
                        Account Group
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/account"
                      >
                        Account
                      </NavLink>
                    </li>
                  </ul>
                  {/* <ul role="menu">
                    <li>
                      <span className={classes["dropdown-link-title"]}>
                        Download App
                      </span>
                    </li>
                    <li role="menuitem">
                      <a
                        className={classes["dropdown-link"]}
                        href="#mac-windows"
                      >
                        MacOS & Windows
                      </a>
                    </li>
                    <li role="menuitem">
                      <a className={classes["dropdown-link"]} href="#linux">
                        Linux
                      </a>
                    </li>
                  </ul> */}
                </div>
              </li>
              <li>
                <button
                  className={`${classes["nav-link"]} ${classes["dropdown-btn"]}`}
                  onMouseEnter={() => onMouseEnter("transport")}
                  onMouseLeave={onMouseLeave}
                  onClick={() => handleMobileViewClick("transport")}
                >
                  Transport
                </button>
                <div
                  id="dropdown3"
                  className={`${
                    click.transport
                      ? `${classes.dropdown} ${classes.active}`
                      : classes.dropdown
                  }`}
                  onMouseLeave={onMouseLeave}
                  onMouseEnter={() => onMouseEnter("transport")}
                >
                  <ul role="menu">
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/student/transport"
                      >
                        Student Transport
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/staff/transport"
                      >
                        Staff Transport
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <button
                  className={`${classes["nav-link"]} ${classes["dropdown-btn"]}`}
                  onMouseEnter={() => onMouseEnter("exam")}
                  onMouseLeave={onMouseLeave}
                  onClick={() => handleMobileViewClick("exam")}
                >
                  Exam
                </button>
                <div
                  id="dropdown3"
                  className={`${
                    click.exam
                      ? `${classes.dropdown} ${classes.active}`
                      : classes.dropdown
                  }`}
                  onMouseLeave={onMouseLeave}
                  onMouseEnter={() => onMouseEnter("exam")}
                >
                  <ul role="menu">
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/exam/add"
                      >
                        Add Exam
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/exam/type"
                      >
                        Exam Type
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/exam/paper-map"
                      >
                        Exam Paper Map
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/exam/exam-schedule"
                      >
                        Exam Schedule
                      </NavLink>
                    </li>
                    <li role="menuitem" onClick={onMouseLeave}>
                      <NavLink
                        className={classes["dropdown-link"]}
                        to="/exam/exam-marks"
                      >
                        Exam Marks
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </nav>
        </div>

        <div className={classes["nav-end"]}>
          <div className={classes["right-container"]}>
            {/* <a href="#profile">
                <img
                  src="https://ajayprasadverma.github.io/ajay/images/ajay.png"
                  width="30"
                  height="30"
                  alt="user_image"
                />
              </a> */}
          </div>
          {/* <button className={classes.btn}>Log Out</button> */}

          <IconButton
            style={{ color: "white" }}
            onClick={handleShowNotifications}
            title="notification"
          >
            <Badge
              badgeContent={notification.notificationsCount}
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            // color="inherit"
            style={{ color: "white" }}
            onClick={logoutHandler}
            title="logout"
          >
            <LogoutIcon />
          </IconButton>
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
          <button className={classes.hamburger} onClick={handleMobileView}>
            <MenuIcon />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
