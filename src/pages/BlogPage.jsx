import React from "react";
import { Link } from "react-router-dom";
import "./BlogPage.css";
import NavBar from "../components/homepage/NavBar";
import Footer from "../components/homepage/Footer";

export default function BlogPage() {
  // Demo articles data
  const articles = [
    {
      id: 1,
      title: "Top 10 Romantic GiftEx Ideas for Valentine's 2026",
      excerpt: "Make this Valentine's unforgettable with these trending romantic gift exchange ideas...",
      date: "Feb 1, 2026",
      author: "Jane Doe"
    },
    {
      id: 2,
      title: "How to Host a Galentine's Gift Exchange in 2026",
      excerpt: "Celebrate female friendship with a fun and fabulous Galentine's GiftEx party!",
      date: "Jan 28, 2026",
      author: "Emily Brown"
    },
    {
      id: 3,
      title: "Budget-Friendly Valentine's Gifts for Your Office Crush",
      excerpt: "Cute and affordable gift ideas that say 'I like you' without breaking the bank.",
      date: "Jan 25, 2026",
      author: "John Smith"
    },
    {
        id: 4,
        title: "5 Unique Valentine's Themes for Couples",
        excerpt: "Spice up your relationship with these creative gift exchange themes for couples.",
        date: "Jan 20, 2026",
        author: "Emily Brown"
      },
      {
        id: 5,
        title: "The Ultimate Guide to Valentine's GiftEx 2026",
        excerpt: "Everything you need to know to organize the perfect Valentine's gift exchange event.",
        date: "Jan 15, 2026",
        author: "Jane Doe"
      },
      {
        id: 6,
        title: "DIY Valentine's Gifts That Look Expensive",
        excerpt: "Handmade gifts that show you care. Perfect for a thoughtful GiftEx exchange.",
        date: "Jan 10, 2026",
        author: "Emily Brown"
      },

  ];

  return (
    <div>
         <NavBar />
        <div className="blog-page">
            {/* HERO SECTION */}
            <section className="blog-hero">
                <h1>Our Blog</h1>
                <p>Insights, tips, and ideas to make your Secret Santa experience unforgettable!</p>
            </section>

            {/* ARTICLES GRID */}
            <section className="blog-articles">
                {articles.map((article) => (
                <div key={article.id} className="blog-card">
                    <h2>{article.title}</h2>
                    <p className="blog-excerpt">{article.excerpt}</p>
                    <div className="blog-meta">
                    <span>{article.author}</span> | <span>{article.date}</span>
                    </div>
                    <Link className="read-more-btn" to={`/blog/${article.id}`}>Read More</Link>
                </div>
                ))}
            </section>
        </div>
       <div className="foots">
        <Footer />
       </div>
      
    </div>
  );
}
