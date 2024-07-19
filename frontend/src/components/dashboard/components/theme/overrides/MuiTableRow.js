// Palette
import palette from "../palette";

const MuiTableRow = {
  root: {
    height: "56px",
    "&$selected": {
      backgroundColor: palette.background.default,
    },
    "&$hover": {
      "&:hover": {
        backgroundColor: palette.background.default,
      },
    },
  },
};

export default MuiTableRow;
