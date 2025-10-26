import InputWithLabel from "./InputWithLabel.tsx"; 
import styles from '../styles/SearchForm.module.css'

interface SearchFormProps {
  searchTerm: string;
  onSearchInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: () => void;
  onClearSearch: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
  onClearSearch,
}) => (
  <form onSubmit={onSearchSubmit} className="search-form">
    <InputWithLabel
      id="search"
      type="text"
      value={searchTerm}
      isFocused
      placeholder={"search stories..."}
      onInputChange={onSearchInput}
    >
      Search
    </InputWithLabel>
    <div className={styles.buttons}>
    <button className={styles.searchButton} type="submit" disabled={!searchTerm}>
      Search
    </button>

    <button className={styles.clrSearch} type="button" disabled={!!searchTerm} onClick={onClearSearch}>
      Clear Search
    </button>
    </div>
  </form>
);
export default SearchForm;
