import React from "react";
import "./About.css";

export default function About() {
    return (
        <section className="aboutSection">
            {/* <div className="aboutOverlay">
                <img src="/present.jpg" />
                <img src="/gifts.jpg" />
            </div> */}

            <div className="aboutContent">
                <h2 className="aboutTitle">About This Platform</h2>
                <p className="aboutText">
                This Secret Santa platform is designed to make gift exchange events easy,
                fun, and stress-free. Whether you're hosting for your family, friends,
                workplace, or school, our tool randomly assigns gift partners, manages
                participants, and gives you a shareable event link — all in seconds.
                <br /><br />
                It works not just for Christmas, but also Valentine's exchange, birthdays,
                team-building events, and any celebration where gifts are involved.
                </p>

                <button className="aboutButton" onClick={() => navigate("/admin/create-event")}>
                Start an Event →
                </button>
            </div>
        </section>

    )
}