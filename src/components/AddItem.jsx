import { AuthContext } from "./AuthContext";
import { useContext, useEffect } from "react";
import FormGenerator from "./FormGenerator";
import PhotoInput from "./PhotoInput";
import { fa } from "@faker-js/faker";

function AddItem({
  id = undefined,
  adminMode = false,
  notifyReload = undefined,
}) {
  // Add Item form
  // get values from form, then send in post fetch to items. If no error is received back, then return to previous page.
  function processData(obj) {
    obj.tags = obj.tags.split(",");
    if (id !== undefined) {
      obj.seller_id = id;
    }
    // l is 12
    console.log(obj);
    obj.default_photo = obj.photos.shift();
    obj.additional_photos = obj.photos;
    delete obj.photos;
    // then make a fetch post to items
    obj.price = Number(obj.price);
    obj.seller_id = Number(obj.seller_id);
    return obj;
  }

  function makeFields() {
    if (adminMode === false) {
      return [
        { key: "name", type: "text" },
        { key: "price", type: "number" },
        { key: "tags", type: "text" },
        {
          key: "description",
          type: "textarea",
          rows: 20,
          cols: 60,
          classes: "light-bg",
        },
        { key: "photos", type: "multiple files", accept: ".jpg, .jpeg, .png" },
      ];
    } else {
      return [
        { key: "seller_id", type: "number" },
        { key: "name", type: "text" },
        { key: "price", type: "number" },
        { key: "tags", type: "text" },
        {
          key: "description",
          type: "textarea",
          rows: 20,
          cols: 60,
          classes: "light-bg",
        },
        { key: "photos", type: "multiple files", accept: ".jpg, .jpeg, .png" },
      ];
    }
  }
  return (
    <div className="dark-bg  scroll-y">
      <h1>Add Item</h1>
      <FormGenerator
        fields={makeFields()}
        postSuccessFunction={(obj) => {
          if (notifyReload !== undefined) {
            notifyReload();
          }
        }}
        preprocessPost={processData}
        apiPath={"item"}
      />
    </div>
  );
}

export default AddItem;
