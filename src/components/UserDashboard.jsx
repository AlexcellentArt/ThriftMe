import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import AddItem from "./AddItem";
import DisplayMany from "./DisplayMany";

function UserDashboard() {
  const { getUser, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const [items, setItems] = useState([{ id: 1, name: "sss" }]);
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
  }, [version]);

  const fetchItems = async () => {
    const user = await getUser();
    console.log("user items", user.items);
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

  function makeProduct(obj) {
    return (
      <div>
        <p>{obj.name}</p>
        <button
          onClick={() => {
            setSelectedItem(obj.id);
          }}
        >
          Edit
        </button>
      </div>
    );
  }
  const handleEditClick = (event, item) => {
    event.stopPropagation();
    setSelectedItem(item);
    setContextMenuPosition({ x: event.pageX, y: event.pageY });
    setShowContextMenu(true);
  };

  function generateCard(data) {
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

        {/* Edit Item Button */}
        <div className="flex-v">
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

  return (
    <div className="user-dashboard">
      <h1>Your Shop</h1>
      {showContextMenu && (
        <div
          className="context-menu flex-h fit-to-parent"
          style={{ top: contextMenuPosition.y, left: contextMenuPosition.x }}
        >
          <button
            className="big-text merriweather-light "
            onClick={() => handleContextMenuAction("view")}
          >
            View
          </button>
          <button
            className="big-text"
            onClick={() => handleContextMenuAction("editName")}
          >
            Edit Name
          </button>
          <button
            className="big-text"
            onClick={() => handleContextMenuAction("editPrice")}
          >
            Edit Price
          </button>
          <button
            className="big-text"
            onClick={() => handleContextMenuAction("delete")}
          >
            Delete
          </button>
          <button
            className="big-text"
            onClick={() => handleContextMenuAction("cancel")}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Add Item Dropdown */}
      <Dropdown label={"Add Item"} labelClasses={"merriweather-black"}>
        <AddItem notifyReload={fetchItems} />
      </Dropdown>
      <div className="scroll-y fit-to-parent">
        <DisplayMany
          data={items}
          factory={generateCard}
          additionalClasses={"stretch wrap "}
        />
      </div>
    </div>
  );
}

export default UserDashboard;
