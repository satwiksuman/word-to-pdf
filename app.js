const express = require("express");
const multer = require("multer");
const docxtopdf = require("docx-pdf");
//const upload = multer({ dest: "uploads/" });
//const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.static("public"));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //callback mtlb cb function me 2 parameter hota hai pehla error dusra uska path
    //error me hm yha null dal dete hai
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    //yha filename ko directly bhi bhej skte the lekin tb problem ho jata jb do user ka same filename
    //ho to hmne us file name ke sath abhi ka time append kr dia taki distinguish krne me aasani ho
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", upload.single("pdf-file"), function (req, res) {
  // req.file is the `pdf` file
  console.log(req.body);
  console.log(req.file);
  //res.redirect("/");

  docxtopdf(req.file.path, `${req.file.filename}-output.pdf`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log("result" + result);
  });

  //console.log(`${req.file.filename}-output.pdf`);
  const val = `${req.file.filename}-output.pdf`;
  res.download(val, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("Error Occured");
    console.log(err);
  } else {
    console.log("server is working fine");
  }
});
