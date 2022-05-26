import { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import UsersTable from "../tables/usersTable";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import UsersApi from "../../api/usersApi";
import AuthUtils from "../../utils/authUtils";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import moment from "moment";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

function Account() {
  const [filter, setFilter] = useState("");
  const [trigger, setTrigger] = useState(moment());
  const [openModal, setOpenModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("TenantUser");
  const [userName, setUserName] = useState("");
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [users, setUsers] = useState([]);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setUserEmail("");
    setUserRole("TenantUser");
    setUserName("");
    setTrigger(moment());
  };

  const handleAdd = () => {
    const userData: any = AuthUtils.getIdTokenPayload();
    let user = {
      tenantId: userData["custom:tenantId"],
      userName,
      userRole,
      userEmail,
    };
    setOpenBackDrop(true);
    UsersApi.createUser(user)
      .then((response: any) => {
        console.log(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => {
        setOpenBackDrop(false);
        handleClose();
      });
  };

  return (
    <div className="page-panel">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={openBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-add-user-title"
        aria-describedby="modal-add-user-description"
      >
        <Box sx={style}>
          <Typography id="modal-add-user-title" variant="h6" component="h2">
            Add a new user
          </Typography>
          <div id="modal-add-user-description">
            <Grid
              container
              spacing={2}
              direction="column"
              alignItems="center"
              justifyContent="top"
              style={{ height: "100%" }}
            >
              <Grid item xs={3} style={{ width: "100%" }}>
                <TextField
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="add-user-input"
                  placeholder="Username"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={3} style={{ width: "100%" }}>
                <TextField
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="add-user-input"
                  placeholder="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={3} style={{ width: "100%" }}>
                <Select
                  value={userRole}
                  fullWidth
                  onChange={(e) => setUserRole(e.target.value)}
                >
                  <MenuItem value={"TenantAdmin"}>Admin</MenuItem>
                  <MenuItem value={"TenantUser"}>User</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={3} style={{ width: "100%" }}>
                <Button variant="contained" color="error" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" color="success" onClick={handleAdd}>
                  Add
                </Button>
              </Grid>
            </Grid>
          </div>
        </Box>
      </Modal>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="top"
        style={{ height: "100%" }}
      >
        <Grid item container direction="row" xs={3} style={{ width: "100%" }}>
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
          {
            (localStorage.getItem("tenantTier") === "Platinum" && users.length < 5) && 
            (<Button
              id="add-user"
              color="success"
              variant="contained"
              size="large"
              onClick={handleOpen}
            >
              <PersonAddAltIcon />
            </Button>)
          }
        </Grid>
        <Grid item xs={3} style={{ padding: "2px", width: "100%" }}>
          <UsersTable filter={filter} trigger={trigger} setUsersParent={setUsers} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Account;
