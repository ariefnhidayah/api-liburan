const router = require('express').Router()
const ApiController = require('../controllers/ApiController')
const { upload } = require('../middlewares/multer')

router.get('/landing-page', ApiController.landing_page)
router.get('/detail/:id', ApiController.detail_page)
router.post('/booking', upload, ApiController.booking_page)

module.exports = router