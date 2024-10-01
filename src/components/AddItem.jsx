import { AuthContext } from "./AuthContext";
import { useContext, useEffect } from "react";
import FormGenerator from "./FormGenerator";
import PhotoInput from "./PhotoInput";

function AddItem(id) {
  const { token } = useContext(AuthContext);
  function processData(obj) {
    obj.tags = obj.tags.split(",");
    console.log(obj);
    return obj;
  }
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
    <div>
      Add Item{" "}
      <FormGenerator
        fields={fields}
        preprocessPost={processData}
        apiPath={"item"}
      />
      <PhotoInput inputKey="a" handleUpdateFormData={(e) => console.log(e)} />
    </div>
  );
}

export default AddItem;
