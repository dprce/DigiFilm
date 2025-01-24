import React, { useState, useEffect } from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Checkbox
} from "@mui/material";
import { jsPDF } from 'jspdf';
import Navbar from '../../components/Navbar.jsx';
// Import your API function
import { fetchUsers, fetchEmployeeBatchData } from '../../api/RoleApi.jsx';
import checkAuthentication from "../../auth.js";

const EmployeeBatchList = () => {
  const { isAuthenticated } = checkAuthentication();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * Convert an ISO date string like "2025-01-12T18:40:59.133" into a
   * user-friendly format, e.g. "1/12/2025, 6:40:59 PM" depending on locale.
   */
  const formatDateTime = (isoString) => {
    if (!isoString) return "";
    const dateObj = new Date(isoString);
    // You could also combine them like:
    // return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
    return dateObj.toLocaleString(); 
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      return; 
    }
    const loadUsers = async () => {
      try {
        const data = await fetchUsers(); // Fetch the list of employees
        const mappedUsers = data.map(user => ({
          label: `${user.firstName} ${user.lastName}`,
          id: user.id,
        }));
        setEmployees(mappedUsers);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    loadUsers();
  }, []);

  const handleEmployeeSelection = (employeeId) => {
    setSelectedEmployees((prev) =>
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleGeneratePDF = async () => {
    if (selectedEmployees.length === 0) {
      alert("Please select at least one employee.");
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch batch data for selected employees
      const data = await fetchEmployeeBatchData(selectedEmployees);

      // 2. Initialize jsPDF
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      let yPosition = 50;

      // Main title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Employee Digitalization Report", 40, yPosition);
      yPosition += 30;

      // 3. Build the PDF content based on the fetched data
      data.forEach((employee) => {
        // Employee heading
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text(`Employee: ${employee.performedBy}`, 40, yPosition);
        yPosition += 20;

        // For each batch
        employee.batches.forEach((batch) => {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);

          // Batch header
          doc.text(
            `Batch #${batch.batchId} | Status: ${batch.batchStatus} | Created at: ${formatDateTime(
              batch.batchCreatedAt
            )}`,
            60,
            yPosition
          );
          yPosition += 15;

          // Actions
          if (batch.actions?.length) {
            doc.text("Actions for batch:", 70, yPosition);
            yPosition += 12;
            batch.actions.forEach((action) => {
              doc.text(
                `- ${action.action} at ${formatDateTime(action.actionTimestamp)}`,
                90,
                yPosition
              );
              yPosition += 12;
            });
            yPosition += 5;
          }

          // Films
          if (batch.films?.length) {
            doc.text("Films in batch:", 70, yPosition);
            yPosition += 12;
            batch.films.forEach((film) => {
              doc.text(`• ${film.filmTitle}`, 90, yPosition);
              yPosition += 12;
            });
          }

          yPosition += 15;

          // Page overflow check
          if (yPosition > 720) {
            doc.addPage();
            yPosition = 50;
          }
        });

        // Extra spacing between employees
        yPosition += 15;
        if (yPosition > 720) {
          doc.addPage();
          yPosition = 50;
        }
      });

      // 4. Save the PDF
      doc.save(`Digitalization_Report_${new Date().toISOString()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("An error occurred while fetching data or generating the PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Box flex="1" sx={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Employee Digitalization Report
        </Typography>

        {/* Generate PDF button (disabled if no employees selected) */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleGeneratePDF}
          disabled={selectedEmployees.length === 0}
          sx={{ mb: 2 }}
        >
          Generate PDF
        </Button>

        {/* Smaller table with checkbox + name in one cell */}
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Choose the employees you want a report for:</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleEmployeeSelection(employee.id)}
                    />
                    {employee.label}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Loading overlay */}
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

      <Footer />
    </div>
  );
};

export default EmployeeBatchList;
