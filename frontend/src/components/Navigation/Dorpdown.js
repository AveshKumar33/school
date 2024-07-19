import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import styles from "./styles.module.css";

const MenuItems1 = [
  {
    label: "Standard",
    path: "/standard-list",
    cName: styles["dropdown-link"],
    allowedUser: ["admin", "teacher", "student"],
  },
  {
    label: "Section",
    path: "/section-list",
    cName: styles["dropdown-link"],
    allowedUser: ["admin", "teacher"],
  },
  {
    label: "Paper",
    path: "/paper",
    cName: styles["dropdown-link"],
    allowedUser: ["admin", "teacher"],
  },
  {
    label: "Designation",
    path: "/designation-list",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
  {
    label: "Teacing Type",
    path: "/teaching-type",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
];

const MenuItems2 = [
  {
    label: "Course Type",
    path: "/course-type",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
  {
    label: "Cast Category",
    path: "/cast-category",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
  {
    label: "Vehicle Driver",
    path: "/vehicle-driver",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
  {
    label: "Vehicle",
    path: "/vehicle",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
  {
    label: "Route",
    path: "/route",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
  {
    label: "Stoppage",
    path: "/stoppage",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
];

const MenuItems3 = [
  {
    label: "Holiday",
    path: "/holiday",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
  {
    label: "Session",
    path: "/session",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
  {
    label: "State",
    path: "state-list",
    cName: styles["dropdown-link"],
    allowedUser: ["admin", "teacher", "student"],
  },
  {
    label: "City",
    path: "/city-list",
    cName: styles["dropdown-link"],
    allowedUser: ["admin", "teacher"],
  },
  {
    label: "Locality",
    path: "/locality-list",
    cName: styles["dropdown-link"],
    allowedUser: ["admin", "teacher"],
  },
  {
    label: "Enquiry Purpose",
    path: "/enquiry/enquiry-purpose",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
];

const MenuItems4 = [
  {
    label: "Student Category",
    path: "/student-category",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
  {
    label: "School Details",
    path: "/school-details",
    cName: styles["dropdown-link"],
    allowedUser: ["admin"],
  },
];

export function MasterDropdownFirst({ onMouseLeave }) {
  const userType = useSelector((state) => state.auth.userType);

  // filter dropdown menu-iten based on user type
  const filteredMenuItems = MenuItems1?.filter((item) =>
    item?.allowedUser.includes(userType)
  );

  return (
    <ul>
      {filteredMenuItems?.map((item, index) => {
        return (
          <li key={index} onClick={onMouseLeave}>
            <NavLink className={item.cName} to={item.path}>
              {item.label}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

export function MasterDropdownSecond({ onMouseLeave }) {
  const userType = useSelector((state) => state.auth.userType);

  // filter dropdown menu-iten based on user type
  const filteredMenuItems = MenuItems2?.filter((item) =>
    item?.allowedUser.includes(userType)
  );

  return (
    <>
      <ul>
        {filteredMenuItems?.map((item, index) => {
          return (
            <li key={index} onClick={onMouseLeave}>
              <NavLink className={item.cName} to={item.path}>
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function MasterDropdownThird({ onMouseLeave }) {
  const userType = useSelector((state) => state.auth.userType);

  // filter dropdown menu-iten based on user type
  const filteredMenuItems = MenuItems3?.filter((item) =>
    item?.allowedUser.includes(userType)
  );

  return (
    <>
      <ul>
        {filteredMenuItems?.map((item, index) => {
          return (
            <li key={index} onClick={onMouseLeave}>
              <NavLink className={item.cName} to={item.path}>
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export function MasterDropdownFourth({ onMouseLeave }) {
  const userType = useSelector((state) => state.auth.userType);

  // filter dropdown menu-iten based on user type
  const filteredMenuItems = MenuItems4?.filter((item) =>
    item?.allowedUser.includes(userType)
  );

  return (
    <>
      <ul>
        {filteredMenuItems?.map((item, index) => {
          return (
            <li key={index} onClick={onMouseLeave}>
              <NavLink className={item.cName} to={item.path}>
                {item.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </>
  );
}
