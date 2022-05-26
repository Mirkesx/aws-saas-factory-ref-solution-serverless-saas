import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import UsersApi from "../../api/usersApi";
import { IUser } from "../../interfaces/user";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import _ from "lodash";

export default function UsersTable(props: any) {
  const { filter, trigger, setUsersParent } = props;
  const [users, setUsers] = useState([]);
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [orderBy, setOrderBy] = useState({
    id: "user_name",
    type: "asc",
  });
  useEffect(() => {
    setOpenBackDrop(true);
    UsersApi.getUsersList()
      .then((response: any) => {
        response.data.forEach((user: IUser) => {
          user.signature = Math.random();
        });
        setUsers(response.data);
        setUsersParent(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => {
        setOpenBackDrop(false);
      });
  }, [trigger]);

  useEffect(() => {
    let orderedUsers;
    orderedUsers = _.orderBy(
      users,
      [orderBy.id],
      [(orderBy.type as "asc") || "desc"]
    );
    setUsers(orderedUsers);
  }, [orderBy]);

  const handleSortBy = (id: string) => {
    const newOrderBy = {
      id: id,
      type: orderBy.id !== id ? "asc" : orderBy.type === "asc" ? "desc" : "asc",
    };
    setOrderBy(newOrderBy);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1000 }}
        open={openBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{ width: "30%" }}
                className={
                  "user-table-head allow-order " +
                  (orderBy.id === "user_name" ? "selected" : "")
                }
                onClick={() => handleSortBy("user_name")}
              >
                User Name
                {orderBy["id"] === "user_name" ? (
                  orderBy["type"] === "desc" ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )
                ) : (
                  <ArrowDropDownIcon />
                )}
              </TableCell>
              <TableCell
                className={
                  "user-table-head allow-order " +
                  (orderBy.id === "user_role" ? "selected" : "")
                }
                onClick={() => handleSortBy("user_role")}
              >
                User Role
                {orderBy["id"] === "user_role" ? (
                  orderBy["type"] === "desc" ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )
                ) : (
                  <ArrowDropDownIcon />
                )}
              </TableCell>
              <TableCell
                className={
                  "user-table-head allow-order " +
                  (orderBy.id === "signature" ? "selected" : "")
                }
                onClick={() => handleSortBy("signature")}
              >
                Signature
                {orderBy["id"] === "signature" ? (
                  orderBy["type"] === "desc" ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )
                ) : (
                  <ArrowDropDownIcon />
                )}
              </TableCell>
              <TableCell className="user-table-head">Last Login</TableCell>
              <TableCell className="user-table-head">2FA</TableCell>
              <TableCell className="user-table-head">Password</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter(
                (user: IUser) =>
                  !filter ||
                  filter.length == 0 ||
                  user.user_name.startsWith(filter)
              )
              .map((row: IUser) => (
                <TableRow
                  key={row.user_name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.user_name}
                  </TableCell>
                  <TableCell>{row.user_role || ""}</TableCell>
                  <TableCell>{row.signature || ""}</TableCell>
                  <TableCell>{row.last_login || ""}</TableCell>
                  <TableCell>{row.tfa}</TableCell>
                  <TableCell>
                    <a href={"#" + row.user_name}>Send Password Reset Link</a>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
