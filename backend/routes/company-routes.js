const express = require('express');
const isAuthenticated = require("../middlewares/isAuthenticated");
const {getCompany, getCompanyById, registerCompany, updateCompany} = require("../controllers/company.controller");

const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.get('/register', (req, res) => {
      res.render('registerCompany', {
          message: req.flash('message')[0]  // This will pass the entire message (either success or error)
      });
  });
router.route("/get").get(isAuthenticated,getCompany);

router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/get/:id",(req,res)=>{
    res.render("companyPage");
})
router.route("/update/:id").put(isAuthenticated,updateCompany);

module.exports = router;