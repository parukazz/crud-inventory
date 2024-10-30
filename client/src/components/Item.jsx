import React, { useState, useEffect } from "react";
import axios from "axios";

const Item = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    description: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/items")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/items",
        newItem
      );
      setItems([...items, response.data]);
      setNewItem({ name: "", quantity: 0, description: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const reponse = await axios.put(
        `http://localhost:5000/api/items/${id}`,
        updates
      );
      setItems(items.map((item) => (item._id === id ? reponse.data : item)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Inventory</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={newItem.name}
            onChange={(event) =>
              setNewItem({ ...newItem, name: event.target.value })
            }
          />
        </label>
        <br />
        <label>
          Quantity:
          <input
            type="number"
            value={newItem.quantity}
            onChange={(event) =>
              setNewItem({ ...newItem, quantity: event.target.value })
            }
          />
        </label>
        <br />
        <label>
          Description:
          <input
            type="text"
            value={newItem.description}
            onChange={(event) =>
              setNewItem({ ...newItem, description: event.target.value })
            }
          />
        </label>
        <br />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name} ({item.quantity}) - {item.description}
            <button
              onClick={() =>
                handleUpdate(item._id, { name: "Updated " + item.name })
              }
            >
              Update
            </button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Item;
