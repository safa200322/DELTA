import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { DataProvider } from "./pages/DataContext";
import Header from "./components/Header/Header";
import AdminPanel from "./pages/AdminPanel";
import ApplyChauffeur from "./pages/ApplyChauffeur";
import ChauffeurAdmin from "./pages/ChauffeurAdmin";
import Home from "./pages/Home";
import About from "./pages/About";
import CarListing from "./pages/CarListing";
import CarDetails from "./pages/CarDetails";
import BoatDetails from "./pages/BoatDetails";
import BoatListing from "./pages/BoatListing";
import MotorDetails from "./pages/MotorDetails";
import ScooterListing from "./pages/ScooterListing";
import MotorListing from "./pages/MotorListing";
import ScooterDetails from "./pages/ScooterDetails";
import Contact from "./pages/Contact";
import Signup from "./pages/signup";
import Login from "./pages/login";
import PaymentPage from "./pages/PaymentScreen";
import NotFound from "./pages/NotFound";
import TimelineCard from "./pages/TimeLineCard";
import Notifications from "./pages/Notifications";
import ReviewList from "./pages/Reviews";
import PersonalInfo from "./pages/ChauffeurProfilePage";
import ChaffeurVehicleManagement from "./pages/ChauffeurWorkAvailability";
import BookingHistory from "./pages/ChauffeurBookingHistory";
import DocumentsVerification from "./pages/ChauffeurDocumentsVerification";
import Settings from "./pages/ChauffeurSettings";
import PaymentInfo from "./pages/ChauffeurPaymentInfo";
import UserProfile from "./pages/Rentee/RenteeProfile";
import RenteeRentalReservations from "./pages/Rentee/RenteeRentalReservations";
import RenteeEarningsandPayment from "./pages/Rentee/RenteeEarningsandPayments";
import RenteeMaintaninceandDocuments from "./pages/Rentee/RenteeMaintenanceandDocuments";
import RenteeNotifications from "./pages/Rentee/RenteeNotifications";
import RenteeReviews from "./pages/Rentee/RenteeReviews";
import RenteeSecurity from "./pages/Rentee/RenteeSecurity";
import RenteeVehicleManagement from "./pages/Rentee/RenteeVehicleManagement";
import ChauffeurManagement from "./pages/ChauffeurManagement";
import WorkAvailability from "./pages/ChauffeurWorkAvailability";
import ProfileOverview from "./pages/Profile/Userprofile";
import MyRentals from "./pages/Profile/MyRentals";
import MyReviews from "./pages/Profile/MyReviews";
import PaymentsWallet from "./pages/Profile/PaymentsandWallet";
import NotificationsProfile from "./pages/Profile/Notifications";
import AccountSettings from "./pages/Profile/AccountSettings";
import VehicleManagement from "./pages/VehicleManagement";

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
          <Route path="/cars/:slug" element={<CarDetails />} />
          <Route path="/motors" element={<MotorListing />} />
          <Route path="/motors/:slug" element={<MotorDetails />} />
          <Route path="/bicycle" element={<ScooterListing />} />
          <Route path="/bicycle/:slug" element={<ScooterDetails />} />
          <Route path="/boats" element={<BoatListing />} />
          <Route path="/boats/:slug" element={<BoatDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin/chauffeurs" element={<ChauffeurAdmin />} />
          <Route path="/apply-chauffeur" element={<ApplyChauffeur />} />
          <Route
            path="/chaffeur-vehicle-management"
            element={<ChaffeurVehicleManagement />}
          />
          <Route
            path="/chauffeur-management"
            element={<ChauffeurManagement />}
          />
          <Route path="/timeline" element={<TimelineCard />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/reviews" element={<ReviewList />} />
          <Route path="/profile/rentee-profile" element={<UserProfile />} />
          <Route
            path="/profile/rentee-vehicle-management"
            element={<RenteeVehicleManagement />}
          />
          <Route
            path="/profile/rentee-rental-reservations"
            element={<RenteeRentalReservations />}
          />
          <Route
            path="/profile/rentee-earnings-and-payments"
            element={<RenteeEarningsandPayment />}
          />
          <Route
            path="/profile/rentee-maintenance-and-documents"
            element={<RenteeMaintaninceandDocuments />}
          />
          <Route
            path="/profile/rentee-notifications"
            element={<RenteeNotifications />}
          />
          <Route path="/profile/rentee-reviews" element={<RenteeReviews />} />
          <Route path="/profile/rentee-security" element={<RenteeSecurity />} />
          <Route path="/profile/personal-info" element={<PersonalInfo />} />
          <Route
            path="/profile/work-availability"
            element={<WorkAvailability />}
          />
          <Route path="/profile/booking-history" element={<BookingHistory />} />
          <Route
            path="/profile/documents-verification"
            element={<DocumentsVerification />}
          />
          <Route path="/profile/settings" element={<Settings />} />
          <Route path="/profile/payment-info" element={<PaymentInfo />} />
          <Route
            path="/profile"
            element={<Navigate to="./pages/Rentee/RenteeProfile" />}
          />
          <Route
            path="/profile/ProfileOverview"
            element={<ProfileOverview />}
          />
          <Route path="/profile/MyRentals" element={<MyRentals />} />
          <Route path="/profile/MyReviews" element={<MyReviews />} />
          <Route path="/profile/MyPayments" element={<PaymentsWallet />} />
          <Route
            path="/profile/NotificationsProfile"
            element={<NotificationsProfile />}
          />
          <Route
            path="/profile/AccountSettings"
            element={<AccountSettings />}
          />
          <Route path="/vehicle-management" element={<VehicleManagement />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </DataProvider>
  );
}

export default App;
