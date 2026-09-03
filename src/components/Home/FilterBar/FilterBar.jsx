import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import styles from "./FilterBar.module.scss";
import searchBarIcon from "../../../assets/icons/search-bar.png";

export default function FilterBar({ onFilterChange }) {
  const [activeFilter, setActiveFilter] = useState("tous");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const products = useSelector((state) => state.products.list.data);

  const filters = useMemo(() => {
    const categories = new Set();
    products?.forEach((product) => {
      product.categories?.forEach((cat) => {
        categories.add(JSON.stringify({ id: cat.slug, label: cat.name }));
      });
    });

    const uniqueFilters = Array.from(categories).map((cat) => JSON.parse(cat));
    return [
      { id: "tous", label: "TOUT" },
      ...uniqueFilters.sort((a, b) => a.label.localeCompare(b.label)),
    ];
  }, [products]);

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    onFilterChange(filterId);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
    }
  };

  return (
    <div className={styles.container}>
      {/* Icône Loupe */}
      <button
        className={styles.searchButton}
        onClick={toggleSearch}
        aria-label="Recherche"
      >
        <img src={searchBarIcon} alt="Recherche" className={styles.searchIcon} />
      </button>

      {/* Input de recherche */}
      {searchOpen && (
        <div className={styles.searchInputWrapper}>
          <img src={searchBarIcon} alt="" className={styles.inputIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Rechercher un article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
      )}

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
