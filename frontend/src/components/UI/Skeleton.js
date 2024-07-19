import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export default function TableSkeleton() {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rectangular" sx={{ width: "100%", height: 40 }} />
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ width: "100%", height: 40 }}
      />
      <Skeleton variant="rectangular" sx={{ width: "100%", height: 40 }} />
      <Skeleton
        animation="wave"
        variant="rectangular"
        sx={{ width: "100%", height: 40 }}
      />
      <Skeleton variant="rectangular" sx={{ width: "100%", height: 40 }} />
    </Stack>
  );
}
