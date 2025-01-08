import React, {useState} from 'react';
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import "./FilmList.css";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import {Button, duration} from "@mui/material";

const FilmList = () => {
    const [movies, setMovies] = useState([
        { id: 1, title: "VATROGASNA VJEŽBA", year: 1999, language: "Engleski", duration: "00:01:19" },
        { id: 2, title: "America's most wanted", year: 2001, language: "Engleski", duration: "00:21:10" },
        { id: 3, title: "33. Dani hrvatskog filma", year: 2014, language: "Hrvatski", duration: "00:02:10" },
        { id: 4, title: "Zbirka Emila Laszowskog", year: 1963, language: "Hrvatski", duration: "00:20:15" },
        { id: 5, title: "Otvorenje hotela Vis", year: 1984, language: "Hrvatski", duration: "00:02:10"}
    ]);
    const [selectedMovies, setSelectMovies] = useState([]);
    const [totalDuration, setTotalDuration] = useState("00:00:00");

    const parseDuration = (duration) => {
        const [hours, minutes, seconds] = duration.split(":").map(Number);
        return hours*3600 + minutes * 60 + seconds; //trajanje ukupno u sekundama
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return [hours, minutes, secs].map(v => String(v).padStart(2, '0')).join(":");
    };

    const handleSelect = (id) =>{
        const movie = movies.find(m => m.id === id);
        const durationInSeconds = parseDuration(movie.duration);

        if(selectedMovies.includes(movie)){
            setSelectMovies(selectedMovies.filter(m => m.id !== id));
            setTotalDuration(formatDuration(parseDuration(totalDuration) - durationInSeconds));
        } else{
            setSelectMovies([...selectedMovies, movie]);
            setTotalDuration(formatDuration(parseDuration(totalDuration) + durationInSeconds));
        }
    };

    const handleOptimize = () => {
        if(selectedMovies.length === 0){
            setTotalDuration("00:00:00");
            return;
        }
        const sortedMovies = selectedMovies.map(movie => ({
            ...movie,
            durationInSeconds: parseDuration(movie.duration),
        })).sort((a, b) => a.durationInSeconds - b.durationInSeconds);

        let optimizedSelection = [];
        let remainingTime = 45 * 60;

        for(const movie of sortedMovies){
            if(movie.durationInSeconds <= remainingTime){
                optimizedSelection.push(movie);
                remainingTime -= movie.durationInSeconds;
            }
        }

        setSelectMovies(optimizedSelection);
        const totalOptimizedDuration = optimizedSelection.reduce((sum, movie) => sum + movie.durationInSeconds, 0);
        setTotalDuration(formatDuration(totalOptimizedDuration));
    };

    return (
        <div className="filmlist">
            <Header/>
            <div>
                <h2>Film List</h2>
                <p>Total Selected Duration: {totalDuration}</p>
                {parseDuration(totalDuration) > 45 * 60 && (
                    <p style = {{ color : 'red'}}>Warning: Total duration exceeds 45 minutes!</p>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOptimize}
                    style={{marginLeft: '30%'}}
                >
                    Optimize
                </Button>
            </div>

            <Table aria-label="film table">
                <TableHeader>
                    <TableColumn>SELECT</TableColumn>
                    <TableColumn>TITLE</TableColumn>
                    <TableColumn>RELEASE YEAR</TableColumn>
                    <TableColumn>LANGUAGE</TableColumn>
                    <TableColumn>DURATION</TableColumn>
                </TableHeader>
                <TableBody>
                    {movies.map(movie => (
                        <TableRow key={movie.id}>
                            <TableCell>
                                <input
                                    type="checkbox"
                                    checked={selectedMovies.includes(movie)}
                                    onChange={() => handleSelect(movie.id)}
                                />
                            </TableCell>
                            <TableCell>{movie.title}</TableCell>
                            <TableCell>{movie.year}</TableCell>
                            <TableCell>{movie.language}</TableCell>
                            <TableCell>{movie.duration}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
            <Footer />
        </div>
    )
}

export default FilmList;