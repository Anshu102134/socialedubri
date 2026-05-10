import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setQuery(""); // Clear after search
    };

    return (
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <input
                type="text"
                style={{ 
                    padding: '8px 15px 8px 35px', 
                    fontSize: '13px', 
                    width: '180px', 
                    background: 'rgba(255,255,255,0.1)', 
                    color: 'white', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                }}
                className="navbar-search-input"
                placeholder="Find buds..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <span style={{ position: 'absolute', left: '12px', fontSize: '14px', opacity: 0.6 }}>🔍</span>
            <button type="submit" style={{ display: 'none' }}>Search</button>
        </form>
    );
};

export default Search;