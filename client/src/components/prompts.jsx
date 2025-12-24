
// Prompts.jsx
import React from 'react';
import './promptCards.css';

export default function PromptCards({ prompts = [], onSelect }) {
  return (
    <section className="services-section">
      <div className="cards-grid">

        {prompts.map((p) => (

          <button
            key={p.id}
            className="card clickable-card"
            onClick={() => onSelect(p)}
            aria-label={`Use prompt: ${p.title}`}
          > <div className="card-container">
            <div className="card-icon">{p.imageSrc}</div>
            <div className="card-title"><h4>{p.title}</h4></div>
            {/* <div className="prompt-desc">{p.description}</div> */}
          </div>
        </button>
      ))}
    </div>
    </section >
  );
}
