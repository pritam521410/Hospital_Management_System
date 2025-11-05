// Root Page - Listings pe redirect karna
module.exports.home = (req, res) => {
  res.redirect("/listings");
};

// About Page dikhana
module.exports.about = (req, res) => {
  res.render("about");
};

// Contact Page dikhana
module.exports.contact = (req, res) => {
  res.render("contact");
};

