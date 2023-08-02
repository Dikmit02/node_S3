const router = require('express').Router()
const userModel = require('../model/user.model')
const crypto = require('crypto-js')
const Auth = require('../middleWare/auth.middleware')

//Route to register the user
router.post('/register', async (req, res) => {
  try {
    const { name } = req.body
    var str = name + new Date().getTime()
    const apiKey = crypto.SHA256(str).toString().slice(0, 20)
    const userCreated = new userModel({ name, apiKey })
    await userCreated.save()
    res.json({ status: 200, success: 'user Created' })
  } catch (error) {
    console.log(error)
  }
})

//Route to login the user
router.post('/login', Auth.userAuthMiddleware, async (req, res) => {
  try {
    if (req.user) {
      res.json({ status: 200, success: req.user })
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
