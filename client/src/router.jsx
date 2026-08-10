import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const router = createBrowserRouter (
    createRoutesFromElements(
        <Route path="/" element = { <Layout/>}>
            <Route path = "" element = {<Home/>} />
            <Route path = "login" element = {<Login/>} />
            <Route path = "register" element = {<Register/>} />
        </Route>
    )
)

export default router ;