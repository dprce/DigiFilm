import React from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./SessionList.css";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

const SessionList = () => {
    return (
        <div className="sessionlist">
            <Header/>
            <Table aria-label="session table">
                <TableHeader>
                    <TableColumn>TITLE</TableColumn>
                    <TableColumn>RELEASE YEAR</TableColumn>
                    <TableColumn>LANGUAGE</TableColumn>
                    <TableColumn>DURATION</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow key="1">
                        <TableCell>VATROGASNA VJEŽBA</TableCell>
                        <TableCell>1999</TableCell>
                        <TableCell>Engleski</TableCell>
                        <TableCell>00:01:19</TableCell>
                    </TableRow>
                    <TableRow key="2">
                        <TableCell>America's most wanted</TableCell>
                        <TableCell>2001</TableCell>
                        <TableCell>Engleski</TableCell>
                        <TableCell>00:21:10</TableCell>
                    </TableRow>
                    <TableRow key="3">
                        <TableCell>33. Dani hrvatskog filma</TableCell>
                        <TableCell>2014</TableCell>
                        <TableCell>Hrvatski</TableCell>
                        <TableCell>00:02:10</TableCell>
                    </TableRow>
                    <TableRow key="4">
                        <TableCell>Zbirka Emila Laszowskog</TableCell>
                        <TableCell>1963</TableCell>
                        <TableCell>Hrvatski</TableCell>
                        <TableCell>00:20:15</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <Footer />
        </div>
    )
}

export default SessionList;