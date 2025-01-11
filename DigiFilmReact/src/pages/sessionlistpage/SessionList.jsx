import React, { useState } from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./SessionList.css";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Button, Box } from "@mui/material";
import { jsPDF } from 'jspdf';
import {user} from "@nextui-org/theme";

const SessionList = () => {
    const [batches, setBatches] = useState([
        { id: 1, movies: ["Movie 1", "Movie 2"], totalDuration: "00:45:00" },
        { id: 2, movies: ["Movie 3", "Movie 4"], totalDuration: "00:35:15" },
        { id: 3, movies: ["Movie 5", "Movie 6", "Movie 7"], totalDuration: "00:40:20" },
    ]);
    const [selectedBatches, setSelectedBatches] = useState([]);

    const handleSelectBatch = (id) => {
        if(selectedBatches.includes(id)){
            setSelectedBatches(selectedBatches.filter(batchId => batchId !== id));
        } else {
            setSelectedBatches([...selectedBatches, id]);
        }
    }

    const generatePDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Report: returned archive material", 20, 20);

        let yPosition = 60;

        doc.setFontSize(12);
        doc.text(`Employee: ${user.name}`, 20, 30);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
        doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 50);
        yPosition = yPosition + 10;

        selectedBatches.forEach((batchId, index) => {
            const batch = batches.find(b => b.id === batchId);
            doc.text(`${index +1}. Batch ${batchId}`, 20, yPosition);
            yPosition = yPosition + 10;
            doc.text(`  Movies: ${batch.movies.join(", ")}`, 20, yPosition);
            yPosition = yPosition + 10;
            doc.text(`  Total duration: ${batch.totalDuration}`, 20, yPosition);
            yPosition = yPosition + 10;

            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        doc.save(`CompletionReport_${new Date().toISOString()}.pdf`);

        setBatches(batches.filter(batch => !selectedBatches.includes(batch.id)));
        setSelectedBatches([]);
    }

    return (
        <div className="sessionlist">
            <Header/>
            <Box sx={{ padding: "20px" }}>
                <h2>Session list</h2>
                <Table aria-label="session table">
                    <TableHeader>
                        <TableColumn>SELECT</TableColumn>
                        <TableColumn>BATCH ID</TableColumn>
                        <TableColumn>MOVIES</TableColumn>
                        <TableColumn>TOTAL DURATION</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {batches.map(batch => (
                            <TableRow key={batch.id}>
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedBatches.includes(batch.id)}
                                        onChange={() => handleSelectBatch(batch.id)}
                                    />
                                </TableCell>
                                <TableCell>{batch.id}</TableCell>
                                <TableCell>{batch.movies.join(", ")}</TableCell>
                                <TableCell>{batch.totalDuration}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {selectedBatches.length > 0 && (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={generatePDF}
                        style={{ marginTop: "20px" }}
                    >
                        Confirm
                    </Button>
                )}
            </Box>

            <Footer />
        </div>
    )
}

export default SessionList;