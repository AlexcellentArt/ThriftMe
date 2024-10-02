import { useState, useEffect } from "react";
import DisplayMany from "./DisplayMany";
import { ar } from "@faker-js/faker";

function PhotoInput({ takeFiles = true, inputKey = "photos", update }) {
  const [value, setValue] = useState("");

  const [photos, setPhotos] = useState([]);

  function createPhoto(url, i) {
    return (
      <div className="dark-bg icon-file-upload  icon">
        <img className="img" key={i + "_img"} src={url}></img>
      </div>
    );
  }
  function removeSelf(idx) {
    updateData(photos.toSpliced(idx, 1));
  }
  function changeIdx(idx, by = 1) {
    if (photos.length === 1) {
      return;
    }
    if (idx >= 0 && idx < photos.length) {
      const newIdx = idx + by;
      const newPhotos = photos;
      const swapWith = newPhotos[newIdx];
      newPhotos[idx] = swapWith;
      newPhotos[newIdx] = obj;
      updateData(newPhotos);
    }
  }

  // version is important to force a rerender
  const [version, setVersion] = useState(0);
  const [b64, setB64] = useState([]);
  useEffect(() => {
    setVersion(version + 1);
  }, [b64]);
  // takes an array of files from file input, assumes you already extracted them from the input with .target.files
  const uploadImage = async (files) => {
    const arr = [];
    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      const base64 = await convertBase64(element);
      arr.push(base64);
    }
    // arr is now full of b64 strings
    setB64(arr);
    return arr;
  };
  // fill disclosure, from tutorial site, but they are made to be followed so it's good.
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // what reads the data. b64 is the state
  function loadAllData() {
    if (!b64.length) {
      return (
        <p>
          Please add at least one photo. The first added will be your default.
        </p>
      );
    }
    return b64.map((str, i) => {
      const styled = createPhoto(str, i);
      if (styled !== undefined || null) {
        return styled;
      }
      return (
        <img
          className="square quarter-size icon"
          key={i + "_img"}
          src={str}
        ></img>
      );
    });
  }
  // put this uncommented in your react where you want the images to show up to confirm they work

  const updateData = async (obj) => {
    const value = Object.values(obj);
    // revoke current urls
    value.map((obj) => URL.revokeObjectURL(obj));
    // convert to urls
    const converted = value.map((obj) => URL.createObjectURL(obj));
    const b64s = await uploadImage(value);
    setPhotos(b64s);
    update(b64s, inputKey);
  };
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
            updateData([...photos, e.target.value]);
            setValue(e.target.value);
          }}
        ></input>
      )}
      <div className="flex-h wrap">{version && loadAllData()}</div>
    </>
  );
}

export default PhotoInput;
