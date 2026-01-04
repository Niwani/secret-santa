import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/homepage/NavBar";
import Footer from "../components/homepage/Footer";
import { ArrowRight } from "lucide-react";
import classes from "./BlogPage.module.css";
import { articles } from "../data/blogData";

export default function BlogPage() {
  return (
    <div>
      <NavBar />
      <div className={classes.pageWrapper}>
        <div className={classes.container}>
            {/* HERO */}
            <div className={classes.hero}>
                <h1 className={classes.heroTitle}>Gifterly Stories</h1>
                <p className={classes.heroSubtitle}>
                    Tips, tricks, and inspiration to help you organize the world's best gift exchanges.
                </p>
            </div>

            {/* GRID */}
            <div className={classes.grid}>
                {articles.map((article) => (
                    <Link to={`/blog/${article.id}`} key={article.id} className={classes.card}>
                        <div className={classes.cardImageWrapper}>
                            <img src={article.image} alt={article.title} className={classes.cardImage} />
                        </div>
                        <div className={classes.cardContent}>
                            <div className={classes.cardDate}>{article.date}</div>
                            <h2 className={classes.cardTitle}>{article.title}</h2>
                            <p className={classes.cardExcerpt}>{article.excerpt}</p>
                            
                            <div className={classes.cardFooter}>
                                <div className={classes.author}>
                                    <div className={classes.authorAvatar}>{article.author[0]}</div>
                                    {article.author}
                                </div>
                                <div className={classes.readMore}>
                                    Read Article <ArrowRight size={16} />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
