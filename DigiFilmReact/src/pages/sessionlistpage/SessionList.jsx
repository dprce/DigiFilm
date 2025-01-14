import React, { useState, useEffect } from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import { Box, Typography, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Autocomplete } from "@mui/material";
import { jsPDF } from 'jspdf';
import "./SessionList.css";
import { fetchBatches } from '../../api/RoleApi.jsx'; // Adjust as needed
import { fetchUsers } from '../../api/RoleApi.jsx';
import { sendReturnedBatches } from '../../api/RoleApi.jsx'; // <--- Import your helper function
import Navbar from '../../components/Navbar.jsx';


const SessionList = () => {
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [users, setUsers] = useState([]);

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
        batch.movies.join(", ").toLowerCase().includes(lowerCaseQuery) ||
        batch.id.toString().includes(lowerCaseQuery) ||
        batch.totalDuration.toLowerCase().includes(lowerCaseQuery) ||
        (batch.status && batch.status.toLowerCase().includes(lowerCaseQuery))
      );
      setFilteredBatches(result);
    }
  };

  const generatePDF = async () => {
    if(!selectedEmployee){
        alert("Please select your name from the dropdown menu.");
        return;
    }
    // 1) Send selected batches to your backend
    try {
      await sendReturnedBatches(selectedBatches, batches, selectedEmployee?.label);
      console.log("Selected batches successfully sent to backend");
    } catch (error) {
      console.error("Error sending data to backend:", error);
      // handle error gracefully if needed
    }

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
  };

  return (
    <div className="sessionlist">
      <Navbar /> {/* Add the Navbar here */}
      <Header />
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Batch List
        </Typography>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            fullWidth
          />
        </Box>
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Select</TableCell>
                <TableCell>Batch Number</TableCell>
                <TableCell>Movies</TableCell>
                <TableCell>Total Duration</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBatches.map((batch) => (
                <TableRow key={batch.id} hover>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedBatches.includes(batch.id)}
                      onChange={() => handleSelectBatch(batch.id)}
                      disabled={batch.status === "Digitalized"}
                    />
                  </TableCell>
                  <TableCell>{batch.id}</TableCell>
                  <TableCell>{batch.movies}</TableCell>
                  <TableCell>{batch.totalDuration}</TableCell>
                  <TableCell>{batch.status}</TableCell>
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
      <Footer />
    </div>
  );
};

export default SessionList;
