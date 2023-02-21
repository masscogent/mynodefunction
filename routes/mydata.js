var express = require("express");
var router = express.Router();
var { upload } = require("../config/function.js");
const myfn = require("../config/function.js");

////////////// Simple View Page With Form
router.get("/add", function (req, res, next) {
  //res.send('Welcome to Mydata Add Data');
  res.render("adddataview", { title: "Add Data", action: "add" });
});


////////////// View With Get Single Row Data
router.get("/edit_data/:id", function (req, res, next) {
  var id = req.params.id;
  myfn.getSingleD("customers", id, function (err, data) {
    if (err) {
      throw err;
    } else {
      res.render("editdataview", { title: "Edit User Data", user: data });
    }
  });
});


////////////// View With Get Multiple Rows Data
router.get("/", function (req, res, next) {
  var condition = " WHERE image is NOT NULL ORDER BY id DESC";
  myfn.getAllByConditionD("customers", condition, function (err, rows) {
    if (err) {
      console.error(err);
    } else {
      //console.log(rows);
      var alldata = rows;
      res.render("mydataview", {
        title: "Test Nodejs",
        valdata: alldata,
        message: req.flash("success"),
      });
    }
  });
});


////////////// Insert Data with single image upload
router.post("/add_database_data", upload.single("profile_image"), function (req, res, next) {
    var user_name = req.body.name;
    var user_address = req.body.address;
    var user_phone = req.body.phone;
    var data1 = [];
    data1["name"] = user_name;
    data1["address"] = user_address;
    data1["phone"] = user_phone;

    if (!req.file) {
      file_name = "";
    } else {
      file_name = req.file.filename;
      data1["image"] = file_name;

      console.log("Upload finished");
    }
    myfn.insertD("customers", data1, function (err, data) {
      if (err) {
        console.log("Error inserting");
      } else {
        req.flash("success", "Data inserted successfully, id: " + data);
        res.redirect("/mydata");
      }
    });
  }
);


////////////// Update Data with single image upload
router.post(
  "/edit_database_data",
  upload.single("profile_image"),
  function (req, res, next) {
    var userid = req.body.userid;
    var user_name = req.body.name;
    var user_address = req.body.address;
    var user_phone = req.body.phone;
    var file_name = "";

    var data1 = [];
    data1["name"] = user_name;
    data1["address"] = user_address;
    data1["phone"] = user_phone;

    if (!req.file) {
      file_name = "";
    } else {
      file_name = req.file.filename;
      data1["image"] = file_name;

      console.log("Upload finished");
    }

    myfn.updateD("customers", data1, userid, function (err, data) {
      if (err) {
        console.log("Error update");
      } else {
        console.log(data);
        req.flash("success", "Data edit successfully, id :" + data);
        res.redirect("/mydata");
      }
    });
  }
);


////////////// Delete Data
router.get("/delete_data/:id", function (req, res, next) {
  var userid = req.params.id;
  myfn.deleteD("customers", userid, function (err, data) {
    if (err) {
      console.log("Error delete");
    } else {
      req.flash("success", "Data Deleted Successfully, total :" + data);
      res.redirect("/mydata");
    }
  });
});

module.exports = router;
