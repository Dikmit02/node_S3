const userModel = require('../model/user.model')
exports.userAuthMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.query.apiKey
    if (!apiKey) {
      return res.json({ status: 400, message: 'apikey is mandatory' })
    }
    const getUser = await userModel.findOne({ apiKey: apiKey })
    if (!getUser) {
      return res.json({ status: 400, message: "apikey don't exist" })
    }
    req.user = getUser
    next()
  } catch (error) {
    console.log(error)
  }
}
