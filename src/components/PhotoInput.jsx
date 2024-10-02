import { useState } from "react";
import DisplayMany from "./DisplayMany";
function PhotoInput(
  takeFiles = true,
  inputKey = "photos",
  onChange = (o) => {
    console.log(o);
  }
) {
  const [value, setValue] = useState("");
  const [photos, setPhotos] = useState([]);
  function createPhoto(url) {
    console.log(url);
    return (
      <div className="dark-bg rounded-corners">
        {/* <button
          onClick={async () => {
            const newCart = await removeFromCart(url.id);
            processCartUpdate(newCart);
          }}
        >
          -
        </button> */}
        <img
            className="square fit-to-parent rounded-corners "
            src={url}
            alt={url}
          />
          <button>removeSelf</button>
        {/* <button
          onClick={async () => {
            const newCart = await addToCart(url.id);
            processCartUpdate(newCart);
          }}
        >
          +
        </button> */}
      </div>
    );
  }
  const removeSelf = (obj) => {updateData(photos.toSpliced(photos.findIndex(obj),1))};
  const changeIdx = (obj,by=1) => {
    if (photos.length === 1){return}
    const idx = photos.findIndex(obj)
    if (idx >= 0 && idx < photos.length)
    {
        const newIdx = idx + by
        const newPhotos = photos
        const swapWith = newPhotos[newIdx]
        newPhotos[idx] = swapWith
        newPhotos[newIdx] = obj
        updateData(newPhotos)
    }
  };

  const updateData = (obj) => {
    console.log(obj)
    const value = Object.values(obj)
    // revoke current urls
    value.map((obj) => URL.revokeObjectURL(obj));
    // convert to urls
    const converted = value.map((obj) => URL.createObjectURL(obj));
    setPhotos(converted)
    onChange(converted);
    // const idx = photos.indexOf(value);
    // const newPhotos = [...photos]
    // if(idx === -1){
    //     newPhotos.push(value)
    // }
    // else{
    //     newPhotos.splice(idx)
    // }
    // console.log(newPhotos)
    // setPhotos(newPhotos)
    // onChange(newPhotos)
  };
  //   function removeSelf(idx)
  return (
    <div className="fit-to-parent">
      {takeFiles ? (
        <input
          className="merriweather-regular"
          type="file"
          name={inputKey}
          id={inputKey}
          htmlFor={inputKey}
          onChange={(e) => {
            console.log(e.target.value);
            updateData(e.target.files);
            setValue(e.target.value);
          }}
          //   accept={"images/*"}
          multiple
        ></input>
      ) : (
        <input
          className="merriweather-regular"
          type="url"
          name={inputKey}
          id={inputKey}
          htmlFor={inputKey}
          onChange={(e) => {
            updateData([...photos,e.target.value]);
            setValue(e.target.value);
          }}
        ></input>
      )}
      <DisplayMany data={photos} factory={createPhoto}  additionalClasses={" icon"}/>
    </div>
  );
}

export default PhotoInput;
