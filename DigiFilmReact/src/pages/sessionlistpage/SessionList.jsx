import React, { useState, useEffect } from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Autocomplete,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ToggleButton, ToggleButtonGroup
} from "@mui/material";
import { jsPDF } from 'jspdf';
import "./SessionList.css";
import "../../css/common.css"
import { fetchBatches } from '../../api/RoleApi.jsx'; // Adjust as needed
import { fetchUsers } from '../../api/RoleApi.jsx';
import { sendReturnedBatches } from '../../api/RoleApi.jsx'; // <--- Import your helper function
import Navbar from '../../components/Navbar.jsx';
import {fetchCurrentUser} from "../../components/Navbar.jsx";

const SessionList = () => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false); // Spinner state
  const [dialogOpen, setDialogOpen] = useState(false); // Dialog state
  const [dialogMessage, setDialogMessage] = useState(""); // Dialog message
  const [doneBatches, setDoneBatches] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [role, setRole] = useState(null); // Role state

  useEffect(() => {
    const initializeUserRole = async () => {
      try {
        const userData = await fetchCurrentUser();
        const roleClaim = userData?.find((claim) => claim.type === 'RoleId');
        setRole(roleClaim?.value || null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setRole(null);
      }
    };

    initializeUserRole();
  }, []);


  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const data = await fetchBatches();
        const mappedBatches = data.map(batch => ({
          id: batch.batchID,
          movies: batch.movies,
          totalDuration: batch.totalDuration,
          status: batch.status,
          createdBy: batch.createdBy
        }));
        setBatches(mappedBatches);
        setFilteredBatches(mappedBatches);
      } catch (error) {
        console.error("Error fetching batches:", error);
      }
    };

    fetchBatchData();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      const mappedUsers = data.map(user => ({
        label: `${user.firstName} ${user.lastName}`,
        id: user.id,
      }));
      setUsers(mappedUsers);
    };

    loadUsers();
  }, []);

  const handleSelectBatch = (id) => {
    if (selectedBatches.includes(id)) {
      setSelectedBatches(selectedBatches.filter(batchId => batchId !== id));
    } else {
      setSelectedBatches([...selectedBatches, id]);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredBatches(batches);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const result = batches.filter(batch =>
          batch.movies.toLowerCase().includes(lowerCaseQuery) ||
          batch.id.toString().includes(lowerCaseQuery) ||
          batch.totalDuration.toLowerCase().includes(lowerCaseQuery) ||

          ((role ==="3" || role ==="4") && batch.createdBy.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredBatches(result);
    }
  };

  const handleStatusFilter = (newFilter) => {
    if (newFilter){
      setStatusFilter(newFilter);
      const lowerCaseQuery = searchQuery.toLowerCase();
      let result = batches;

      if(lowerCaseQuery !== ""){
        result = batches.filter((batch) =>
            batch.title.toLowerCase().includes(lowerCaseQuery)
        );
      }

      if(newFilter !== "All"){
        result = result.filter(
            (batch) =>
                (newFilter === "Digitalized" && batch.status === "Digitalized") ||
                (newFilter === "Not digitalized" && batch.status === "Not Digitalized")
        )
      }

      setFilteredBatches(result);
    }
  }

  const generatePDF = async () => {
    if (!selectedEmployee) {
      alert("Please select your name from the dropdown menu.");
      return;
    }

    try {
      setLoading(true); // Show spinner

      // 1) Send selected batches to your backend
      await sendReturnedBatches(selectedBatches, batches, selectedEmployee?.label);
      console.log("Selected batches successfully sent to backend");

      // 2) Generate the PDF
      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Report: Returned archive material", 20, 20);

      let yPosition = 60;

      doc.setFontSize(12);
      doc.text(`Employee: ${selectedEmployee?.label}`, 20, 30);
      doc.text(`Return date: ${new Date().toLocaleDateString()}`, 20, 40);
      doc.text(`Return time: ${new Date().toLocaleTimeString()}`, 20, 50);
      yPosition += 10;

      selectedBatches.forEach((batchId, index) => {
        const batch = batches.find(b => b.id === batchId);

        doc.text(`${index + 1}. Batch ${batchId}`, 20, yPosition);
        yPosition += 10;

        doc.text(`  Sent to digitalization by: ${batch.createdBy}`, 20, yPosition);
        yPosition += 10;

        doc.text(`  Films in batch: ${batch.movies}`, 20, yPosition);
        yPosition += 10;

        doc.text(`  Total duration of batch: ${batch.totalDuration}`, 20, yPosition);
        yPosition += 10;

        // Handle page overflow
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });

      doc.save(`Digitalization_${new Date().toISOString()}.pdf`);

      // Optional: Clear selected batches if desired
      setSelectedBatches([]);

      // Show success message
      setDialogMessage("Batches successfully returned and PDF generated.");
      setDialogOpen(true);
    } catch (error) {
      console.error("Error sending data to backend:", error);
      setDialogMessage("An error occurred while processing the request.");
      setDialogOpen(true);
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    window.location.reload(); // Reload page
  };

  return (
      <div className="app-container">
        <Navbar /> {/* Add the Navbar here */}
        <Box sx={{ padding: "20px" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Batch List
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <TextField
                label="Search batches"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                sx={{ width: "70%" }}
            />
            <Typography sx={{ marginLeft: "5%" }}>
                Batches found: {filteredBatches.length}
            </Typography>
          </Box>
          <ToggleButtonGroup
              value={statusFilter}
              exclusive
              onChange={(e, newFilter) => handleStatusFilter(newFilter)}
              sx={{ marginBottom: "16px" }}
          >
            <ToggleButton value="All">All</ToggleButton>
            <ToggleButton value="Digitalized">Digitalized</ToggleButton>
            <ToggleButton value="Not digitalized">Not digitalized</ToggleButton>
          </ToggleButtonGroup>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  {role !== "2" &&
                      <TableCell>Select</TableCell>
                  }
                  <TableCell>Batch Number</TableCell>
                  <TableCell>Movies</TableCell>
                  <TableCell>Total Duration</TableCell>
                  <TableCell>Status</TableCell>
                  {(role ==="3" || role === "4") &&
                      <TableCell>Responsible Employee</TableCell>
                  }

                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBatches.map((batch) => (
                    <TableRow key={batch.id} hover>
                      {role !== "2" &&
                          <TableCell>
                            <input
                                type="checkbox"
                                checked={selectedBatches.includes(batch.id)}
                                onChange={() => handleSelectBatch(batch.id)}
                                disabled={batch.status === "Digitalized"}
                            />
                          </TableCell>
                      }
                      <TableCell>{batch.id}</TableCell>
                      <TableCell>{batch.movies}</TableCell>
                      <TableCell>{batch.totalDuration}</TableCell>
                      <TableCell>{batch.status}</TableCell>
                      {(role ==="3" || role ==="4") &&
                          <TableCell>{batch.createdBy}</TableCell>
                      }
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Autocomplete
              options={users}
              value={selectedEmployee}
              getOptionLabel={(option) => option.label}
              onChange={(e, newValue) => setSelectedEmployee(newValue)}
              renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.label}
                  </li>
              )}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      label="Responsible Employee"
                      variant="outlined"
                      fullWidth
                  />
              )}
              sx={{ mt: 4 }}
          />
          {selectedBatches.length > 0 && (
              <Button
                  variant="contained"
                  color="secondary"
                  onClick={generatePDF}
                  style={{ marginTop: "20px" }}
              >
                Generate PDF
              </Button>
          )}
        </Box>
        {loading && (
            <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                  zIndex: 1000,
                }}
            >
              <CircularProgress size={80} />
            </Box>
        )}

        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Footer />
      </div>
  );
};

export default SessionList;
