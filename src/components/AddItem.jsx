import { AuthContext } from "./AuthContext";
import { useContext, useEffect } from "react";
import FormGenerator from "./FormGenerator";
import PhotoInput from "./PhotoInput";
import { fa } from "@faker-js/faker";
function AddItem({id = undefined,adminMode=false,notifyReload=undefined}) {
  // Add Item form as seen on page 3 of our mockflow
  // get values from form, then send in post fetch to items. If no error is received back, then return to previous page.
  // const { token } = useContext(AuthContext);
  function processData(obj) {
    obj.tags = obj.tags.split(",");
    if(id !== undefined){
      obj.seller_id = id
    }
    // l is 12
    console.log(obj);
    obj.default_photo = obj.photos.shift()
    obj.additional_photos = obj.photos
    delete obj.photos
    // then make a fetch post to items
    // postItem(obj)
    obj.price = Number(obj.price)
    obj.seller_id = Number(obj.seller_id)
    return obj
  }
  // async function postItem(obj) {
  //   const response = await fetch("http://localhost:3000/api/item/", {
  //     method: "POST",
  //     body: obj,
  //   });
  //   if (!response.ok){}
  //   }
    // const fields = [
    //   { key: "name", type: "text" },
    //   { key: "price", type: "number" },
    //   { key: "tags", type: "text" },
    //   {
    //     key: "description",
    //     type: "textarea",
    //     rows: 20,
    //     cols: 60,
    //     classes: "light-bg",
    //   },
    //   { key: "photos", type: "multiple files", accept: ".jpg, .jpeg, .png" },
    // ];
    // if (id === undefined) {
    //   fields.push({ key: "user_id", type: "number" });
    // }
    function makeFields(){
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
      }
      else{
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
      <div className="dark-bg rounded-corners">
        Add Item{" "}
        <FormGenerator
          fields={makeFields()}
          postSuccessFunction={(obj) => {
            if(notifyReload !== undefined){notifyReload();}
          }}
          preprocessPost={processData}
          apiPath={"item"}
        />
      </div>
    );
  }

export default AddItem;
