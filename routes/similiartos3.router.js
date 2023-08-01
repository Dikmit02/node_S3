const fs = require('fs')
const router = require('express').Router()
const Auth = require('../middleWare/auth.middleware')
const path = require('path')
const { upload } = require('../middleWare/multer.middleware')
const UploadModel = require('../model/uploads.model')
const UserModel = require('../model/user.model')

// Create a Bucket
router.post('/createBucket', Auth.userAuthMiddleware, async (req, res) => {
  const folderName = req.body.folderName
  if (!folderName) {
    return res.json({ status: 400, message: 'Folder Name is Mandatory' })
  }
  const rootFolder = 'rootFolder'
  const folderpath = `${rootFolder}/${folderName}`
  try {
    if (fs.existsSync(rootFolder)) {
      if (!fs.existsSync(folderpath)) {
        fs.mkdirSync(folderpath)
        return res.json({ status: 200, success: 'Bucket created' })
      }
    } else {
      fs.mkdirSync(rootFolder)
      if (!fs.existsSync(folderpath)) {
        fs.mkdirSync(folderpath)
        return res.json({ status: 200, success: 'Bucket created' })
      }
    }
    return res.json({
      status: true,
      success: 'Bucket Already Exist',
    })
  } catch (error) {
    console.log(error)
  }
})

router.get('/getAllBuckets', Auth.userAuthMiddleware, async (req, res) => {
  //joining path of directory
  const rootPath = path.join('rootFolder')

  //passsing rootPath and callback function
  fs.readdir(rootPath, (err, files) => {
    if (err) {
      console.error(err)
      return
    }
    const directories = files.filter((file) => {
      const filePath = path.join(rootPath, file)
      return fs.statSync(filePath).isDirectory()
    })
    if (directories) {
      return res.json({ status: 200, success: directories })
    }
  })
})

router.post(
  '/uploadFile',
  Auth.userAuthMiddleware,
  upload().single('myFile'),
  async (req, res) => {
    if (req.file) {
      const filefullPath = req.file.destination + req.file.filename
      const uploadedData = new UploadModel({
        userId: req.user._id,
        fileName: req.file.filename,
        mimeType: req.file.mimetype,
        path: filefullPath,
      })
      await uploadedData.save()
      res.json({ status: 200, success: 'File Uploaded Successfully' })
    }
  },
)

router.get('/getAllFiles', Auth.userAuthMiddleware, async (req, res) => {
  const bucketName = req.body.bucketName
  if (!bucketName) {
    return res.json({ status: false, message: 'Please provide a bucket name' })
  }
  try {
    const directoryPath = path.join(`rootFolder/${bucketName}`)
    fs.readdir(directoryPath, (err, files) => {
      const allFiles = files.filter((file) => {
        const filePath = path.join(directoryPath, file)
        return fs.statSync(filePath).isFile()
      })
      if (allFiles?.length == 0) {
        return res.json({ status: true, message: 'No files found!!' })
      }
      return res.json({ status: true, allfiles: allFiles })
    })
  } catch (error) {
    console.log(error)
  }
})

router.get(
  '/downloadFile/:folderName/:filename',
  Auth.userAuthMiddleware,
  async (req, res) => {
    const { filename, folderName } = req.params
    const filePath = `rootFolder/${folderName}/${filename}`
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' })
    }
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)
  },
)

router.delete(
  '/deleteFileFromBucket',
  Auth.userAuthMiddleware,
  async (req, res) => {
    const folderName = req.body.folderName
    const fileName = req.body.fileName
    if (!folderName) {
      return res.json({ status: false, message: 'Folder Name is Mandatory' })
    }
    if (!fileName) {
      return res.json({ status: false, message: 'File Name is Mandatory' })
    }
    const rootFolder = 'rootFolder'
    const filePath = `${rootFolder}/${folderName}/${fileName}`
    try {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })

      const user = await UserModel.findOne({ apiKey: req.query.apiKey })
      await UploadModel.deleteOne({
        userId: user?._id,
        path: filePath,
      })
      return res.json({ status: true, success: 'File deleted successfully' })
    } catch (error) {
      return res.json({ status: false, success: error })
    }
  },
)

router.put(
  '/updateFileInBucket/:folderName/:fileName',
  Auth.userAuthMiddleware,
  upload().single('myFile'),
  async (req, res) => {
    const { fileName, folderName } = req.params
    if (!folderName) {
      return res.json({ status: false, message: 'Folder Name is Mandatory' })
    }
    if (!fileName) {
      return res.json({ status: false, message: 'File Name is Mandatory' })
    }
    const rootFolder = 'rootFolder'
    const filePath = `${rootFolder}/${folderName}/${fileName}`
    try {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err)
          return
        }
      })
      const user = await UserModel.findOne({ apiKey: req.query.apiKey })
      const updateFilePath = `${rootFolder}/${folderName}/${req.file.filename}`
      await UploadModel.findOneAndUpdate(
        {
          userId: user?._id,
          path: filePath,
        },
        {
          fileName: req.file.filename,
          mimeType: req.file.mimetype,
          path: updateFilePath,
        },
      )
      return res.json({ status: true, success: 'File updated successfully' })
    } catch {
      return res.json({ status: false, success: error })
    }
  },
)

router.delete('/deleteBucket', Auth.userAuthMiddleware, async (req, res) => {
  const folderName = req.body.folderName
  if (!folderName) {
    return res.json({ status: false, message: 'Folder Name is Mandatory' })
  }
  try {
    const rootFolder = 'rootFolder'
    const folderpath = `${rootFolder}/${folderName}`
    const regexPattern = new RegExp(`^rootFolder/${folderName}`)
    fs.readdirSync(folderpath).forEach((file) => {
      const filePath = path.join(folderpath, file)
      fs.unlinkSync(filePath)
      console.log(`Deleted file: ${filePath}`)
    })
    fs.rmdirSync(folderpath)

    const user = await UserModel.findOne({ apiKey: req.query.apiKey })
    await UploadModel.deleteMany({
      userId: user?._id,
      path: { $regex: regexPattern },
    })
    return res.json({ status: true, success: 'Bucket deleted successfully' })
  } catch (error) {
    return res.json({ status: false, success: error })
  }
})
module.exports = router
