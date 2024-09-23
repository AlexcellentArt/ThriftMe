import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useState, useEffect } from "react";
import DisplayMany from "./DisplayMany";

function AdminDashboard() {
  const { token, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [displayType, setDisplayType] = useState("users"); // default to users
  const [selectedItem, setSelectedItem] = useState(null); // select item to be edited
  const [contextMenuVisible, setContextMenuVisible] = useState(false); // control context menu visibility
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
    const response = await fetch(`http://localhost:3000/api/items`); // is this the right api? double check later when you can pull it up on browser
    const data = await response.json();
    setItems(data);
  };

  // conext menu appears upon click
  const handleEditClick = (e, item) => {
    setSelectedItem(item);
    setContextMenuPosition({ x: e.pageX, y: e.pageY });
    setContextMenuVisible(true);
  };

  // closes context menu on click outside menu area
  useEffect(() => {
    const handleClickOutside = () => setContextMenuVisible(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleEditMenuAction = (action) => {
    // Handle the action based on the button clicked in the edit menu
    switch (action) {
      case "view":
        navigate(`/items/${selectedItem.id}`); // redirect to the single product page
        break;
      case "delete":
        deleteItem(selectedItem.id);
        break;
      case "changePhoto":
        // add functionality for changing the photo (can be a separate component/modal)
        break;
      case "editDescription":
        // add functionality for editing the description
        break;
      case "editTags":
        // add functionality for editing tags
        break;
      case "cancel":
        setShowEditMenu(false);
        break;
      default:
        break;
    }
  };

  const deleteItem = async (id) => {
    await fetch(`http://localhost:3000/api/items/${id}`, { method: "DELETE" });
    fetchItemsOrUsers(displayType);
  };

  return (
    <div>
      <h1>ADMIN DASHBOARD</h1>
      <button onClick={() => handleDisplayToggle("users")}>Users</button>
      <button onClick={() => handleDisplayToggle("products")}>Products</button>
      <DisplayMany
        data={items}
        factory={(item) => (
          <div
            onMouseEnter={() => setSelectedItem(item)}
            onMouseLeave={() => setSelectedItem(null)}
          >
            <div>
              <p>{item.name}</p>
              {selectedItem && selectedItem.id === item.id && (
                <button onClick={() => handleEditClick(item)}>Edit</button>
              )}
            </div>
            {showEditMenu && (
              <div className="edit-menu">
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
        )}
      />
    </div>
  );
}

export default AdminDashboard;
