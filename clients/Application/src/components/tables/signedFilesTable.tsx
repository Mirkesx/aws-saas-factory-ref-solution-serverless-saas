import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ArtifactsApi from "../../api/artifactsApi";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import _ from "lodash";
import { IFile } from "../../interfaces/files";
import prettyBytes from "pretty-bytes";

export default function SignedFilesTable(props: any) {
  const { filter } = props;
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [files, setFiles] = useState([]);
  const [orderBy, setOrderBy] = useState({
    id: "original_name",
    type: "asc",
  });
  useEffect(() => {
    setOpenBackDrop(true);
    ArtifactsApi.getArtifacts()
      .then((response: any) => {
        response.data.forEach((file: IFile) => {
          file.date_signed = Math.random();
        });
        setFiles(response.data);
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => {
        setOpenBackDrop(false);
      });
  }, []);

  useEffect(() => {
    let orderedFiles;
    orderedFiles = _.orderBy(
      files,
      [orderBy.id],
      [(orderBy.type as "asc") || "desc"]
    );
    setFiles(orderedFiles);
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
                  (orderBy.id === "original_name" ? "selected" : "")
                }
                onClick={() => handleSortBy("original_name")}
              >
                Name
                {orderBy["id"] === "original_name" ? (
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
                  (orderBy.id === "date_signed" ? "selected" : "")
                }
                onClick={() => handleSortBy("date_signed")}
              >
                Date Signed
                {orderBy["id"] === "date_signed" ? (
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
                  (orderBy.id === "size" ? "selected" : "")
                }
                onClick={() => handleSortBy("size")}
              >
                Size
                {orderBy["id"] === "size" ? (
                  orderBy["type"] === "desc" ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )
                ) : (
                  <ArrowDropDownIcon />
                )}
              </TableCell>
              <TableCell className="user-table-head">Signature</TableCell>
              <TableCell className="user-table-head">Signer</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files
              .filter(
                (file: IFile) =>
                  !filter ||
                  filter.length == 0 ||
                  file.original_name!.startsWith(filter)
              )
              .map((row: IFile) => (
                <TableRow
                  key={row.artifactId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.original_name}
                  </TableCell>
                  <TableCell>{row.date_signed || ""}</TableCell>
                  <TableCell>
                    {(row.size && prettyBytes(row.size)) || ""}
                  </TableCell>
                  <TableCell>
                    <a href={"#" + row.original_name}>Download</a>
                  </TableCell>
                  <TableCell>{row.username}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
