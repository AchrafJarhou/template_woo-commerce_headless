import { useState } from "react";
import styles from "./FilterBar.module.scss";
import searchBarIcon from "../../../assets/icons/search-bar.png";

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
      <img src={searchBarIcon} alt="Recherche" className={styles.searchIcon} />

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
