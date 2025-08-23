import * as React from "react";
import { useState, useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Divider,
  Button,
  Box,
  Stack,
  TextField,
  Modal,
  Autocomplete,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from "sweetalert2";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import AddDashboard from "./AddDashboard";
import EditDashboard from "./EditDashboard";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

export default function DashboardList() {
  const [rows, setRows] = useState([]);
  const [formDataForEdit, setFormDataForEdit] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const roomsRef = collection(db, "rooms");

  // initial fetch
  useEffect(() => {
    getRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRooms = async () => {
    const snap = await getDocs(roomsRef);
    const data = snap.docs.map((d) => {
      const v = d.data();
      // Keep doc.id as canonical roomNo if missing in doc body
      return {
        id: d.id, // doc id === room number
        roomNo: v.roomNo ?? d.id,
        name: v.name ?? "",
        gender: v.gender ?? "",
        date: v.date ?? "",
        isLocked: v.isLocked ?? false,
      };
    });
    // sort by numeric roomNo ascending (optional)
    data.sort((a, b) => Number(a.roomNo) - Number(b.roomNo));
    setRows(data);
  };

  const handleChangePage = (_e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };

  const handleSearchPick = (v) => {
    if (v) {
      setRows([v]);
    } else {
      getRooms();
    }
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenEdit = (row) => {
    setFormDataForEdit(row);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setFormDataForEdit(null);
    setOpenEdit(false);
  };

  const deleteRoom = async (id) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (res.isConfirmed) {
      await deleteDoc(doc(db, "rooms", id));
      await Swal.fire("Deleted!", "The record has been deleted.", "success");
      getRooms();
    }
  };

  const toggleLock = async (id, currentState) => {
    // optimistic UI
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isLocked: !currentState } : r))
    );
    try {
      await updateDoc(doc(db, "rooms", id), { isLocked: !currentState });
    } catch (err) {
      console.error("Error updating lock:", err);
      // revert if failed
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isLocked: currentState } : r))
      );
    }
  };

  return (
    <>
      {/* Add Modal */}
      <Modal open={openAdd} onClose={handleCloseAdd}>
        <Box sx={modalStyle}>
          <AddDashboard
            onClose={handleCloseAdd}
            onDone={() => {
              handleCloseAdd();
              getRooms();
            }}
          />
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box sx={modalStyle}>
          {formDataForEdit && (
            <EditDashboard
              onClose={handleCloseEdit}
              initial={formDataForEdit}
              onDone={() => {
                handleCloseEdit();
                getRooms();
              }}
            />
          )}
        </Box>
      </Modal>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ p: 2, pb: 0 }}
        >
          Rooms Dashboard
        </Typography>
        <Divider />

        <Box height={10} />
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <Autocomplete
            disablePortal
            options={rows}
            sx={{ width: 300 }}
            onChange={(_e, v) => handleSearchPick(v)}
            getOptionLabel={(option) => option.name || ""}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Search by name" />
            )}
          />
          <Typography variant="h6" sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={handleOpenAdd}
          >
            Add
          </Button>
        </Stack>

        <TableContainer sx={{ maxHeight: 520 }}>
          <Table stickyHeader aria-label="rooms table">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 100 }}>NAME</TableCell>
                <TableCell style={{ minWidth: 100 }}>GENDER</TableCell>
                <TableCell style={{ minWidth: 100 }}>ROOM NO.</TableCell>
                <TableCell style={{ minWidth: 140 }}>DATE</TableCell>
                <TableCell style={{ minWidth: 140 }}>ACTION</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.id} hover tabIndex={-1}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.gender}</TableCell>
                    <TableCell>{row.roomNo}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <EditIcon
                          sx={{ fontSize: 20, cursor: "pointer" }}
                          onClick={() => handleOpenEdit(row)}
                          titleAccess="Edit"
                        />
                        <DeleteIcon
                          sx={{ fontSize: 20, color: "darkorange", cursor: "pointer" }}
                          onClick={() => deleteRoom(row.id)}
                          titleAccess="Delete"
                        />
                        {row.isLocked ? (
                          <LockIcon
                            sx={{ fontSize: 20, color: "gray", cursor: "pointer" }}
                            onClick={() => toggleLock(row.id, row.isLocked)}
                            titleAccess="Unlock"
                          />
                        ) : (
                          <LockOpenIcon
                            sx={{ fontSize: 20, color: "gray", cursor: "pointer" }}
                            onClick={() => toggleLock(row.id, row.isLocked)}
                            titleAccess="Lock"
                          />
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}
