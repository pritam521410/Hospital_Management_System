const Medicine = require("../models/medicine");

// Index Route - Sabhi medicines ko fetch karna
module.exports.index = async (req, res) => {
  const allMedicines = await Medicine.find({});
  res.render("medicines/index", { allMedicines });
};

// New Medicine Form dikhana
module.exports.renderNewForm = (req, res) => {
  res.render("medicines/new");
};

// Naya Medicine Create karna
module.exports.createMedicine = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newMedicine = new Medicine(req.body.medicine);
  newMedicine.owner = req.user._id;
  newMedicine.image = { url, filename };
  await newMedicine.save();
  req.flash("success", "Medicine Added Successfully!");
  res.redirect("/medicines");
};

// Show Route - Specific medicine ko dikhana
module.exports.showMedicine = async (req, res) => {
  const medicine = await Medicine.findById(req.params.id).populate("owner");

  if (!medicine) {
    req.flash("error", "Medicine does not exist");
    return res.redirect("/medicines");
  }

  res.render("medicines/show", { medicine });
};

// Edit Form dikhana
module.exports.renderEditForm = async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    req.flash("error", "Medicine not found");
    return res.redirect("/medicines");
  }
  res.render("medicines/edit", { medicine });
};

// Medicine Update karna
module.exports.updateMedicine = async (req, res) => {
  let { id } = req.params;
  let medicine = await Medicine.findByIdAndUpdate(id, { ...req.body.medicine });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    medicine.image = { url, filename };
    await medicine.save();
  }

  req.flash("success", "Medicine Updated!");
  res.redirect(`/medicines/${id}`);
};

// Medicine Delete karna
module.exports.deleteMedicine = async (req, res) => {
  await Medicine.findByIdAndDelete(req.params.id);
  req.flash("success", "Medicine Deleted!");
  res.redirect("/medicines");
};

