const express = require('express')
const app = express();
const multer  = require('multer');
const docxConverter = require('docx-pdf');
const path = require("path")
const port = 3000
const cors = require("cors");

app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Uploads')
    },
    filename: function (req, file, cb) {
          cb(null, file.originalname);
    }
  })
  
  const upload = multer({ storage: storage });
  app.post('/convertfile', upload.single('file'),  (req, res, next)=> {
    try{
        if(!req.file){
            return res.status(400).json({
                message:"No file was uploaded."
            })
        }
        //define the path
        let outputpath = path.join(__dirname,"files",`${req.file.originalname}.pdf`);// __dirname returns the directory name of the current module file.
        docxConverter('./Uploads/Hello.docx',outputpath,(err,result)=>{
            if(err){
              console.log(err);
              return res.status(400).json({
                message:"Error occured while converting docx to pdf"
              });
            }
            res.download(outputpath,()=>{
                console.log("File downnloaded successfully!!")
                
            })

          });

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        })
        
    }
 
  })

app.listen(port, () => {
  console.log(`Srever listening on port ${port}`)
})