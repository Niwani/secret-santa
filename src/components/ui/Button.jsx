import React from "react";
import PropTypes from "prop-types";
import classes from "./Button.module.css";

export default function Button({ children, onClick, type = "button", variant = "primary", disabled = false }) {
  return (
    <div>
        <button
        type={type}
        className={`${classes.button} ${classes[variant]}`}
        onClick={onClick}
        disabled={disabled}
        >
            {children}
        </button>
    </div>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.oneOf(["primary", "secondary"]),
  disabled: PropTypes.bool,
};
