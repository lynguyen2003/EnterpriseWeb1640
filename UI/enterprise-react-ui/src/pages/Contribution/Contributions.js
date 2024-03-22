import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '~/feature/auth/authSlice';
import './Contributions.css';

const Contribution = () => {
    const token = useSelector(selectCurrentToken);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(
                    'https://localhost:7136/api/Contributions',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );
                setArticles(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        fetchArticles();
    }, [token]); // Add token to dependency array to re-fetch articles when token changes

    return (
        <div className="test">
            <h2>Articles</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {articles.map((article) => (
                        <li key={article.id}>
                            <h3>{article.title}</h3>
                            <p>{article.description}</p>
                            <a
                                href={article.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Dowload File
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Contribution;
