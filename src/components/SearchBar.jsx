import { AuthContext } from "./AuthContext";
import { useContext, useState } from "react";
import DisplayMany from "./DisplayMany";
import { useNavigate } from "react-router-dom";
function SearchBar() {
  // setState searchTags, should be an array of strings
  const { token } = useContext(AuthContext);
  const [tags, setTags] = useState([{ text: "Test" }, { text: "Test2" }]);
  const [addingTag, setAddingTag] = useState(false);
  // You are gonna want an input type search inside the div. Next to it you are gonna want a button with # inside it.
  // setState stringArray
  // relevant docs: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/search
  async function addTag(text) {
    // trims whitespace
    text = text.trim();
    const currentTags = tags;
    // only adds tag if not already present
    if (currentTags.find((obj) => obj.text === text) === undefined) {
      currentTags.push({ text: text });
      setTags(currentTags);
      console.log("added to tags " + text);
      console.log(tags);
    }
  }
  function handleTagSubmit(value) {
    console.log(value);
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
      console.log(tags[idx]);
      const newTags = tags.toSpliced(idx, 1);
      setTags(newTags);
    }
    return (
      <div className="tag">
        <p>{obj.text}</p>
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
      <input type="search" />
      <DisplayMany data={tags} factory={createTag} />
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
        onClick={() => {
          setAddingTag(true);
        }}
      >
        #
      </button>
      {/* <button></button> */}
    </div>
  );
}

export default SearchBar;
