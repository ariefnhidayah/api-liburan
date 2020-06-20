const router = require('express').Router();
const AdminController = require('../controllers/AdminController')
const { upload, uploadMultiple } = require('../middlewares/multer')
const auth = require('../middlewares/auth')

router.get('/', AdminController.index)

router.get('/login', AdminController.view_login)
router.post('/login', AdminController.action_login)

router.use(auth)
router.get('/logout', AdminController.action_logout)
router.get('/dashboard', AdminController.view_dashboard)

// ENDPOINT CATEGORY
router.get('/category', AdminController.view_category)
router.post('/category', AdminController.add_category)
router.put('/category', AdminController.edit_category)
router.delete('/category/:id', AdminController.delete_category)


// ENDPOINT BANK
router.get('/bank', AdminController.view_bank)
router.post('/bank', upload, AdminController.add_bank)
router.put('/bank', upload, AdminController.edit_bank)
router.delete('/bank/:id', AdminController.delete_bank)


// ENDPOINT ITEM
router.get('/item', AdminController.view_item)
router.post('/item', uploadMultiple, AdminController.add_item)
router.get('/item/show-image/:id', AdminController.show_image_item)
router.get('/item/:id', AdminController.show_item)
router.put('/item/:id', uploadMultiple, AdminController.edit_item)
router.delete('/item/:id', AdminController.delete_item)

// ENDPOINT DETAIL ITEM
router.get('/item/show-detail-item/:item_id', AdminController.view_detail_item)
router.post('/item/add/feature', upload, AdminController.add_feature)
router.put('/item/update/feature', upload, AdminController.edit_feature)
router.delete('/item/delete/feature/:id/:item_id', AdminController.delete_feature)

router.post('/item/add/activity', upload, AdminController.add_activity)
router.put('/item/update/activity', upload, AdminController.edit_activity)
router.delete('/item/delete/activity/:id/:item_id', AdminController.delete_activity)

// ENDPOINT BOOKING
router.get('/booking', AdminController.view_booking)
router.get('/booking/:id', AdminController.show_detail_booking)
router.put('/booking/:id/confirmation', AdminController.booking_confirmation)
router.put('/booking/:id/reject', AdminController.booking_reject)

module.exports = router;