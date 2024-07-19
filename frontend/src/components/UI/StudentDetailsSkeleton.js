import React from "react";

import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const StudentDetailsSkeleton = () => {
  return (
    <Stack spacing={0.5}>
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ width: "100%", height: 20 }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ width: "100%", height: 20 }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ width: "100%", height: 20 }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ width: "100%", height: 20 }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ width: "100%", height: 20 }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ width: "100%", height: 20 }}
      />
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ width: "100%", height: 20 }}
      />
    </Stack>
  );
};

export default StudentDetailsSkeleton;
