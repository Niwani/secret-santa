import React from "react";
import ReactMarkdown from 'react-markdown';
import { useParams, Link } from "react-router-dom";
import NavBar from "../components/homepage/NavBar";
import Footer from "../components/homepage/Footer";
import { ArrowLeft } from "lucide-react";
import { articles } from "../data/blogData";
import classes from "./BlogPostPage.module.css";

export default function BlogPostPage() {
    const { id } = useParams();
    const article = articles.find(a => a.id === parseInt(id));
  
    if (!article) {
      return (
        <div style={{ textAlign: "center", padding: "100px", fontFamily: "sans-serif" }}>
          <h1>Article not found</h1>
          <Link to="/blog" style={{ color: "#db2777" }}>Go back to Blog</Link>
        </div>
      );
    }
  
    return (
        <div className={classes.pageWrapper}>
            <NavBar />
            
            <article className={classes.articleContainer}>
                {/* Back Link */}
                <Link to="/blog" className={classes.backLink}>
                    <ArrowLeft size={20} /> Back to Stories
                </Link>

                {/* Header Section */}
                <header className={classes.header}>
                    <h1 className={classes.title}>{article.title}</h1>
                    
                    <div className={classes.meta}>
                        <div className={classes.author}>
                            <div className={classes.avatar}>{article.author[0]}</div>
                            {article.author}
                        </div>
                        <span>•</span>
                        <time>{article.date}</time>
                    </div>

                    <img 
                        src={article.image}
                        alt={article.title}
                        className={classes.heroImage}
                    />
                </header>

                {/* Markdown Content Section */}
                <div className={classes.content}>
                  <ReactMarkdown>{article.content}</ReactMarkdown>
                </div>

                {/* Footer Link */}
                <div style={{ marginTop: "60px", borderTop: "1px solid #f3f4f6", paddingTop: "40px" }}>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "20px" }}>Enjoyed this read?</h3>
                    <p style={{ color: "#6b7280", marginBottom: "20px" }}>Check out more tips and stories on our main blog page.</p>
                     <Link to="/blog" className={classes.backLink}>
                        <ArrowLeft size={20} /> Read More Articles
                    </Link>
                </div>
            </article>

            <Footer /> 
      </div>
    );
}