const multer = require("multer");

const {
    CloudinaryStorage
} = require(
    "multer-storage-cloudinary"
);

const cloudinary = require(
    "../config/cloudinary"
);



// CLOUDINARY STORAGE
const storage =
    new CloudinaryStorage({

        cloudinary,

        params: {

            folder: "assignments",

            resource_type: "auto"

        }

    });



// FILE VALIDATION
const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [

        "application/pdf",

        "image/png",

        "image/jpeg",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    ];



    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        cb(null, true);

    } else {

        cb(

            new Error(
                "Invalid file type"
            ),

            false

        );

    }

};



// FILE SIZE LIMIT
const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize:
            5 * 1024 * 1024
    }

});



module.exports = upload;