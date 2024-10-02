import { AuthContext } from "./AuthContext";
import { useContext, useEffect } from "react";
import FormGenerator from "./FormGenerator";
import PhotoInput from "./PhotoInput";
function AddItem(id) {
  // Add Item form as seen on page 3 of our mockflow
  // get values from form, then send in post fetch to items. If no error is received back, then return to previous page.
  const { token } = useContext(AuthContext);
  function processData(obj) {
    obj.tags = obj.tags.split(",");
    obj.seller_id = id
    // l is 12
    console.log(obj);
    obj.default_photo = obj.photos.shift()
    obj.additional_photos = obj.photos
    delete obj.photos
    console.
    // then make a fetch post to items
    // postItem(obj)
    obj.price = Number(obj.price)
    return obj
  }
  // async function postItem(obj) {
  //   const response = await fetch("http://localhost:3000/api/item/", {
  //     method: "POST",
  //     body: obj,
  //   });
  //   if (!response.ok){}
  //   }
    const fields = [
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
    if (!id) {
      fields.unshift({ key: "user_id", type: "number" });
    }
    return (
      <div className="dark-bg rounded-corners">
        Add Item{" "}
        <FormGenerator
          fields={fields}
          // postSuccessFunction={(obj) => {
          //   processData(obj);
          // }}
          preprocessPost={processData}
          apiPath={"item"}
        />
      </div>
    );
  }

export default AddItem;
