const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // dir = '/uploads';
        if(file.mimetype==="image/jpg"||
        file.mimetype==="image/jpeg"||
        file.mimetype==="image/png"){

            cb(null, 'uploads')
          }else{
            cb(new Error("Not Image or change .jpeg"),null);
          }
        
    },
    filename: function (req, file, cb) {
        let filename = file.originalname;
        console.log(filename);
        let arr = filename.split('.');
        let newFileName = arr[0]+'-'+Date.now()+'.'+arr[1];
        cb(null, newFileName);
    }
})




// app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
//     const file = req.file
//     if (!file) {
//         const error = new Error('Please upload a file')
//         error.httpStatusCode = 400
//         return next(error)
//     }
//     res.send(file)
// })
var upload = multer({ storage: storage,limits:{fileSize:1*1024*1024} });
var uploads = upload.single('myFile');
app.post('/uploadfile',function(req,res){
    uploads(req,res,function(err){
        if(err instanceof multer.MulterError){
            return res.send('Kích thước File lớn hơn 1MB')
        }
        else{
            return res.send('Tệp không xác định');
        }
        console.log(req.file);
        res.send('Thành công');
    })
});

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});