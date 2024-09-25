import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useState, useEffect } from "react";
import DisplayMany from "./DisplayMany";

function AdminDashboard() {
  const { token, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [displayType, setDisplayType] = useState("users"); // default to users
  const [items, setItems] = useState([]); // state to store items or users
  const [showContextMenu, setShowContextMenu] = useState(false); // control context menu visibility
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  }); //control context menu position once clicked
  const [selectedItem, setSelectedItem] = useState(null);

  // redirect to homepage if not an admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const handleDisplayToggle = (type) => {
    setDisplayType(type);
    // Fetch users or items based on the display type
    fetchData(type);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      setItems(data); // Set fetched users to the items state
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchItems = async () => {
    const response = await fetch(`http://localhost:3000/api/item`);
    const data = await response.json();
    setItems(data);
  };

  //   fetches data depending on display type
  const fetchData = (type) => {
    if (type === "users") {
      fetchUsers();
    } else if (type === "products") {
      fetchItems();
    }
  };

  // conext menu appears upon click
  const handleEditClick = (event, item) => {
    event.stopPropagation();
    setSelectedItem(item);
    setContextMenuPosition({ x: event.pageX, y: event.pageY });
    setShowContextMenu(true);
  };

  // closes context menu on click outside menu area
  useEffect(() => {
    const handleClickOutside = () => setShowContextMenu(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleEditMenuAction = async (action, item) => {
    // Handle the action based on the button clicked in the edit menu
    switch (action) {
      case "view":
        navigate(`/products/${selectedItem.id}`); // redirect to the single product page
        break;
      case "delete":
        if (confirm(`Delete ${selectedItem.name}?`)) {
          await deleteItem(selectedItem.id);
        } else {
          alert("Cancelled deleting " + selectedItem.name);
        }
        break;
      case "editName":
        const newName = prompt("Enter new product name:", selectedItem.name);
        await updateItemField("name", newName, selectedItem);
        break;
      case "editPrice":
        const newPrice = prompt("Enter new price:", selectedItem.price);
        if (!isNaN(parseFloat(newPrice)) && parseFloat(newPrice) > 0) {
          await updateItemField("price", parseFloat(newPrice), selectedItem);
        } else {
          alert("Invalid price. Please enter a valid number.");
        }
        break;
      case "changePhoto":
        // add functionality for changing the photo (can be a separate component/modal)
        await updateItemField(
          "default_photo",
          prompt("Enter new photo URL:", selectedItem.default_photo),
          selectedItem
        );
        break;
      case "changeAdditionalPhoto":
        // add functionality for changing the photo (can be a separate component/modal)
        await updateItemField(
          "additional_photos",
          prompt(
            "Enter/Edit new/in photo URL(s) ,(comma separated):",
            selectedItem.additional_photos
          ).split(","),
          selectedItem
        );
        break;
      case "editDescription":
        // add functionality for editing the description
        await updateItemField(
          "description",
          prompt("Enter new description:", selectedItem.description),
          selectedItem
        );
        break;
      case "editTags":
        // add functionality for editing tags
        const parsed = prompt(
          "Edit in new tags (comma separated):",
          selectedItem.tags
        ).split(",");
        await updateItemField("tags", parsed, selectedItem);
        break;
      case "cancel":
        setShowContextMenu(false);
        break;
      default:
        break;
    }
  };

  const deleteItem = async (id) => {
    await fetch(`http://localhost:3000/api/item/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchItems(displayType);
  };

  const updateItemField = async (field, value, obj) => {
    console.log("UPATEING ATEMEP");
    console.log(value);
    if (!value) return; // if no values are provided, exit the menu
    // const updatedData = { [field]: value };
    obj[field] = value;
    const res = await fetch(`http://localhost:3000/api/item/${obj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });
    const json = await res.json();
    console.log(json);
    fetchItems(displayType);
  };

  function generateCard(data) {
    if (displayType === "users") {
      return (
        <div className="item-card">
          <p>{data.name}</p>
          <p>{data.email}</p>
          <p>{data.addresses}</p>
        </div>
      );
    } else {
      return (
        <div className="item-card">
          <div>
            <img
              src={data.default_photo}
              alt="Default Item Card Photo"
              className="square"
            />
            <p>{data.name}</p>
            <p>${data.price}</p>
          </div>

          <div>
            <button
              className="three-d-button"
              onClick={(event) => handleEditClick(event, data)}
            >
              Edit Item
            </button>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <h1>ADMIN DASHBOARD</h1>
      <button className="big-text" onClick={() => handleDisplayToggle("users")}>
        Users
      </button>
      <button
        className="big-text"
        onClick={() => handleDisplayToggle("products")}
      >
        Products
      </button>

      <DisplayMany data={items} factory={generateCard} />

      {showContextMenu && (
        <div className="context-menu">
          <button
            className="big-text"
            onClick={() => handleEditMenuAction("view")}
          >
            View Product
          </button>
          <button
            className="big-text"
            onClick={() => handleEditMenuAction("delete")}
          >
            Delete Listing
          </button>
          <button
            className="big-text"
            onClick={() => handleEditMenuAction("editName")}
          >
            Edit Name
          </button>
          <button
            className="big-text"
            onClick={() => handleEditMenuAction("editPrice")}
          >
            Edit Price
          </button>
          <button
            className="big-text"
            onClick={() => handleEditMenuAction("changePhoto")}
          >
            Change Photo
          </button>
          <button
            className="big-text"
            onClick={() => handleEditMenuAction("changeAdditionalPhoto")}
          >
            Change Additional Photos
          </button>
          <button
            className="big-text"
            onClick={() => handleEditMenuAction("editDescription")}
          >
            Edit Description
          </button>
          <button
            className="big-text"
            onClick={() => handleEditMenuAction("editTags")}
          >
            Edit Tags
          </button>
          <button
            className="big-text"
            onClick={() => handleEditMenuAction("cancel")}
          >
            Cancel Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
