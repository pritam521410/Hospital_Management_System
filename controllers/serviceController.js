// Emergency Care Page
module.exports.emergency = (req, res) => {
  res.render("services/emergency");
};

// Diagnostics Page
module.exports.diagnostics = (req, res) => {
  res.render("services/diagnostics");
};

// Pharmacy Page
module.exports.pharmacy = (req, res) => {
  res.render("services/pharmacy");
};

// Doctor Consultation Page
module.exports.consultation = (req, res) => {
  res.render("services/consultation");
};

// Lab Tests Page
module.exports.lab = (req, res) => {
  res.render("services/lab");
};

// Surgery Page
module.exports.surgery = (req, res) => {
  res.render("services/surgery");
};
