import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import AddItem from "./AddItem";

function UserDashboard() {
  const { getUser, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchItems();
    };
    fetchData();
  }, []);

  const fetchItems = async () => {
    const user = getUser();
    console.log(user.items);
    setItems(user.items);
    return user.items;
  };

  const handleContextMenuAction = async (action) => {
    switch (action) {
      case "view":
        navigate(`/products/${selectedItem.id}`);
        break;
      case "delete":
        if (confirm(`Delete ${selectedItem.name}?`)) {
          await deleteItem(selectedItem.id);
        }
        break;
      case "editName":
        const newName = prompt("Enter new product name:", selectedItem.name);
        if (newName) {
          await updateItemField("name", newName);
        }
        break;
      case "editPrice":
        const newPrice = prompt("Enter new price:", selectedItem.price);
        if (!isNaN(parseFloat(newPrice)) && parseFloat(newPrice) > 0) {
          await updateItemField("price", parseFloat(newPrice));
        } else {
          alert("Invalid price. Please enter a valid number.");
        }
        break;
      case "cancel":
        setShowContextMenu(false);
        break;
      default:
        break;
    }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/item/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchItems(); // Refresh item list
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const updateItemField = async (field, value) => {
    const updatedItem = { ...selectedItem, [field]: value };
    try {
      await fetch(`http://localhost:3000/api/item/${selectedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });
      fetchItems(); // Refresh item list
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();
    setSelectedItem(item);
    setContextMenuPosition({ x: event.pageX, y: event.pageY });
    setShowContextMenu(true);
  };

  const renderItems = () => {
    return (
      <div className="item-list">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="item-card"
              onContextMenu={(event) => handleContextMenu(event, item)} // Open context menu on right-click
            >
              <img
                src={item.default_photo}
                alt="Default Item Card Photo"
                className="square"
              />
              <p>{item.name}</p>
              <p>${item.price}</p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    );
  };

  return (
    <div className="user-dashboard">
      <h1>Your Dashboard</h1>

      {/* My Products Dropdown */}
      <Dropdown label={"My Products"} labelClasses={"merriweather-black"}>
        {renderItems()}
      </Dropdown>

      {/* Add Item Dropdown */}
      <Dropdown label={"Add Item"} labelClasses={"merriweather-black"}>
        <AddItem />
      </Dropdown>

      {/* Context Menu for Editing Items */}
      {showContextMenu && (
        <div
          className="context-menu"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <button onClick={() => handleContextMenuAction("view")}>View</button>
          <button onClick={() => handleContextMenuAction("editName")}>
            Edit Name
          </button>
          <button onClick={() => handleContextMenuAction("editPrice")}>
            Edit Price
          </button>
          <button onClick={() => handleContextMenuAction("delete")}>
            Delete
          </button>
          <button onClick={() => handleContextMenuAction("cancel")}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
