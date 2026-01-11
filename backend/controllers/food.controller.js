export const getAllFood = (req, res) => {
  db.query("SELECT * FROM food", (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch menu." });
    res.json(results);
  });
};
