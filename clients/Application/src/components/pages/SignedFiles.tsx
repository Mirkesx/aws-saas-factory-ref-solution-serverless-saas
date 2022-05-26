import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import SignedFilesTable from "../tables/signedFilesTable";

function SignedFiles() {
  const [filter, setFilter] = useState("");
  return (
    <div className="page-panel">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="top"
        style={{ height: "100%" }}
      >
        <Grid item xs={3} style={{ width: "100%" }}>
          <TextField
            className="search-field"
            placeholder="Search"
            variant="outlined"
            fullWidth
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={3} style={{ padding: "2px", width: "100%" }}>
          <SignedFilesTable filter={filter}/>
        </Grid>
      </Grid>
    </div>
  );
}

export default SignedFiles;