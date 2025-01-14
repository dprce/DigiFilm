import { useState, useEffect } from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./SessionList.css";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import {Button, Box, TableContainer, Paper} from "@mui/material";
import { jsPDF } from 'jspdf';
import {user} from "@nextui-org/theme";


const SessionList = (/*{userRole}*/) => {
    const [batches, setBatches] = useState([]);
    const [selectedBatches, setSelectedBatches] = useState([]);
    const [doneBatches, setDoneBatches] = useState([]);

    useEffect(() => {
        const fetchBatches = async () => {
            const response = await fetch('/batches.json');
            const data = await response.json();
            setBatches(data);
        }

        fetchBatches();
    }, []);

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
            doc.text(`  Movies:`, 20, yPosition);
            yPosition = yPosition + 10;
            for(let i = 0; i < batch.movies.length; i++) {
                doc.text(`      ${batch.movies[i]}`, 20, yPosition);
                yPosition = yPosition + 10;
            }
            doc.text(`  Total duration: ${batch.totalDuration}`, 20, yPosition);
            yPosition = yPosition + 10;
            doc.text(`  Responsible employee: ${batch.employee}`, 20, yPosition);
            yPosition = yPosition + 10;

            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
        });

        const pageCount = doc.internal.getNumberOfPages();
        const pageHeight = doc.internal.pageSize.height;
        const pageWidth = doc.internal.pageSize.width;
        doc.setPage(pageCount);

        doc.text("Signature: ", pageWidth - 90, pageHeight - 25);
        doc.line(pageWidth - 70, pageHeight - 25, pageWidth - 10, pageHeight - 25);

        doc.save(`CompletionReport_${new Date().toISOString()}.pdf`);

        setBatches(batches.filter(batch => !selectedBatches.includes(batch.id)));
        setSelectedBatches([]);

        const now = new Date();
        setDoneBatches(prevDoneBatches => [
            ...prevDoneBatches,
            ...batches
                .filter(batch => selectedBatches.includes(batch.id))
                .map(batch => ({
                    ...batch,
                    returnedAt: now,
                })),
        ]);
    }

    return (
        <div className="sessionlist">
            <Header/>
            <Box sx={{ padding: "20px" }}>
                <div className="table2">
                    <h2>Session list</h2>
                    <TableContainer
                        component={Paper}
                        sx={{
                        backgroundColor: '#efebe9',
                        color: 'white',
                        margin: '24px',
                        padding: '16px',
                        borderRadius: '8px',
                            width: '80%',
                    }}>
                        <Table aria-label="session table" >
                            <TableHead>
                                <TableRow>
                                    {/*{userRole !== "readOnly" && (*/}
                                    <TableCell>SELECT</TableCell>
                                    {/*  })} */}
                                    <TableCell>BATCH ID</TableCell>
                                    <TableCell>MOVIES</TableCell>
                                    <TableCell>TOTAL DURATION</TableCell>
                                    <TableCell>RESPONSIBLE EMPLOYEE</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {batches.map(batch => (
                                    <TableRow key={batch.id}>
                                        <TableCell>
                                            {/*{userRole !== "readOnly" && (*/}
                                                <Checkbox
                                                    //type="checkbox"
                                                    checked={selectedBatches.includes(batch.id)}
                                                    onChange={() => handleSelectBatch(batch.id)}
                                                />
                                            {/*  })} */}
                                        </TableCell>
                                        <TableCell>{batch.id}</TableCell>
                                        <TableCell>
                                            <ul style={{listStyleType: 'none'}}>
                                                {batch.movies.map((movie, index) => (
                                                    <li key={index}>{movie}</li>
                                                ))}
                                            </ul>
                                        </TableCell>
                                        <TableCell>{batch.totalDuration}</TableCell>
                                        <TableCell>{batch.employee}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {selectedBatches.length > 0 && (
                        <Button
                            variant="contained"
                            //color="secondary"
                            onClick={generatePDF}
                            style={{ marginTop: "20px" }}
                            sx={{
                                backgroundColor: "#bcaaa4",
                                color: "#5d4037",
                                '&:hover': {
                                    backgroundColor: "#9e9e9e",
                                },
                                padding:'16px',
                            }}
                        >
                            Confirm
                        </Button>
                    )}
                </div>

                <div className="table2">
                    {doneBatches.length > 0 && /*userRole !== readOnly && */(
                        <>
                            <h2>Returned batches</h2>
                            <TableContainer
                                component={Paper}
                                sx={{
                                    backgroundColor: '#efebe9',
                                    color: 'white',
                                    margin: '24px',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    width: '80%',
                                }}>
                                <Table aria-label="done sessions">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>BATCH ID</TableCell>
                                            <TableCell>MOVIES</TableCell>
                                            <TableCell>TOTAL DURATION</TableCell>
                                            <TableCell>RESPONSIBLE EMPLOYEE</TableCell>
                                            <TableCell>DATE AND TIME</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {doneBatches.map(batch => (
                                            <TableRow key={batch.id}>
                                                <TableCell>{batch.id}</TableCell>
                                                <TableCell>
                                                    <ul style={{listStyleType: 'none'}}>
                                                        {batch.movies.map((movie, index) => (
                                                            <li key={index}>{movie}</li>
                                                        ))}
                                                    </ul>
                                                </TableCell>
                                                <TableCell>{batch.totalDuration}</TableCell>
                                                <TableCell>{batch.employee}</TableCell>
                                                <TableCell>{batch.returnedAt.toLocaleDateString("de-DE")}, {batch.returnedAt.toLocaleTimeString("de-DE")}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </div>
            </Box>

            <Footer/>
        </div>
    )
}

export default SessionList;