var express = require('express');
var router = express.Router();
var fs = require('fs')
var path = require('path')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/pdf_data', function (req, res, next) {
  fs.readFile(path.join(__dirname, "../public/files/PDF_DICT.json"), "utf-8", function (err, data) {
    if (err) {
      res.send("文件读取失败");
    } else {
      data = JSON.parse(data)
      res.send(data)
    }
  })
});

router.get('/ppf_data', function (req, res, next) {
  fs.readFile(path.join(__dirname, "../public/files/PPF.json"), "utf-8", function (err, data) {
    if (err) {
      res.send("文件读取失败");
    } else {
      data = JSON.parse(data)
      res.send(data)
    }
  })
});

router.get('/pred_station_data', function (req, res, next) {
  fs.readFile(path.join(__dirname, "../public/files/PRED_STATION_ALL.csv"), "utf-8", function (err, data) {
    if (err) {
      res.send("文件读取失败");
    } else {
      res.send(CSV(data))
    }
  })
});

function CSV(csvString) {
  let data = [];
  let relArr = csvString.split("\r\n");// '\r'
  if (relArr.length > 1) {
    let title = relArr[0].split(',');
    let title_arr = title.keys();
    for (let key = 1, len = relArr.length - 1; key < len; key++) {
      let values = relArr[key];
      let objArr = values.split(",");
      let obj = {};
      for (let i = 0; i < title.length; i++) {
        obj[title[title_arr.next().value]] = objArr[i];
      }
      data.push(obj);
      title_arr = title.keys();
    }
  }
  return data;
}


module.exports = router;
