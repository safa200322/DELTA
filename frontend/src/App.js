import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./pages/DataContext";
import Header from "./components/Header/Header";
import AdminPanel from "./pages/AdminPanel";
import ApplyChauffeur from "./pages/ApplyChauffeur";
import ChauffeurAdmin from "./pages/ChauffeurAdmin";
import Home from "./pages/Home";
import About from "./pages/About";
import CarListing from "./pages/CarListing";
import CarListing2 from "./pages/CarListing2";
import CarDetails from "./pages/CarDetails";
import MotorListing2 from "./pages/MotorListing2";
import BoatDetails from "./pages/BoatDetails";
import BoatListing from "./pages/BoatListing";
import MotorDetails from "./pages/MotorDetails";
import ScooterListing from "./pages/ScooterListing";
import MotorListing from "./pages/MotorListing";
import ScooterDetails from "./pages/ScooterDetails";
import Contact from "./pages/Contact";
import Signup from "./pages/SignUpPage";
import Login from "./pages/Login";
import VehicleManagement from "./pages/VehicleManagement";
import ChauffeurManagement from "./pages/ChauffeurManagement";
import PaymentPage from "./pages/PaymentScreen";
import NotFound from "./pages/NotFound";
import TimelineCard from "./pages/TimeLineCard";
import Notifications from "./pages/Notifications";
import ReviewList from "./pages/Reviews";
import PersonalInfo from "./pages/ChauffeurProfilePage";
import WorkAvailability from "./pages/ChauffeurWorkAvailability";
import BookingHistory from "./pages/ChauffeurBookingHistory";
import DocumentsVerification from "./pages/ChauffeurDocumentsVerification";
import Settings from "./pages/ChauffeurSettings";
import PaymentInfo from "./pages/ChauffeurPaymentInfo";
import UserProfile from "./pages/RenteeProfile";
import ExtraServices from "./pages/ExtraServices";
import Confirmation from "./pages/Confirmation";
import VehicleOwner from "./pages/VehicleOwner";
import AddVehicleForm from "./pages/AddVehicleForm";
import Renteeprofileowner from "./pages/RenteeProfileowner";
import ChauffeurLogin from "./pages/ChauffeurLogin";

import Bicycles from "./pages/BicycleForm"
import Carform from "./pages/Carform";
import BoatForm from "./pages/BoatForm";
import BicycleForm from "./pages/BicycleForm";
import MotorcycleForm from "./pages/Motorcycleform";
import Vowner from "./pages/VehicleownerLogin"
import ReservationForm from "./pages/ReservationForm";




function App() {
  return (
    <DataProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/cars" element={<CarListing />} />
          <Route path="/cars2" element={<CarListing2 />} />
          <Route path="/motors2" element={<MotorListing2 />}/>
          <Route path="/extra" element={<ExtraServices/>}/>
          <Route path="/confirmation" element={<Confirmation/>}/>
          <Route path="/owner" element={<VehicleOwner/>}/>
          <Route path="/addvehicle" element={<AddVehicleForm/>}/>
          <Route path="/carform" element={<Carform/>}/>
          <Route path="/boatform" element={<BoatForm/>}/>
          <Route path="/bicycleform" element={<BicycleForm/>}/>
          <Route path="/MotorcycleForm" element={<MotorcycleForm/>}/>
          <Route path="/vehicleowner" element={<UserProfile/>}/>
          <Route path="/vehicleownnerlogin" element={<Vowner/>}/>
          <Route path="/userprofileowner" element={<Renteeprofileowner/>}/>
          <Route path="/reservationget" element={<ReservationForm/>}/>
          <Route path="/chauffeurLogin" element={<ChauffeurLogin/>}/>
    
          
          <Route path="/cars/:slug" element={<CarDetails />} />
          <Route path="/motors" element={<MotorListing />} />
          <Route path="/motors/:slug" element={<MotorDetails />} />
          <Route path="/bicycle" element={<ScooterListing />} />
          <Route path="/bicycle/:slug" element={<ScooterDetails />} />
          <Route path="/yachts" element={<BoatListing />} />
          <Route path="/yachts/:slug" element={<BoatDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/chauffeurs" element={<ChauffeurAdmin />} />
          <Route path="/apply-chauffeur" element={<ApplyChauffeur />} />
          <Route path="/vehicle-management" element={<VehicleManagement />} />
          <Route path="/chauffeur-management" element={<ChauffeurManagement />} />
          <Route path="/timeline" element={<TimelineCard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/profile/rentee-profile" element={<UserProfile />} />
          <Route path="/profile/personal-info" element={<PersonalInfo />} />
          <Route path="/profile/work-availability" element={<WorkAvailability />} />
          <Route path="/profile/booking-history" element={<BookingHistory />} />
          <Route path="/profile/documents-verification" element={<DocumentsVerification />} />
          <Route path="/profile/settings" element={<Settings />} />
          <Route path="/profile/payment-info" element={<PaymentInfo />} />
          <Route path="/profile" element={<Navigate to="/profile/personal-info" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
