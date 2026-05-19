const mongoose = require("mongoose");

const assignmentSchema =
new mongoose.Schema({

    student: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    course: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    fileUrl: {
        type: String,
        required: true
    },

    publicId: {
        type: String
    }

},
{
    timestamps: true
});



module.exports = mongoose.model(
    "Assignment",
    assignmentSchema
);