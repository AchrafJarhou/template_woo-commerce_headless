import { useState } from "react";
import styles from "./FilterBar.module.scss";

export default function FilterBar({ onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState("tous");

  const filters = [
    { id: "tous", label: "TOUT" },
    { id: "hommes", label: "HOMMES" },
    { id: "femmes", label: "FEMMES" },
  ];

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    onFilterChange(filterId);
  };

  return (
    <div className={styles.container}>
      {/* Icône Loupe */}
      <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>

      {/* Filtres */}
      <nav className={styles.filters}>
        {filters.map((filter) => (
          <a
            key={filter.id}
            href="#"
            className={`${styles.filterLink} ${activeFilter === filter.id ? styles.active : ""}`}
            onClick={(e) => {
              e.preventDefault();
              handleFilterClick(filter.id);
            }}
          >
            {filter.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
