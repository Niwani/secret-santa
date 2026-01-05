import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Gift, Menu } from "lucide-react";
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
            <Link to="/">Gifterly</Link>
          </div>
        </div>
        

        {/* Desktop Links */}
        <div className={classes.linksDesktop}>
          <Link to="/" className={classes.link}>Home</Link>
          <Link to="/pricing" className={classes.link}>Pricing</Link>
          <Link to="/blog" className={classes.link}>Blog</Link>
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
          <Menu size={32} color="#000000" strokeWidth={2.5} />
        </div>
      </nav>

      


      {/* Mobile Menu Overlay */}
      {/* Mobile Menu Overlay */}
      {open && (
        <div className={classes.mobileOverlay} onClick={handleClose}>
          <div
            className={classes.mobileMenu}
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
             {/* Close Button */}
             <button 
                onClick={handleClose}
                style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "none",
                    border: "none",
                    fontSize: "32px",
                    color: "#374151",
                    cursor: "pointer"
                }}
             >
                &times;
             </button>

            <Link to="/" className={classes.mobileLink} onClick={handleClose}>Home</Link>
            <Link to="/pricing" className={classes.mobileLink} onClick={handleClose}>Pricing</Link>
            <Link to="/blog" className={classes.mobileLink} onClick={handleClose}>Blog</Link>
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
