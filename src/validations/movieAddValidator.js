const { check } = require("express-validator");

module.exports = [
    check("title").notEmpty().withMessage("Title is required"),
    check("rating").notEmpty().withMessage("Rating is required"),
    check("awards").notEmpty().withMessage("Awards is required"),
    check("release_date").notEmpty().withMessage("Release date is required"),
    check("genre_id").notEmpty().withMessage("Genre date is required"),
];