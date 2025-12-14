import React from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/homepage/NavBar";
import Footer from "../components/homepage/Footer";

const articles = [
    {
      id: 1,
      title: "5 Creative Secret Santa Ideas",
      content: "Discover fun ways to make your Secret Santa exchange memorable this year...",
      date: "Dec 1, 2025",
      author: "Jane Doe"
    },
    {
      id: 2,
      title: "Top 10 Gift Exchange Mistakes to Avoid",
      content: "Avoid the common pitfalls when organizing a gift exchange among friends, family, or colleagues...",
      date: "Nov 25, 2025",
      author: "John Smith"
    },
    {
      id: 3,
      title: "How to Make Remote Secret Santa Fun",
      content: "Tips and tools to run a virtual Secret Santa for teams working from home...",
      date: "Nov 20, 2025",
      author: "Emily Brown"
    },
    {
        id: 4,
        title: "10 Unique Secret Santa Gift Ideas",
        content: "Discover fun, affordable, and creative gifts that everyone will love during your Secret Santa exchange.",
        date: "Nov 20, 2025",
        author: "Emily Brown"
      },
      {
        id: 5,
        title: "ow to Host the Perfect Secret Santa Event",
        content: "Learn how to organise a stress-free and exciting gift exchange for family, friends, or coworkers.",
        date: "Nov 20, 2025",
        author: "Emily Brown"
      },
      {
        id: 6,
        title: "Fun Themes for Christmas Gift Exchanges",
        content: "Make your event more exciting with creative themes such as “funny gifts”, “DIY only”, or “₦3000 max.”",
        date: "Nov 20, 2025",
        author: "Emily Brown"
      },

  ];

  export default function BlogPostPage() {
    const { id } = useParams(); // get the :id from the URL
    const article = articles.find(a => a.id === parseInt(id));
  
    if (!article) {
      return (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h1>Article not found</h1>
          <Link to="/blog">Go back to Blog</Link>
        </div>
      );
    }
  
    return (
        <div>
            <NavBar />
            <div style={{ maxWidth: "800px", margin: "50px auto", padding: "0 20px" }}>
                <h1>{article.title}</h1>
                <p style={{ color: "#888", marginBottom: "30px" }}>{article.author} | {article.date}</p>
                <p style={{ lineHeight: "1.8", fontSize: "18px" }}>{article.content}</p>
                <Link to="/blog" style={{ display: "inline-block", marginTop: "30px", color: "#e53935" }}>← Back to Blog</Link>
            </div>
            <Footer /> 
      </div>
    );
  }