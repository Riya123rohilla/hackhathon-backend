const Course = require("../models/Course");



// CREATE COURSE
exports.createCourse = async (req, res) => {

    try {

        const { title, description, price } = req.body;
        const course = await Course.create({
            title,
            description,
            price,
            instructor: req.user.id
        });

        res.status(201).json({
            message: "Course created",
            course
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// GET ALL COURSES
exports.getCourses = async (req, res) => {

    try {

        // SEARCH
        const keyword = req.query.keyword
            ? {
                title: {
                    $regex: req.query.keyword,
                    $options: "i"
                }
            }: {};



        // FILTER
        const priceFilter = req.query.price
            ? {
                price: {
                    $lte: Number(req.query.price)
                }
            }: {};



        // PAGINATION
        const page = Number(req.query.page) || 1;

        const limit = Number(req.query.limit) || 5;

        const skip = (page - 1) * limit;



        // SORTING
        const sortBy = req.query.sort || "createdAt";

        const sortOrder = req.query.order === "asc" ? 1 : -1;

        const sortObject = {[sortBy]: sortOrder};



        // FETCH COURSES
        const courses = await Course.find({

            ...keyword,

            ...priceFilter

        })

            .sort(sortObject)

            .skip(skip)

            .limit(limit)

            .populate(
                "instructor",
                "name email"
            );



        res.status(200).json(courses);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// GET SINGLE COURSE
exports.getSingleCourse = async (req, res) => {

    try {

        const course = await Course.findById(
            req.params.id
        )

            .populate(
                "instructor",
                "name email"
            );



        if (!course) {

            return res.status(404).json({
                message: "Course not found"
            });

        }



        res.status(200).json(course);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// UPDATE COURSE
exports.updateCourse = async (req, res) => {

    try {

        const updatedCourse =
            await Course.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true
                }

            );



        if (!updatedCourse) {

            return res.status(404).json({
                message: "Course not found"
            });

        }



        res.status(200).json({

            message: "Course updated",

            updatedCourse

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// DELETE COURSE
exports.deleteCourse = async (req, res) => {

    try {

        const deletedCourse =
            await Course.findByIdAndDelete(
                req.params.id
            );



        if (!deletedCourse) {

            return res.status(404).json({
                message: "Course not found"
            });

        }



        res.status(200).json({
            message: "Course deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};