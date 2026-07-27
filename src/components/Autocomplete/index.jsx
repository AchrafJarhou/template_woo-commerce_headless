import {useState , useRef, useEffect} from "react";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {setFilters} from "../../slices/filtersSlice";
import "./index.css";

export default function Autocomplete({ onKeyDown }){
    const dispatch = useDispatch();
    const search = useSelector((state) => state.filters.search);
    const [suggestions, setSuggestions] = useState([]);
    const timeoutRef = useRef(null);

    const fetchSuggestions = async (value) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/products?search=${encodeURIComponent(value)}&per_page=5`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(" il est Impossible de récupérer les suggestions.");
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    clearTimeout(timeoutRef.current);

    if (search.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(search);
    }, 350);

    return () => clearTimeout(timeoutRef.current);
  }, [search]);

  const handleChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleSelect = () => {
    dispatch(setFilters({ search: "" }));
    setSuggestions([]);
  };

  return (
    <div className="autocomplete">
      <input
        type="search"
        className="autocomplete-input"
        placeholder="Rechercher..."
        value={search}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        aria-label="Rechercher"
      />

      {suggestions.length > 0 && (
        <ul className="autocomplete-suggestions">
          {suggestions.map((product) => (
            <li key={product.id}>
              <Link to={`/product/${product.id}`} onClick={handleSelect}>
                <img
                  src={
                    product.images[0]?.src ||
                    "https://placeholder.pics/svg/300/DEDEDE/555555/Placeholder"
                  }
                  alt={product.name || "la photo du produit"}
                />
                <span>{product.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  
}