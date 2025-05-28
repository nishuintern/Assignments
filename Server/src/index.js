const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(
  cors({
    origin: "https://assignments-1-rq4l.onrender.com",
  })
);

let cachedUsers = [];

const fetchUsers = async () => {
  if (cachedUsers.length === 0) {
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    cachedUsers = response.data;
  }
  return cachedUsers;
};

app.get("/users", async (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query;
  const allUsers = await fetchUsers();

  // Search filter
  const filtered = allUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + parseInt(limit));

  res.json({
    users: paginated,
    total: filtered.length,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
