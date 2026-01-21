import multer from 'multer';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const MAX_FILES = 50;

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null , './public/temp');
    },
    filename: function(req, file, cb){
        const uniqueName = file.fieldname + '-' + Date.now();
        cb(null , uniqueName);
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: MAX_FILES
    }
})

export default upload;