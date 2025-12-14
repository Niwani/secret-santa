import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminCreateEvent from "./pages/AdminCreateEvent";
import EventPage from "./pages/EventPage";
import SecretSantaApp from "./pages/SecretSantaApp";
import LoginPage from "./pages/Loginpage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<HomePage />} />

        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/create-event" element={<AdminCreateEvent />} />

        <Route path="/event/:eventId" element={<EventPage />} />


        <Route path="/event/:eventId/draw" element={<SecretSantaApp />} />
        
      </Routes>
    </BrowserRouter>
  );
}