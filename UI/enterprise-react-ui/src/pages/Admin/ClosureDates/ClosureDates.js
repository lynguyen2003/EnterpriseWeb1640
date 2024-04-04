import './ClosureDates.css';
import React, { useEffect, useState } from "react";
import { setCredentials, selectCurrentToken } from 'src/feature/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Nav from '~/layouts/Nav';

function App() {
    const [AcademicYear, setAcademicYear] = useState("");
    const [ClosureDate, setClosureDate] = useState("");
    const [FinalClosureDate, setFinalClosureDate] = useState("");
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);

    function saveData() {
        let data = { AcademicYear, ClosureDate, FinalClosureDate }
        // console.warn(data);
        fetch("https://localhost:7136/api/ClosureDates", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        }).then((resp) => {
            //console.warn("resp",resp);
            resp.json().then((result) => {
                console.warn("result", result);
            }).catch((error) => {
                console.error("Error:", error);
            });
        })
    }
    return (
        <div>
            <Nav />
            <div className="Create">
                <h1>Add Closure Date</h1>
                <input type="date" name="AcademicYear" value={AcademicYear} onChange={(e) => { setAcademicYear(e.target.value) }} /> <br /> <br />
                <input type="date" name="ClosureDate" value={ClosureDate} onChange={(e) => { setClosureDate(e.target.value) }} /> <br /> <br />
                <input type="date" name="FinalClosureDate" value={FinalClosureDate} onChange={(e) => { setFinalClosureDate(e.target.value) }} /> <br /> <br />
                <button className='btn' type="button" onClick={saveData} >Save</button>
            </div>
        </div>
    );
}

export default App;