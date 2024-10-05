import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext, useState, useEffect } from "react";
import DisplayMany from "./DisplayMany";
import Dropdown from "./Dropdown";
import AddItem from "./AddItem";
import { HeaderContext } from "./HeaderContext";

function AdminDashboard() {
  const { token, isAdmin } = useContext(AuthContext);
  const { setAdditonalContent } = useContext(HeaderContext);
  const navigate = useNavigate();
  const [displayType, setDisplayType] = useState("users"); // default to users
  const [items, setItems] = useState([{}]); // state to store items or users
  const [users, setUsers] = useState([{}]);
  const [showContextMenu, setShowContextMenu] = useState(false); // control context menu visibility
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  }); //control context menu position once clicked
  const [selectedItem, setSelectedItem] = useState(null);
  // control context menu visibility

  // redirect to homepage if not an admin
  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
    }
    const fetchData = async () => {
      //fetch data once first thing so that the display many below loads something first
      await fetchItems();
      fetchUsers();
    };
    fetchData();
    setAdditonalContent();
  }, [isAdmin, navigate]);

  const makeAdminHeader = () => {
    return (
      <>
        <div>
          <h1 className="merriweather-regular">ADMIN DASHBOARD</h1>
        </div>
        <div className="force-tab-shape button-box dropdown">
          <button
            className="big-text merriweather-black"
            onClick={() => handleDisplayToggle("users")}
          >
            Users
          </button>
          <button
            className="big-text merriweather-black"
            onClick={() => handleDisplayToggle("products")}
          >
            Products
          </button>
          {
            <Dropdown label={"Add Item"} labelClasses={"merriweather-black"}>
              <AddItem adminMode={true} notifyReload={fetchItems} />
            </Dropdown>
          }
        </div>
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
      </>
    );
  };

  const handleDisplayToggle = (type) => {
    setDisplayType(type);
    // Fetch users or items based on the display type
    fetchData(type);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setUsers(data); // Set fetched users to the items state
      // return data
    } catch (error) {}
  };

  const fetchItems = async () => {
    const response = await fetch(`/api/item`);
    const data = await response.json();
    setItems(data);
    return data;
  };

  //   fetches data depending on display type
  const fetchData = (type) => {
    if (type === "users") {
      fetchUsers();
    } else if (type === "products") {
      fetchItems();
    }
  };

  // function to delete a user
  const deleteUser = async (id) => {
    try {
      await fetch(`/api/user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (error) {}
  };

  // function to update a user field
  const updateUserField = async (id, field, value) => {
    // create a new object to update the user
    const userUpdate = {
      [field]: value,
    };

    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userUpdate),
      });

      // check if the response is ok
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error: ${res.status} - ${errorText}`);
      }

      await res.json();
      fetchUsers();
    } catch (error) {}
  };

  // Function to promote a user to admin
  const promoteUser = async (id) => {
    await updateUserField(id, "is_admin", true);
  };

  // Function to demote a user from admin
  const demoteUser = async (id) => {
    await updateUserField(id, "is_admin", false);
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

  // update the header whenever the context menu's state changes
  useEffect(() => {
    console.log("trying to make admin header...");
    const menu = makeAdminHeader();
    console.log("admin header generated: ",menu);
    console.log("admin header created!");
    setAdditonalContent(menu?menu:"Uh oh");
    console.log("additional context should have been set");
  }, [showContextMenu]);
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
    try {
      await fetch(`/api/item/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchItems(displayType);
    } catch (error) {}
  };

  const updateItemField = async (field, value, obj) => {
    if (!value) return; // if no values are provided, exit the menu
    // const updatedData = { [field]: value };
    obj[field] = value;
    const res = await fetch(`/api/item/${obj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(obj),
    });
    const json = await res.json();
    fetchItems(displayType);
  };

  function generateCard(data) {
    if (displayType === "users") {
      return (
        <div className="small-text item-card">
          <p className="merriweather-bold admin-tab">{data.id}</p>
          <Dropdown label={"Info"} startExpanded={true}>
            <div>
              <p className="merriweather-regular">
                <span className="merriweather-bold">User Name:</span>{" "}
                {data.name}
              </p>
              <p className="merriweather-regular">
                <span className="merriweather-bold">Email:</span> {data.email}
              </p>
              <p className="merriweather-regular">
                <span className="merriweather-bold">Is Admin:</span>{" "}
                {data.is_admin ? (
                  <span className="positive">Yes</span>
                ) : (
                  <span className="negative">No</span>
                )}
              </p>
            </div>
          </Dropdown>
          {data.addresses && (
            <Dropdown label={"Addresses"}>
              {data.addresses && data.addresses.length > 0 ? (
                data.addresses.map((address, index) => (
                  <div key={index}>
                    <p className="merriweather-regular">
                      <span className="merriweather-bold">Street:</span>{" "}
                      {address.street}
                    </p>
                    {address.apartment && (
                      <p>
                        <span className="merriweather-bold">Apartment:</span>{" "}
                        {address.apartment}
                      </p>
                    )}
                    <p className="merriweather-regular">
                      <span className="merriweather-bold">City:</span>{" "}
                      {address.city}
                    </p>
                    <p className="merriweather-regular">
                      <span className="merriweather-bold">Zip:</span>{" "}
                      {address.zip}
                    </p>
                  </div>
                ))
              ) : (
                <p>{data.name} has no addresses available</p>
              )}
            </Dropdown>
          )}
          <div>
            {/* Delete User Button */}
            <button
              className="three-d-button"
              onClick={() => {
                if (confirm(`Are you sure you want to delete ${data.name}?`)) {
                  deleteUser(data.id);
                }
              }}
            >
              Delete User
            </button>

            {/* Promote to Admin Button */}
            {!data.is_admin && (
              <button
                className="three-d-button"
                onClick={() => promoteUser(data.id)}
              >
                Promote to Admin
              </button>
            )}

            {/* Demote from Admin Button */}
            {data.is_admin && (
              <button
                className="three-d-button"
                onClick={() => demoteUser(data.id)}
              >
                Demote from Admin
              </button>
            )}
          </div>
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
  }

  return (
    <div className="flex-v scroll-y">
      <DisplayMany
        data={displayType === "users" ? users : items}
        factory={generateCard}
        additionalClasses={"stretch wrap centered "}
      />
    </div>
  );
}

export default AdminDashboard;
