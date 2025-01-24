import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginpage/LoginPage.jsx";
import HomePage from "./pages/homepage/HomePage.jsx";
import EditData from "./pages/editdatapage/EditData.jsx";
import ScanBarcode from "./pages/scanpage/ScanBarcode.jsx";
import FilmList from "./pages/filmlistpage/FilmList.jsx";
import SessionList from "./pages/sessionlistpage/SessionList.jsx";
import AddEmployee from "./pages/addemployeepage/AddEmployee.jsx";
import EmployeeBatchList from "./pages/employeebatchlist/EmployeeBatchList.jsx";
import ProtectedRoute from "./pages/protectedroute/ProtectedRoute.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={<ProtectedRoute element={HomePage} />} />
                <Route path="/editData" element={<ProtectedRoute element={EditData} />} />
                <Route path="/scanBarcode" element={<ProtectedRoute element={ScanBarcode} />} />
                <Route path="/filmList" element={<ProtectedRoute element={FilmList} />} />
                <Route path="/sessionList" element={<ProtectedRoute element={SessionList} />} />
                <Route path="/addEmployee" element={<ProtectedRoute element={AddEmployee} />} />
                <Route path="/employeeBatchData" element={<ProtectedRoute element={EmployeeBatchList} />} />
            </Routes>
        </Router>
    );
};

export default App;
