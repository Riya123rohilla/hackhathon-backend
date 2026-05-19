const Assignment = require("../models/Assignment");

// UPLOAD ASSIGNMENT
exports.uploadAssignment = async (req, res) => {

    try {

        console.log(req.body);
        console.log(req.file);
        console.log(req.user);
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const assignment = await Assignment.create({
            student:req.user.id,
            course:req.body.courseId,
            fileUrl:req.file.path,
            publicId:req.file.filename
        });
            
        res.status(201).json({ message: "Assignment uploaded", assignment });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// GET MY ASSIGNMENTS
exports.getMyAssignments = async (req, res) => {
  try {
    const userId = req.user.id;

    // sorting from query params
    const sortBy = req.query.sortBy || "createdAt"; // default field
    const order = req.query.order === "asc" ? 1 : -1; // asc / desc

    const assignments = await Assignment.find({ userId })
      .sort({ [sortBy]: order });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};