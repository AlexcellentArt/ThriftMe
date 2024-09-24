import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useState, useEffect } from "react";
import DisplayMany from "./DisplayMany";

function AdminDashboard() {
  const { token, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [displayType, setDisplayType] = useState("users"); // default to users
  const [selectedItem, setSelectedItem] = useState(null); // select item to be edited
  const [showContextMenu, setShowContextMenu] = useState(false); // control context menu visibility
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  }); //control context meny position once clicked
  const [items, setItems] = useState([]); // state to store products or users

  // redirect to homepage if not an admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
  }, [isAdmin, navigate]);

  const handleDisplayToggle = (type) => {
    setDisplayType(type);
    // Fetch users or items based on the display type
    fetchItemsOrUsers(type);
  };

  const fetchItemsOrUsers = async (type) => {
    const response = await fetch(`http://localhost:3000/api/item`);
    const data = await response.json();
    setItems(data);
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

  const handleEditMenuAction = async (action) => {
    // Handle the action based on the button clicked in the edit menu
    switch (action) {
      case "view":
        navigate(`/item/${selectedItem.id}`); // redirect to the single product page
        break;
      case "delete":
        await deleteItem(selectedItem.id);
        break;
      case "changePhoto":
        // add functionality for changing the photo (can be a separate component/modal)
        await updateItemField("photo", prompt("Enter new photo URL:"));
        break;
      case "editDescription":
        // add functionality for editing the description
        await updateItemField("description", prompt("Enter new description:"));
        break;
      case "editTags":
        // add functionality for editing tags
        await updateItemField(
          "tags",
          prompt("Enter new tags (comma separated):")
        );
        break;
      case "cancel":
        setShowEditMenu(false);
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
    fetchItemsOrUsers(displayType);
  };

  const updateItemField = async (field, value) => {
    if (!value) return; // if no values are provided, exit the menu

    const updatedData = { [field]: value };
    await fetch(`http://localhost:3000/api/item/${selectedItem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
    fetchItemsOrUsers(displayType);
  };

  function generateCard(item) {
    return (
      <div className="item-card">
        <div>
          <img
            src={item.default_photo}
            alt="Default Item Card Photo"
            className="square"
          />
          <p>{item.name}</p>
          <p>${item.price}</p>
        </div>

        <div>
          <button
            className="three-d-button"
            onClick={(e) => handleEditClick(e, item)}
          >
            Edit Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>ADMIN DASHBOARD</h1>
      <button onClick={() => handleDisplayToggle("users")}>Users</button>
      <button onClick={() => handleDisplayToggle("products")}>Products</button>

      <DisplayMany data={items} factory={generateCard} />

      {showContextMenu && (
        <div className="context-menu">
          <button onClick={() => handleEditMenuAction("view")}>
            View Product
          </button>
          <button onClick={() => handleEditMenuAction("delete")}>
            Delete Listing
          </button>
          <button onClick={() => handleEditMenuAction("changePhoto")}>
            Change Photo
          </button>
          <button onClick={() => handleEditMenuAction("editDescription")}>
            Edit Description
          </button>
          <button onClick={() => handleEditMenuAction("editTags")}>
            Edit Tags
          </button>
          <button onClick={() => handleEditMenuAction("cancel")}>
            Cancel Edit
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
