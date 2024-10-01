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
  //   function updatePhotoBar() {
  //     return photos.map((link) => {return (<div><img src={link} alt="added image"></img> <button onClick={updateData(link)}></button></div>)})
  //   }
  function createPhoto(obj) {
    console.log(obj);
    return (
      <div className="dark-bg rounded-corners">
        <button
          onClick={async () => {
            const newCart = await removeFromCart(obj.id);
            processCartUpdate(newCart);
          }}
        >
          -
        </button>
        <img
            className="square fit-to-parent rounded-corners"
            src={obj.photo}
            alt={obj.photo}
          />
          <button>removeSelf</button>
        <button
          onClick={async () => {
            const newCart = await addToCart(obj.id);
            processCartUpdate(newCart);
          }}
        >
          +
        </button>
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

  const updateData = (value) => {
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
    <>
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
            updateData(e.target.value);
            setValue(e.target.value);
          }}
        ></input>
      )}
      <DisplayMany data={photos} factory={createPhoto} />
    </>
  );
}

export default PhotoInput;
