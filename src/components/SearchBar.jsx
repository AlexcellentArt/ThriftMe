import { useState, useContext } from "react";
import DisplayMany from "./DisplayMany";
import { useNavigate, createSearchParams } from "react-router-dom";
import { SearchContext } from "./SearchContext";

function SearchBar({ setLocalSearch, forcedParams }) {
  // setLocalSearch is how the bar knows it's local and won't nav to products
  const nav = useNavigate();
  const { setSearchParams } = useContext(SearchContext);
  const [tags, setTags] = useState([]);
  const [addingTag, setAddingTag] = useState(false);
  const [searchText, setSearchText] = useState("");

  async function handleSearch() {
    if (searchText || tags.length) {
      const params = {
        text_search: searchText,
        tags: tags.map((obj) => {
          return obj.text;
        }),
      };
      // check if local
      if (setLocalSearch) {
        // if so, check for forced params and override search with them
        //override local search params with forced ones, usually the user id
        if (forcedParams) {
          Object.keys(forcedParams).forEach(
            (param) => (params[param] = forcedParams[param])
          );
        }
        setLocalSearch(params);
        return;
      }
      setSearchParams(params);
      nav({
        pathname: "/products/",
        search: createSearchParams({
          text_search: searchText,
          tags: tags.map((obj) => {
            return obj.text;
          }),
        }).toString(),
      });
    }
  }
  async function addTag(text) {
    // trims whitespace
    text = text.trim();
    const currentTags = tags;
    // only adds tag if not already present
    if (currentTags.find((obj) => obj.text === text) === undefined) {
      currentTags.push({ text: text });
      setTags(currentTags);
    }
  }
  function handleTagSubmit(value) {
    if (value !== "") {
      addTag(value);
    }
    // sets adding tag state to false
    setAddingTag(false);
  }
  function createTag(obj) {
    // removeSelf gets the index of tags, removes 1 item (the tag) at the index, and setsTags to be the new array it was removed from
    function removeSelf() {
      const idx = tags.findIndex((o) => o.text === obj.text);
      const newTags = tags.toSpliced(idx, 1);
      setTags(newTags);
    }
    return (
      <div className="tag">
        <p>#{obj.text}</p>
        <button
          className="transparent"
          onClick={() => {
            removeSelf();
          }}
        >
          X
        </button>
      </div>
    );
  }
  return (
    <div className="search-bar">
      <input
        className="merriweather-regular"
        type="search"
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
      />
      <DisplayMany data={tags} factory={createTag} additionalClasses={"flex"} />
      {addingTag && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTagSubmit(e.target[0].value);
          }}
        >
          <input type="text"></input>
          <input type="submit"></input>
        </form>
      )}
      <button
        className="search-button"
        type="submit"
        onClick={() => {
          handleSearch();
        }}
      ></button>
      <button
        onClick={() => {
          setAddingTag(!addingTag);
        }}
      >
        #
      </button>
    </div>
  );
}

export default SearchBar;
