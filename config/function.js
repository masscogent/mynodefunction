var multer = require("multer");
var database = require("./database");

var thistime = Date.now();
var randns = Math.floor(Math.random() * 999999);

////// upload file
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./upload");
  },
  filename: function (request, file, callback) {
    var temp_file_arr = file.originalname.split(".");
    var temp_file_name = temp_file_arr[0];
    var temp_file_extension = temp_file_arr[1];
    var thisfile_name = randns + thistime + "." + temp_file_extension;
    file_name = thisfile_name;
    callback(null, thisfile_name);
  },
});
var upload = multer({ storage: storage });

///// insert data into database
function insertD(table, datain, callback) {
  var rescode = 0;
  var keys = Object.keys(datain);
  var fields = [];
  for (var i = 0; i < keys.length; i++) {
    fields.push(keys[i]);
  }
  var values = Object.values(datain);
  var datvalues = [];
  for (var i = 0; i < values.length; i++) {
    datvalues.push('"' + values[i] + '"');
  }
  var sql = `INSERT INTO ${table} (${fields}) VALUES (${datvalues})`;
  console.log(sql);
  rescode = database.query(sql, function (err, data) {
    if (err) {
      callback(err, null);
      throw err;
    } else {
      console.log(data.insertId);
      callback(null, data.insertId);
    }
  });
}

///// update data to database
function updateD(table, datain, id, callback) {
  var rescode = 0;  
  let update_set = Object.keys(datain).map((value) => {
    return ` ${value}  = "${datain[value]}"`;
  });  
  var sql = `UPDATE ${table} SET ${update_set.join(" ,")} WHERE id="${id}"`;  
  console.log(sql);
  rescode = database.query(sql, function (err, data) {
    if (err) {
      callback(err, null);
      throw err;
    } else {
      console.log(data.affectedRows);
      callback(null, id);
    }
  });
}

///// delete data from database
function deleteD(table, id, callback) {
  var sql = `DELETE FROM ${table} WHERE id = ${id}`;
  database.query(sql, function (err, data) {
    if (err) {
      callback(err, null);
      throw err;
    } else {
      console.log("Data Deleted Successfully");
      callback(null, data.affectedRows);
    }
  });
}

///// get data from database
function getAllByConditionD(table,condition, callback) {
  var sql = `SELECT * FROM ${table} ${condition}`;
  database.query(sql, function (err, data) {
    if (err) {
      callback(err, null);
      throw err;
    } else {
      console.log("Fetched data Successfully");
      callback(null, data);
    }
  });
}

///// get single data from database by id
function getSingleD(table, id, callback) {
  var sql = `SELECT * FROM ${table} WHERE id=${id} ORDER BY id DESC LIMIT 0,1`;
  database.query(sql, function (err, data) {
    if (err) {
      callback(err, null);
      throw err;
    } else {
      console.log("Fetched data Successfully");
      callback(null, data[0]);
    }
  });
}

module.exports = { upload: upload, insertD, deleteD, updateD, getAllByConditionD, getSingleD };
