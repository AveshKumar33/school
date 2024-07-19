import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { Grid } from "@mui/material";

import { authActions } from "../../redux/auth-slice";
import { fetchData } from "../../redux/http-slice";

const InputIndex = ({ onSelection }) => {
  const [standard, setStandard] = useState([]);
  const [section, setSection] = useState([]);
  const [selectedStandard, setSelectedStandard] = useState({});
  const [selectedSection, setSelectedSection] = useState();

  const { data, httpError, Loading } = useSelector(
    (state) => state.httpRequest
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData({ path: "/standard" }));
  }, [dispatch]);

  useEffect(() => {
    if (Loading === false && !httpError) {
      setStandard(data);
    }
    if (httpError?.status === 401 || httpError?.status === 500) {
      dispatch(authActions.logout());
    }
  }, [dispatch, Loading, httpError, data]);

  useEffect(() => {
    if (selectedStandard) {
      setSection(selectedStandard.sections);
    }
  }, [selectedStandard]);

  const handleStandardChange = (event, value) => {
    setSelectedSection();
    setSelectedStandard(value);
    onSelection(value?._id, selectedSection);
  };

  const handleSectionChange = (event, value) => {
    setSelectedSection(value);
    onSelection(selectedStandard?._id, value);
  };

  return (
    <Grid
      container
      wrap="wrap"
      style={{ display: "flex", alignItems: "center" }}
    >
      <Grid item md={6} sm={12} xs={12} style={{ padding: "5px" }}>
        <Autocomplete
          id="highlights-demo"
          sx={{ width: "100%" }}
          style={{ width: "100%" }}
          options={standard || []}
          getOptionLabel={(standard) => standard?.standard}
          onChange={handleStandardChange}
          renderInput={(params) => <TextField {...params} label="Standard" />}
          renderOption={(props, option, { inputValue }) => {
            const matches = match(option.standard, inputValue, {
              insideWords: true,
            });
            const parts = parse(option.standard, matches);

            return (
              <li {...props}>
                <div>
                  {parts.map((part, index) => (
                    <span
                      key={index}
                      style={{
                        fontWeight: part.highlight ? 700 : 400,
                      }}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
              </li>
            );
          }}
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12} style={{ padding: "5px" }}>
        <Autocomplete
          multiple
          limitTags={2}
          style={{ width: "100%" }}
          id="multiple-limit-tags"
          options={section || []}
          onChange={handleSectionChange}
          value={selectedSection || []}
          getOptionLabel={(option) => option?.section}
          renderInput={(params) => (
            <TextField {...params} label="Section" placeholder="Section" />
          )}
          sx={{ width: "100%" }}
        />
      </Grid>
    </Grid>
  );
};

export default InputIndex;
