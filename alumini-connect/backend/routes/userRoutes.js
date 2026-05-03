const express = require("express");
const { getAlumni, getAlumniById } = require("../controllers/userController");

const router = express.Router();

router.get("/alumni", getAlumni);
router.get("/alumni/:id", getAlumniById);

module.exports = router;
