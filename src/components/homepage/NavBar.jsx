import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Gift } from "lucide-react";
import classes from "./NavBar.module.css";

export default function NavBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <>
      <nav className={classes.navbar}>
        <div className={classes.logoGroup}>
          <Gift size={30} color="#e91e63" strokeWidth={2.5} style={{ marginTop: 2, display: "block" }} />
          <div className={classes.logo}>
            <Link to="/">GiftEx</Link>
          </div>
        </div>
        

        {/* Desktop Links */}
        <div className={classes.linksDesktop}>
          <Link to="/" className={classes.link}>Home</Link>
          <Link to="/pricing" className={classes.link}>Pricing</Link>
          <Link to="/blog" className={classes.link}>blog</Link>
          <Link to="/login" className={classes.link}>Create Event</Link>
          <button
            className={classes.ctaButton}
            onClick={() => navigate("/demo")}
          >
            Try Demo
          </button>
        </div>

        {/* Hamburger Icon */}
        <div className={classes.hamburger} onClick={() => setOpen(!open)}>
          <div className={classes.bar}></div>
          <div className={classes.bar}></div>
          <div className={classes.bar}></div>
        </div>
      </nav>

      


      {/* Mobile Menu Overlay */}
      {open && (
        <div className={classes.mobileOverlay} onClick={handleClose}>
          <div
            className={classes.mobileMenu}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <Link to="/" className={classes.mobileLink} onClick={handleClose}>Home</Link>
            <Link to="/blog" className={classes.mobileLink} onClick={handleClose}>Blog</Link>
            <Link to="/pricing" className={classes.mobileLink} onClick={handleClose}>Pricing</Link>
            <Link to="/about" className={classes.mobileLink} onClick={handleClose}>About</Link>
            <Link to="/login" className={classes.mobileLink} onClick={handleClose}>Log in</Link>
            <button
              className={`${classes.ctaButton} ${classes.mobileCta}`}
              onClick={() => {
                handleClose();
                navigate("/admin/create-event");
              }}
            >
              Create Event
            </button>
          </div>
        </div>
      )}
    </>
  );
}
