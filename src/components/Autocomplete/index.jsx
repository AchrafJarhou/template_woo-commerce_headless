import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../slices/filtersSlice";
import {
  fetchProductsThunk,
  fetchSearchSuggestionsThunk,
} from "../../thunkActionsCreator/productsThunks";
import "./index.css";

export default function Autocomplete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useSelector((state) => state.filters.search);
  // const [suggestions, setSuggestions] = useState([]);
  const [focused, setFocused] = useState(false);
  const timeoutRef = useRef(null);
  const filters = useSelector((state) => state.filters);

  // const fetchSuggestions = async (value) => {
  //   try {
  //     const url = `${import.meta.env.VITE_API_URL}/wp-json/wc/store/v1/products?search=${encodeURIComponent(value)}&per_page=5`;
  //     const response = await fetch(url, {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     if (!response.ok)
  //       throw new Error(" il est Impossible de récupérer les suggestions.");
  //     const data = await response.json();
  //     setSuggestions(data);
  //   } catch (error) {
  //     setSuggestions([]);
  //   }
  // };
  const { list, loading, error } = useSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchProductsThunk({ ...filters, page: 1, per_page: 20 }));
  }, [filters, dispatch]);

  // useEffect(() => {
  //   if (!filters.search) {
  //     setSuggestions([]);
  //     return;
  //   }
  //   setSuggestions(list.data);
  //   let active = true;
  //   dispatch(
  //     fetchSearchSuggestionsThunk({ search: filters.search, per_page: 5 }),
  //   )
  //     .unwrap()
  //     .then((data) => {
  //       if (active) setSuggestions(list.data);
  //     })
  //     .catch(() => {
  //       if (active) setSuggestions([]);
  //     });
  //   return () => {
  //     active = false;
  //   };
  // }, [filters.search, dispatch]);

  // useEffect(() => {
  //   setSuggestions(list.data);
  //   clearTimeout(timeoutRef.current);

  //   if (search.trim().length < 1) {
  //     setSuggestions([]);
  //     return;
  //   }

  //   timeoutRef.current = setTimeout(() => {
  //     // fetchSuggestions(search);
  //   }, 350);

  //   return () => clearTimeout(timeoutRef.current);
  // }, [search]);

  const handleChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
  };

  const handleSelect = () => {
    dispatch(setFilters({ search: "" }));
    //setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setFocused(false);
      navigate("/catalogue");
    }
  };

  return (
    <div className="autocomplete">
      <input
        type="search"
        className="autocomplete-input"
        placeholder="Rechercher..."
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Rechercher"
      />

      {focused && list.data.length > 0 && (
        <ul
          className="autocomplete-suggestions"
          onMouseDown={(e) => e.preventDefault()}
        >
          {list.data.map((product) => (
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
