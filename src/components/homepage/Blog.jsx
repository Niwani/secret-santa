import React from "react";
import "./Blog.css";

export default function  Blog() {
    return (
        <section className="blogSection">
            <h2 className="blogTitle">🎄 Latest From Our Blog</h2>

            <div className="blogGrid">
                {/* Blog Post 1 */}
                <div className="blogCard">
                <img src="/blog1.jpg" alt="Gift ideas" className="blogImg" />
                <div className="blogContent">
                    <h3>10 Unique Secret Santa Gift Ideas</h3>
                    <p>
                    Discover fun, affordable, and creative gifts that everyone will love during your Secret Santa exchange.
                    </p>
                    <button className="blogButton">Read More →</button>
                </div>
                </div>

                {/* Blog Post 2 */}
                <div className="blogCard">
                <img src="/blog2.jpg" alt="Event tips" className="blogImg" />
                <div className="blogContent">
                    <h3>How to Host the Perfect Secret Santa Event</h3>
                    <p>
                    Learn how to organise a stress-free and exciting gift exchange for family, friends, or coworkers.
                    </p>
                    <button className="blogButton">Read More →</button>
                </div>
                </div>

                {/* Blog Post 3 */}
                <div className="blogCard">
                <img src="/blog3.jpg" alt="Christmas fun" className="blogImg" />
                <div className="blogContent">
                    <h3>Fun Themes for Christmas Gift Exchanges</h3>
                    <p>
                    Make your event more exciting with creative themes such as “funny gifts”, “DIY only”, or “₦3000 max.”
                    </p>
                    <button className="blogButton">Read More →</button>
                </div>
                </div>
            </div>

            <div className="blogFooter">
                <button className="viewAllButton">View All Posts</button>
            </div>
        </section>

    )
}