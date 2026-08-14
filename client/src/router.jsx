import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import Layout from "./layouts/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CaretakerProfile from "./pages/CaretakerProfile.jsx";
import PostAdvertisement from "./pages/PostAdvertisement.jsx";
import EditCaretakerProfile from "./pages/EditCaretakerProfile.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Requests from "./pages/Requests.jsx";
import Account from "./pages/Account.jsx";
import NotFound from "./pages/NotFound.jsx";
import NonCaretakerRoute from "./components/NonCareTakerRoute.jsx";
import LogOutOnlyRoute from "./components/LogOutOnlyRoute.jsx";
import PostReview from "./components/PostReview.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
  <Route path="/" element={<Layout />}>

      {/* Public routes */}
      <Route index element={<Home />} />
      <Route path="caretaker/:id" element={<CaretakerProfile />} />
        
        {/* only logut user */}
      <Route element={<LogOutOnlyRoute />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
     </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        
          <Route path="my-bookings" element={ <MyBookings /> } />
          <Route path="requests"    element={ <Requests /> } /> 
          <Route path="post-review/:bookingId"  element={ <PostReview/> } /> 
           
          <Route path="account"     element={ <Account />} />

          <Route path="edit-profile" element={ <EditCaretakerProfile /> } />

      </Route>
       
       {/* only Non caretaker route */}
       <Route element={<NonCaretakerRoute />}>
           <Route path="advertise" element={<PostAdvertisement />} />
       </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Route>
  )
);

export default router;