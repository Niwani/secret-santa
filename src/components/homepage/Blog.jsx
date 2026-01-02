import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Blog.css";

export default function  Blog() {
    const navigate = useNavigate();

    function handleClick() {
        
    }

    return (
        <section className="blogSection">
            <h2 className="blogTitle">🎄 Latest From Our Blog</h2>

            <div className={classes.blogGrid}>
                {/* Blog Post 1 */}
                <div className={classes.blogCard}>
                <img src="/gifting.jpg" alt="Gift ideas" className={classes.blogImg} />
                <div className={classes.blogContent}>
                    <h3>Top 10 Romantic GiftEx Ideas for Valentine's 2026</h3>
                    <p>
                    Make this Valentine's unforgettable with these trending romantic gift exchange ideas...
                    </p>
                    <button onClick={() => navigate('/blog/1')} className={classes.blogButton}>Read More →</button>
                </div>
                </div>

                {/* Blog Post 2 */}
                <div className={classes.blogCard}>
                <img src="/gifts.jpg" alt="Event tips" className={classes.blogImg} />
                <div className={classes.blogContent}>
                    <h3>How to Host a Galentine's Gift Exchange in 2026</h3>
                    <p>
                    Celebrate female friendship with a fun and fabulous Galentine's GiftEx party!
                    </p>
                    <button onClick={() => navigate('/blog/2')} className={classes.blogButton}>Read More →</button>
                </div>
                </div>

                {/* Blog Post 3 */}
                <div className={classes.blogCard}>
                <img src="/boxes.jpg" alt="Christmas fun" className={classes.blogImg} />
                <div className={classes.blogContent}>
                    <h3>Budget-Friendly Valentine's Gifts for Your Office Crush</h3>
                    <p>
                    Cute and affordable gift ideas that say 'I like you' without breaking the bank.
                    </p>
                    <button onClick={() => navigate('/blog/3')} className={classes.blogButton}>Read More →</button>
                </div>
                </div>
            </div>

            <div className="blogFooter">
                <button onClick={() => navigate('/blog')} className="viewAllButton">View All Posts</button>
            </div>
        </section>

    )
}