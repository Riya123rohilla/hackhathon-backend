const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// ENROLL IN COURSE
exports.enrollCourse = async (req,res) => {

    try {

        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }

        const alreadyEnrolled = await Enrollment.findOne({
                student: req.user.id,
                course: courseId
            });

        if (alreadyEnrolled) {

            return res.status(400).json({
                message:
                    "Already enrolled in this course"
            });

        }

        const enrollment = await Enrollment.create({
                student: req.user.id,
                course: courseId
            });

        res.status(201).json({
            message:"Enrollment successful",
            enrollment
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// GET MY ENROLLED COURSES
exports.getMyEnrollments =
    async (req, res) => {

        try {

            const enrollments = await Enrollment.find({
                    student: req.user.id
                })
                .populate({
                    path: "course",
                    populate: {
                        path: "instructor",
                        select: "name email"
                    }
                });

            res.status(200).json(enrollments);

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }

    };



// REMOVE ENROLLMENT
exports.unenrollCourse = async (
    req,
    res
) => {

    try {

        const courseId = req.params.id;



        const enrollment =
            await Enrollment.findOneAndDelete({

                student: req.user.id,

                course: courseId

            });



        if (!enrollment) {

            return res.status(404).json({
                message:
                    "Enrollment not found"
            });

        }



        res.status(200).json({
            message:
                "Unenrolled successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};