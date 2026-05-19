const validateAssignment = (req, res, next) => {
  const { title, description, uploadedBy } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!description || description.trim() === "") {
    return res.status(400).json({ message: "Description is required" });
  }

  if (!uploadedBy || uploadedBy.trim() === "") {
    return res.status(400).json({ message: "UploadedBy is required" });
  }

  next(); // pass control
};

module.exports = {
  validateAssignment
};