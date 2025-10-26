import React from "react";
import axios from "axios";
import styles from "./styles/App.module.css";
import List from "./components/List.tsx"; // Add .tsx
import SearchForm from "./components/SearchForm.tsx"; // Add .tsx
import type { Story } from "./types/Story.ts"; // Add .ts

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

interface StoriesState {
  data: Story[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}
type StoriesAction =
  | { type: "STORIES_FETCH_INIT" }
  | { type: "STORIES_FETCH_SUCCESS"; payload: Story[] }
  | { type: "STORIES_FETCH_FAILURE" }
  | { type: "REMOVE_STORY"; payload: { objectID: string } };

const storiesReducer = (
  state: StoriesState,
  action: StoriesAction
): StoriesState => {
  switch (action.type) {
    case "STORIES_FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "STORIES_FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "STORIES_FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter(
          (story) => story.objectID !== action.payload.objectID
        ),
      };
    default:
      throw new Error();
  }
};

const useSemiPersistentState = (
  key: string,
  initialState: string
): [string, React.Dispatch<React.SetStateAction<string>>] => {
  const isMounted = React.useRef(false);
  const [value, setValue] = React.useState<string>(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => 
    {if (!isMounted.current) {
      isMounted.current = true;
    } else {
     localStorage.setItem(key, value);
    }
  }, [value, key]);
  return [value, setValue];
};

const getSumComments = (stories: StoriesState): number => {
  return stories.data.reduce((result, value) => {
    const comments = Number(value.num_comments);
    return result + (isNaN(comments) ? 0 : comments);
  }, 0);
};

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState("search", "");
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });
  const [url, setUrl] = React.useState(`${API_ENDPOINT}${searchTerm}`);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);
  const handleSearchSubmit = () => setUrl(`${API_ENDPOINT}${searchTerm}`);
  const handleClearSearch = () => setUrl(`${API_ENDPOINT}`);

  const sumComments = React.useMemo(() => getSumComments(stories), [stories]);

  const handleFetchStories = React.useCallback(async () => {
    dispatchStories({ type: "STORIES_FETCH_INIT" });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: "STORIES_FETCH_SUCCESS",
        payload: result.data.hits as Story[],
      });
    } catch {
      dispatchStories({ type: "STORIES_FETCH_FAILURE" });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const removeStories = React.useCallback((objectID: string) => {
    dispatchStories({
      type: "REMOVE_STORY",
      payload: { objectID },
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1>MY HACKER STORIES</h1><h2> WITH {sumComments} COMMENTS</h2>
      <SearchForm
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
      />
      {searchTerm && (
        <p>
          Searching for <strong>{searchTerm}</strong>...
        </p>
      )}
      <hr/>
      {stories.isError && <p>Something went wrong.</p>}
      {stories.isLoading ? (
        <p>Data is loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={removeStories} />
      )}
    </div>
  );
}

export default App;
