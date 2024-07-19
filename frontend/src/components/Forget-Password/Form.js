import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import UserType from "./UserTypeForm";
import EmailInput from "./EmailInput";
import OtpInput from "./inputOTP";
import SuccessMessage from "./SuccessMessage";
import PasswordChangeInput from "./passwordChangeInput";
import { uiAction } from "../../redux/ui-slice";
import { forgetPassword } from "../../redux/password-slice";
import { changePasswordWithForget } from "../../redux/password-slice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
  borderRadius: "5px",
};

const ForgetPassword = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const [alignment, setAlignment] = useState("admin");
  const disapatch = useDispatch();

  const responseData = useSelector((state) => state.passwordChange.data);

  const isModalOpen = useSelector((state) => state.ui.open);
  const { value } = useSelector((state) => state.ui.multiStepForm);

  let error = false;
  if (alignment === null) {
    error = true;
  }

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleClose = () => {
    disapatch(uiAction.openModal(false));
    disapatch(uiAction.reset());
  };

  let verificationId = responseData?.verificationId;

  useEffect(() => {
    if (responseData?.status === "Success") {
      disapatch(uiAction.next());
    }
  }, [responseData, disapatch]);

  const onSubmit = (data) => {
    // send otp
    if (responseData === null) {
      disapatch(
        forgetPassword({
          data: { ...data, userType: alignment },
          path: "send-otp",
        })
      );
      // verify otp
    } else if (
      responseData?.step === "otp" ||
      responseData?.nxtStep !== "passwordStep"
    ) {
      disapatch(
        forgetPassword({
          data: { ...data, verificationId: verificationId },
          path: "verify-otp",
        })
      );
      // change password
    } else if (responseData?.nxtStep === "passwordStep") {
      if (data.confirmPassword !== data.newPassword) {
        toast.error("Password not matched!", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
        return;
      }

      const password = data.newPassword;

      disapatch(
        changePasswordWithForget({
          userType: alignment,
          verificationId: verificationId,
          password: password,
        })
      );
    }
  };

  let formContent = <UserType />;

  if (value === 1) {
    formContent = (
      <UserType
        alignment={alignment}
        handleChange={handleChange}
        error={error}
      />
    );
  }

  if (value === 2) {
    formContent = (
      <EmailInput userType={alignment} register={register} errors={errors} />
    );
  }

  if (value === 3) {
    formContent = <OtpInput control={control} />;
  }
  if (value === 4) {
    formContent = <PasswordChangeInput register={register} errors={errors} />;
  }
  if (value === 5) {
    formContent = <SuccessMessage onClose={handleClose} />;
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isModalOpen}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isModalOpen}>
          <Box sx={style}>
            <form onSubmit={handleSubmit(onSubmit)}>{formContent}</form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default ForgetPassword;
