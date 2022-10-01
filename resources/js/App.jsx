import React from 'react';
import ReactDOM from 'react-dom';
import '../scss/app.scss';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SecondPage from "./pages/SecondPage";

function Main() {
    return (
        <Router>
            <Routes>
                <Route exact path="/"  element={<HomePage/>} />
                <Route path="/second"  element={<SecondPage/>} />
            </Routes>
        </Router>
    );
}

export default Main;

if (document.getElementById('app')) {
    ReactDOM.render(<Main />, document.getElementById('app'));
}
