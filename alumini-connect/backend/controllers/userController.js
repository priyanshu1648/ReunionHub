const User = require("../models/User");

const buildAlumniSignature = (profile) =>
  [
    profile.name,
    profile.institution,
    profile.course,
    profile.company,
    profile.location,
    profile.graduationYear,
    profile.bio,
  ]
    .map((value) => String(value || "").trim().toLowerCase())
    .join("|");

const getAlumni = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : "";
    const institution = req.query.institution ? req.query.institution.trim() : "";

    const filter = {
      role: "alumni",
      ...(institution
        ? {
            institution: { $regex: `^${institution.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
          }
        : {}),
      ...(search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { company: { $regex: search, $options: "i" } },
              { location: { $regex: search, $options: "i" } },
              { course: { $regex: search, $options: "i" } },
              { institution: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
    };

    const alumni = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    const uniqueAlumni = alumni.filter((profile, index, list) => {
      const uniqueKey = profile.email || buildAlumniSignature(profile);

      return (
        index ===
        list.findIndex((item) => {
          const itemKey = item.email || buildAlumniSignature(item);

          return itemKey === uniqueKey;
        })
      );
    });

    res.status(200).json(uniqueAlumni);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alumni profiles." });
  }
};

const getAlumniById = async (req, res) => {
  try {
    const alumni = await User.findOne({
      _id: req.params.id,
      role: "alumni",
    }).select("-password");

    if (!alumni) {
      return res.status(404).json({ message: "Alumni profile not found." });
    }

    res.status(200).json(alumni);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch alumni profile." });
  }
};

module.exports = {
  getAlumni,
  getAlumniById,
};
