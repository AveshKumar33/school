import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../util/axios/config";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import styles from "./EmployeeForm.module.css";

const EditEmployeeForm = ({ value }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const employeeData = { ...value };

  const navigate = useNavigate();
  const params = useParams();

  const [city, setCity] = useState([]);
  const [state, setState] = useState();
  const [locality, setLocality] = useState();
  const [designation, setDesignation] = useState();

  const [selectedCity, setSelectedCity] = useState(employeeData.city);
  const [selectedLocality, setSelectedLoclity] = useState(
    employeeData.locality
  );
  const [selectedState, setSelectedState] = useState(employeeData.state);
  const [selectedDesignation, setSelectedDesignation] = useState(
    employeeData.designation
  );

  const getCity = async () => {
    try {
      const response = await axios.get(`/city`);
      //   if (!response.ok) {
      //     return json({ message: "Could not fetch datas." }, { status: 500 });
      //   } else {
      // }

      setCity(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getState = async () => {
    try {
      const response = await axios.get(`/state`);
      //   if (!response.ok) {
      //     return json({ message: "Could not fetch datas." }, { status: 500 });
      //   } else {
      // }
      setState(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getLocality = async () => {
    try {
      const response = await axios.get(`/locality`);
      //   if (!response.ok) {
      //     return json({ message: "Could not fetch datas." }, { status: 500 });
      //   } else {
      // }
      setLocality(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getDesignation = async () => {
    try {
      const response = await axios.get(`/designation`);
      //   if (!response.ok) {
      //     return json({ message: "Could not fetch datas." }, { status: 500 });
      //   } else {
      // }
      setDesignation(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCity();
    getState();
    getLocality();
    getDesignation();
  }, []);

  const cityField = register("city");
  const localityField = register("locality");
  const stateField = register("state");
  const desigField = register("designation");

  function validateEmptyFields(data) {
    const emptyFields = [];

    for (const key in data) {
      if (data[key] === "" && key !== "middleName") {
        emptyFields.push(key);
      }
    }

    return emptyFields;
  }

  const onCityChange = (e) => {
    setSelectedCity(e.target.value);
  };
  const onLocalityChange = (e) => {
    setSelectedLoclity(e.target.value);
  };
  const onStateChange = (e) => {
    setSelectedState(e.target.value);
  };

  const onDesignationChange = (e) => {
    setSelectedDesignation(e.target.value);
  };

  const formateDate = (date) => {
    const d = new Date(date);
    const formattedDate = d.toISOString().split("T")[0];
    return formattedDate;
  };

  const formattedDob = formateDate(value?.dateOfBirth);

  const postEmployee = async (data) => {
    try {
      const response = await axios.put("/employee/" + params.id, data);

      if (response.data.status === "failed") {
        return response;
      }

      if (response.data.status === "Success") {
        toast.success(response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });

        navigate("/employee-list");
      }
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const onSubmit = (data) => {
    const updatedData = {
      ...data,
      designation: selectedDesignation,
      state: selectedState,
      locality: selectedLocality,
      city: selectedCity,
    };

    const emptyFields = validateEmptyFields(updatedData);

    if (emptyFields.length > 0) {
      toast.error("All fields are required!", {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
      return;
    }

    postEmployee(updatedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <h1 style={{ textAlign: "center", marginTop: "80px" }}>Employee Form</h1>
      <div>
        <div className={styles["personal-info-contnr"]}>
          <h3>PERSIONAL INFORMATION</h3>
          <div className={`${styles["p-info"]} ${styles["p-info-salutation"]}`}>
            <label htmlFor="salutation">Salutation</label>
            <select
              id="salutation"
              name="salutation"
              style={{ marginTop: "6px" }}
              defaultValue={value?.salutation || ""}
              {...register("salutation", { required: true })}
            >
              <option value="">------- Select --------</option>
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
            </select>
            {errors.salutation && <span>This field is required</span>}
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="employeeNo">Employee No</label>
            <input
              type="text"
              className={styles.input}
              id="employeeNo"
              name="employeeNo"
              defaultValue={value?.employeeNo || ""}
              {...register("employeeNo", { required: true })}
            />
            {errors.employeeNo && <span>This field is required</span>}
          </div>
          <div className={`${styles["p-info"]}`}>
            <label htmlFor="cast">Designation</label>
            <select
              id="designation"
              name="designation"
              value={selectedDesignation}
              {...desigField}
              onChange={(e) => {
                desigField.onChange(e);
                onDesignationChange(e);
              }}
            >
              <option value="">
                ----------- Select Designation ----------
              </option>
              {designation
                ?.sort((a, b) => a.title.localeCompare(b.title))
                .map((desig) => (
                  <option key={desig._id} value={desig._id}>
                    {desig.title}
                  </option>
                ))}
            </select>
            {errors.designation && <span>This field is required</span>}
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              className={styles.input}
              name="firstName"
              id="firstName"
              defaultValue={value?.firstName || ""}
              {...register("firstName", { required: true })}
            />
            {errors.firstName && <span>This field is required</span>}
          </div>
          <div className={styles["p-info"]}>
            <label>Middle Name</label>
            <input
              type="text"
              name="middleName"
              id="mName"
              defaultValue={value?.middleName || ""}
              {...register("middleName")}
            />
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="lName">Last Name</label>
            <input
              type="text"
              className={styles.input}
              name="lastName"
              id="lName"
              defaultValue={value?.lastName || ""}
              {...register("lastName", { required: true })}
            />
            {errors.lastName && <span>This field is required</span>}
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="fatherName">Father Name</label>
            <input
              type="text"
              className={styles.input}
              name="fatherName"
              id="fatherName"
              defaultValue={value?.fatherName || ""}
              {...register("fatherName", { required: true })}
            />
            {errors.fatherName && <span>This field is required</span>}
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="motherName">Mother Name</label>
            <input
              type="text"
              className={styles.input}
              id="motherName"
              name="motherName"
              defaultValue={value?.motherName || ""}
              {...register("motherName", { required: true })}
            />
            {errors.motherName && <span>This field is required</span>}
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="mobileNo">Mobile No</label>
            <input
              type="tel"
              id="mobileNo"
              name="mobileNo"
              defaultValue={value?.mobileNo || ""}
              {...register("mobileNo", { required: true })}
            />
            {errors.mobileNo && <span>This field is required</span>}
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="emailId">Email Id</label>
            <input
              type="email"
              id="emailId"
              name="email"
              defaultValue={value?.email || ""}
              {...register("email", { required: true })}
            />
            {errors.email && <span>This field is required</span>}
          </div>
          <div className={`${styles["p-info"]} ${styles["p-info-select"]}`}>
            <div className={styles["p-info"]}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                defaultValue={value?.gender || ""}
                style={{ marginTop: "6px" }}
                {...register("gender", { required: true })}
              >
                <option value="">------ Gender ------</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span>This field is required</span>}
            </div>
            <div className={`${styles["p-info"]} ${styles["p-info-bottom"]}`}>
              <label htmlFor="cast">Cast</label>
              <select
                id="cast"
                name="cast"
                defaultValue={value?.cast || ""}
                style={{ marginTop: "6px" }}
                {...register("cast", { required: true })}
              >
                <option value="">----- Cast -----</option>
                <option value="BC-I">BC-I</option>
                <option value="BC-II">BC-II</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="General">General</option>
              </select>
              {errors.cast && <span>This field is required</span>}
            </div>
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="dob">Date Of Birth</label>
            <input
              type="date"
              className={styles.input}
              id="dob"
              name="dateOfBirth"
              defaultValue={formattedDob}
              {...register("dateOfBirth", { required: true })}
            />
            {errors.dateOfBirth && <span>This field is required</span>}
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="bloogGroup">Blood Group</label>
            <input
              type="text"
              className={styles.input}
              id="bloogGroup"
              name="bloodGroup"
              defaultValue={value?.bloodGroup || ""}
              {...register("bloodGroup", { required: true })}
            />
            {errors.bloodGroup && <span>This field is required</span>}
          </div>
          <div className={`${styles["p-info"]} ${styles["add-sec"]}`}>
            <label htmlFor="distric">District</label>
            <input
              type="text"
              className={styles.input}
              id="distric"
              name="distric"
              defaultValue={value?.district || ""}
              {...register("district", { required: true })}
            />
            {errors.district && <span>This field is required</span>}
          </div>
          <div className={`${styles["p-info"]} ${styles["add-sec"]}`}>
            <label htmlFor="pinCode">Pin Code</label>
            <input
              type="number"
              className={styles.input}
              id="pinCode"
              name="pinCode"
              pattern="^[0-9]+$"
              defaultValue={value?.pinCode || ""}
              {...register("pinCode", { required: true })}
            />
            {errors.pinCode && <span>This field is required</span>}
          </div>
        </div>

        <div className={styles["address-sec-contnr"]}>
          <div className={styles.address}>
            <div
              className={`${styles["p-info"]} ${styles["add-sec"]} ${styles["addL1"]}`}
            >
              <label htmlFor="addL1">Correspondence Address</label>
              <textarea
                rows="2"
                type="text"
                name="correspondenceAdd"
                id="addL1"
                defaultValue={value?.correspondenceAdd || ""}
                {...register("correspondenceAdd", { required: true })}
              ></textarea>
              {errors.correspondenceAdd && <span>This field is required</span>}
            </div>
            <div
              className={`${styles["p-info"]} ${styles["add-sec"]} ${styles["addL2"]}`}
            >
              <label htmlFor="addL2">Permanent Address</label>
              <textarea
                rows="2"
                type="text"
                name="prmanentAdd"
                id="addL2"
                defaultValue={value?.permanentAdd || ""}
                {...register("permanentAdd", { required: true })}
              ></textarea>
              {errors.permanentAdd && <span>This field is required</span>}
            </div>
          </div>
          <div className={`${styles["p-info"]} ${styles["p-info-bottom"]}`}>
            <label htmlFor="cast">City</label>
            <select
              id="city"
              name="city"
              value={selectedCity}
              {...cityField}
              onChange={(e) => {
                cityField.onChange(e);
                onCityChange(e);
              }}
            >
              <option value="">---------- Select City ----------</option>
              {city
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((name) => (
                  <option key={name._id} value={name._id}>
                    {name.name}
                  </option>
                ))}
            </select>
            {errors.city && <span>This field is required</span>}
          </div>
          <div className={`${styles["p-info"]} ${styles["p-info-bottom"]}`}>
            <label htmlFor="locality">Locality</label>
            <select
              id="locality"
              name="locality"
              value={selectedLocality}
              {...localityField}
              onChange={(e) => {
                localityField.onChange(e);
                onLocalityChange(e);
              }}
            >
              <option value="">---------- Select Locality ----------</option>
              {locality
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((name) => (
                  <option key={name._id} value={name._id}>
                    {name.name}
                  </option>
                ))}
            </select>
            {errors.locality && <span>This field is required</span>}
          </div>
          <div className={`${styles["p-info"]} ${styles["p-info-bottom"]}`}>
            <label htmlFor="state">State</label>
            <select
              id="state"
              name="state"
              value={selectedState}
              {...stateField}
              onChange={(e) => {
                stateField.onChange(e);
                onStateChange(e);
              }}
            >
              <option value="">------- Select State ------</option>
              {state
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((name) => (
                  <option key={name._id} value={name._id}>
                    {name.name}
                  </option>
                ))}
            </select>
            {errors.state && <span>This field is required</span>}
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="nationality">Nationality</label>
            <input
              type="text"
              className={styles.input}
              id="nationality"
              name="nationality"
              defaultValue={value?.nationality || ""}
              {...register("nationality", { required: true })}
            />
            {errors.nationality && <span>This field is required</span>}
          </div>
          <div className={styles["p-info"]}>
            <label htmlFor="password">Password</label>
            <input
              type="text"
              className={styles.input}
              id="password"
              name="password"
              defaultValue={value?.password || ""}
              {...register("password", { required: true })}
            />
            {errors.password && <span>This field is required</span>}
          </div>
        </div>
      </div>
      <div className={styles["submit-button"]}>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default EditEmployeeForm;
