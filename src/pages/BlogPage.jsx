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
      title: "5 Creative Secret Santa Ideas",
      excerpt: "Discover fun ways to make your Secret Santa exchange memorable this year...",
      date: "Dec 1, 2025",
      author: "Jane Doe"
    },
    {
      id: 2,
      title: "Top 10 Gift Exchange Mistakes to Avoid",
      excerpt: "Avoid the common pitfalls when organizing a gift exchange among friends, family, or colleagues...",
      date: "Nov 25, 2025",
      author: "John Smith"
    },
    {
      id: 3,
      title: "How to Make Remote Secret Santa Fun",
      excerpt: "Tips and tools to run a virtual Secret Santa for teams working from home...",
      date: "Nov 20, 2025",
      author: "Emily Brown"
    },
    {
        id: 4,
        title: "10 Unique Secret Santa Gift Ideas",
        excerpt: "Discover fun, affordable, and creative gifts that everyone will love during your Secret Santa exchange.",
        date: "Nov 20, 2025",
        author: "Emily Brown"
      },
      {
        id: 5,
        title: "ow to Host the Perfect Secret Santa Event",
        excerpt: "Learn how to organise a stress-free and exciting gift exchange for family, friends, or coworkers.",
        date: "Nov 20, 2025",
        author: "Emily Brown"
      },
      {
        id: 6,
        title: "Fun Themes for Christmas Gift Exchanges",
        excerpt: "Make your event more exciting with creative themes such as “funny gifts”, “DIY only”, or “₦3000 max.”",
        date: "Nov 20, 2025",
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
