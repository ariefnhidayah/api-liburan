const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Item = require('../models/Item')
const Image = require('../models/Image')
const Feature = require('../models/Feature')
const Activity = require('../models/Activity')
const User = require('../models/User')
const Booking = require('../models/Booking')
const Member = require('../models/Member')
const fs = require('fs-extra') //untuk mengelola file / folder
const path = require('path')
const config = require('../config')
const bcrypt = require('bcrypt')

module.exports = {

    // LOG IN
    view_login: async (req, res) => {
        if (req.session.user == null || req.session.user == undefined) {
            const alert_message = req.flash('alert_message')
            const alert_status = req.flash('alert_status')
            const alert = {
                message: alert_message,
                status: alert_status
            }
            const data = {
                title: 'Login - ' + config.site_name,
                alert: alert
            }
            res.render('index', data)
        } else {
            res.redirect('/admin/dashboard')
        }
    },

    action_login: async (req, res) => {
        try {
            const { username, password } = req.body
            const user = await User.findOne({
                username: username
            })
            if (!user) {
                req.flash('alert_message', 'User tidak ada')
                req.flash('alert_status', 'danger')
                res.redirect('/admin/login')
            }
            const is_password_match = await bcrypt.compare(password, user.password)
            if (!is_password_match) {
                req.flash('alert_message', 'Password salah!')
                req.flash('alert_status', 'danger')
                res.redirect('/admin/login')
            }
            req.session.user = {
                id: user._id,
                username: user.username
            }
            res.redirect('/admin/dashboard')
        } catch (error) {
            req.flash('alert_message', error.message)
                req.flash('alert_status', 'danger')
                res.redirect('/admin/login')
        }
    },

    action_logout: async (req, res) => {
        req.session.destroy()
        res.redirect('/admin/login')
    },

    index: (req, res) => {
        res.redirect('/admin/dashboard')
    },

    view_dashboard: async (req, res) => {
        const view_path = './dashboard/view.ejs'
        const member = await Member.find()
        const booking = await Booking.find()
        const item = await Item.find()
        const user = req.session.user
        const data = {
            content: view_path, 
            menu_active: 'dashboard',
            title: 'Dashboard - ' + config.site_name,
            user: user,
            member,
            booking,
            item
        }
        res.render('admin/index', data)
    },

    // CATEGORY
    view_category: async (req, res) => {
        const categories = await Category.find();
        const user = req.session.user
        const view_path = './category/view.ejs'
        const alert_message = req.flash('alert_message')
        const alert_status = req.flash('alert_status')
        const alert = {
            message: alert_message,
            status: alert_status
        }
        const data = {
            content: view_path, 
            menu_active: 'category',
            title: 'Kategori - ' + config.site_name,
            categories: categories,
            alert: alert,
            user: user
        }
        res.render('admin/index', data)
    },

    // METHOD ADD CATEGORY
    add_category: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.create({name});
            req.flash('alert_message', 'Berhasil menambah kategori')
            req.flash('alert_status', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/category')
        }
    },

    // METHOD EDIT CATEGORY
    edit_category: async (req, res) => {
        try {
            const { id, name } = req.body
            const category = await Category.findOne({_id: id})
            category.name = name
            await category.save()
            req.flash('alert_message', 'Berhasil mengubah kategori')
            req.flash('alert_status', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alert_message', 'Gagal mengubah kategori')
            req.flash('alert_status', 'danger')
            res.redirect('/admin/category')
        }
    },

    // METHOD DELETE CATEGORY
    delete_category: async (req, res) => {
        try {
            const { id }  = req.params
            const category = await Category.findOne({_id: id})
            await category.remove()
            req.flash('alert_message', 'Berhasil menghapus kategori')
            req.flash('alert_status', 'success')
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/category')
        }
    },

    
    // BANK
    view_bank: async (req, res) => {
        const banks = await Bank.find()
        const user = req.session.user
        const view_path = './bank/view.ejs'
        const alert_message = req.flash('alert_message')
        const alert_status = req.flash('alert_status')
        const alert = {
            message: alert_message,
            status: alert_status
        }
        const data = {
            content: view_path, 
            menu_active: 'bank',
            title: 'Bank - ' + config.site_name,
            alert: alert,
            banks: banks,
            user: user
        }
        res.render('admin/index', data)
    },

    add_bank: async (req, res) => {
        try {
            const { name_bank, account_number, account_name } = req.body
            await Bank.create({
                name_bank,
                account_number,
                account_name,
                image: `images/${req.file.filename}`
            })
            req.flash('alert_message', 'Berhasil menambah bank')
            req.flash('alert_status', 'success')
            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/bank')
        }
    },

    edit_bank: async (req, res) => {
        try {
            const { id, name_bank, account_number, account_name } = req.body
            const bank = await Bank.findById({ _id: id })
            if (req.file == undefined) {
                bank.name_bank = name_bank
                bank.account_number = account_number
                bank.account_name = account_name
                await bank.save()
                req.flash('alert_message', 'Berhasil mengubah bank')
                req.flash('alert_status', 'success')
                res.redirect('/admin/bank')
            } else {
                await fs.unlink(path.join(`public/${bank.image}`))
                bank.name_bank = name_bank
                bank.account_number = account_number
                bank.account_name = account_name
                bank.image = `images/${req.file.filename}`
                await bank.save()
                req.flash('alert_message', 'Berhasil mengubah bank')
                req.flash('alert_status', 'success')
                res.redirect('/admin/bank')
            }
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/bank')
        }
    },

    delete_bank: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findById({ _id: id })
            await fs.unlink(path.join(`public/${bank.image}`))
            await bank.remove()
            req.flash('alert_message', 'Berhasil menghapus bank')
            req.flash('alert_status', 'success')
            res.redirect('/admin/bank')
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/bank')
        }
    },

    view_item: async (req, res) => {
        const view_path = './item/view.ejs'
        const user = req.session.user
        const categories = await Category.find()
        const alert_message = req.flash('alert_message')
        const alert_status = req.flash('alert_status')
        const items = await Item.find().populate({ 
            path: 'image_id',
            select: 'id image'
        }).populate({
            path: 'category_id',
            select: 'id name'
        })
        const alert = {
            message: alert_message,
            status: alert_status
        }
        const data = {
            content: view_path, 
            menu_active: 'item',
            title: 'Item - ' + config.site_name,
            categories: categories,
            alert: alert,
            items,
            action: 'view',
            user: user
        }
        res.render('admin/index', data)
    },

    add_item: async (req, res) => {
        try {
            const { category_id, title, price, city, description } = req.body
            if (req.files.length > 0) {
                const category = await Category.findOne({ _id: category_id })
                const new_item = {
                    category_id: category._id,
                    title: title,
                    description: description,
                    price: price,
                    city: city
                }
                const item = await Item.create(new_item)
                category.item_id.push({ _id: item._id })
                await category.save()
                for(let i = 0; i < req.files.length; i++) {
                    const image_save = await Image.create({ image: `images/${req.files[i].filename}` })
                    item.image_id.push({ _id: image_save._id})
                    await item.save()
                }
                req.flash('alert_message', 'Berhasil ditambah')
                req.flash('alert_status', 'success')
                res.redirect('/admin/item')
            } else {
                req.flash('alert_message', 'Tidak ada gambar')
                req.flash('alert_status', 'danger')
                res.redirect('/admin/item')
            }
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/item')
        }
    },

    // METHOD SHOW IMAGE ITEM
    show_image_item: async (req, res) => {
        try {
            const { id } = req.params;
            const view_path = './item/view.ejs'
            const alert_message = req.flash('alert_message')
            const alert_status = req.flash('alert_status')
            const user = req.session.user
            const item = await Item.findOne({ _id: id }).populate({ 
                path: 'image_id',
                select: 'id image'
            })
            const alert = {
                message: alert_message,
                status: alert_status
            }
            const data = {
                content: view_path, 
                menu_active: 'item',
                title: 'Images - ' + config.site_name,
                alert: alert,
                item,
                action: 'image',
                user: user
            }
            res.render('admin/index', data)
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/item')
        }
    },

    // METHOD SHOW ITEM
    show_item: async (req, res) => {
        try {
            const { id } = req.params;
            const view_path = './item/view.ejs'
            const alert_message = req.flash('alert_message')
            const alert_status = req.flash('alert_status')
            const categories = await Category.find()
            const user = req.session.user
            const item = await Item.findOne({ _id: id }).populate({ 
                path: 'image_id',
                select: 'id image'
            }).populate({
                path: 'category_id',
                select: 'id name'
            })
            const alert = {
                message: alert_message,
                status: alert_status
            }
            const data = {
                content: view_path, 
                menu_active: 'item',
                title: 'Edit Item - ' + config.site_name,
                alert: alert,
                item,
                action: 'item',
                categories,
                user
            }
            res.render('admin/index', data)
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/item')
        }
    },

    edit_item: async (req, res) => {
        try {
            const { id } = req.params
            const { category_id, title, price, city, description } = req.body
            const item = await Item.findOne({ _id: id }).populate({ 
                path: 'image_id',
                select: 'id image'
            }).populate({
                path: 'category_id',
                select: 'id name'
            })
            if (req.files.length > 0) {
                for (let i = 0; i < item.image_id.length; i++) {
                    const image_update = await Image.findOne({ _id: item.image_id[i]._id })
                    await fs.unlink(path.join(`public/${image_update.image}`))
                    await image_update.remove()
                }
                item.image_id = []
                for (let i = 0; i < req.files.length; i++) {
                    const image_save = await Image.create({ image: `images/${req.files[i].filename}` })
                    item.image_id.push({ _id: image_save._id})
                }
                item.title = title
                item.price = price
                item.city = city
                item.description = description
                item.category_id = category_id
                await item.save()
                req.flash('alert_message', 'Berhasil diubah')
                req.flash('alert_status', 'success')
                res.redirect('/admin/item')
            } else {
                item.title = title
                item.price = price
                item.city = city
                item.description = description
                item.category_id = category_id
                await item.save()
                req.flash('alert_message', 'Berhasil diubah')
                req.flash('alert_status', 'success')
                res.redirect('/admin/item')
            }
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/item')
        }
    },

    delete_item: async (req, res) => {
        try {
            const { id } = req.params
            const item = await Item.findOne({ _id: id }).populate('image_id')
            for (let i = 0; i < item.image_id.length; i++) {
                Image.findOne({ _id: item.image_id[i]._id }).then(image => {
                    fs.unlink(path.join(`public/${image.image}`))
                    image.remove()
                }).catch(error => {
                    req.flash('alert_message', error.message)
                    req.flash('alert_status', 'danger')
                    res.redirect('/admin/item')
                }) 
            }
            await item.remove()
            req.flash('alert_message', 'Berhasil dihapus')
            req.flash('alert_status', 'success')
            res.redirect('/admin/item')
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/item')
        }
    },

    view_detail_item: async (req, res) => {
        const { item_id } = req.params
        try {
            const view_path = './item/detail_item/view_item.ejs'
            const alert_message = req.flash('alert_message')
            const alert_status = req.flash('alert_status')
            const feature = await Feature.find({ item_id: item_id })
            const activity = await Activity.find({ item_id: item_id })
            const user = req.session.user
            const alert = {
                message: alert_message,
                status: alert_status
            }
            const data = {
                content: view_path, 
                menu_active: 'item',
                title: 'Detail Item - ' + config.site_name,
                alert: alert,
                item_id,
                features: feature,
                activity,
                user
            }
            res.render('admin/index', data)
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect(`/admin/item/show-detail-item/${item_id}`)
        }
    },

    add_feature: async (req, res) => {
        const { qty, name, item_id } = req.body
        try {
            if(!req.file) {
                req.flash('alert_message', 'Tidak ada gambar')
                req.flash('alert_status', 'danger')
                res.redirect('/admin/item/show-detail-item/' + item_id)    
            }
            const feature = await Feature.create({
                name,
                qty,
                item_id,
                image: `images/${req.file.filename}`
            })

            const item = await Item.findOne({ _id: item_id })
            item.feature_id.push({ _id: feature._id })
            await item.save()
            req.flash('alert_message', 'Berhasil menambah feature')
            req.flash('alert_status', 'success')
            res.redirect('/admin/item/show-detail-item/' + item_id)
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/item/show-detail-item/' + item_id)
        }
    },

    edit_feature: async (req, res) => {
        const { id, name, qty, item_id } = req.body
        try {
            const feature = await Feature.findById({ _id: id })
            if (req.file == undefined) {
                feature.name = name
                feature.qty = qty
                await feature.save()
                req.flash('alert_message', 'Berhasil mengubah feature')
                req.flash('alert_status', 'success')
                res.redirect(`/admin/item/show-detail-item/${item_id}`)
            } else {
                await fs.unlink(path.join(`public/${feature.image}`))
                feature.name = name
                feature.qty = qty
                feature.image = `images/${req.file.filename}`
                await feature.save()
                req.flash('alert_message', 'Berhasil mengubah feature')
                req.flash('alert_status', 'success')
                res.redirect(`/admin/item/show-detail-item/${item_id}`)
            }
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect(`/admin/item/show-detail-item/${item_id}`)
        }
    },

    delete_feature: async (req, res) => {
        const { id, item_id } = req.params;
        try {
            const feature = await Feature.findById({ _id: id })
            const item = await Item.findOne({ _id: item_id }).populate('feature_id')
            for(let i = 0; i < item.feature_id.length; i++) {
                if (item.feature_id[i]._id.toString() === feature._id.toString()) {
                    item.feature_id.pop({ _id: feature._id })
                    await item.save()
                }
            }
            await fs.unlink(path.join(`public/${feature.image}`))
            await feature.remove()
            req.flash('alert_message', 'Berhasil menghapus feature')
            req.flash('alert_status', 'success')
            res.redirect(`/admin/item/show-detail-item/${item_id}`)
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect(`/admin/item/show-detail-item/${item_id}`)
        }
    },

    add_activity: async (req, res) => {
        const { type, name, item_id } = req.body
        try {
            if(!req.file) {
                req.flash('alert_message', 'Tidak ada gambar')
                req.flash('alert_status', 'danger')
                res.redirect('/admin/item/show-detail-item/' + item_id)    
            }
            const activity = await Activity.create({
                name,
                type,
                item_id,
                image: `images/${req.file.filename}`
            })

            const item = await Item.findOne({ _id: item_id })
            item.activity_id.push({ _id: activity._id })
            await item.save()
            req.flash('alert_message', 'Berhasil menambah activity')
            req.flash('alert_status', 'success')
            res.redirect('/admin/item/show-detail-item/' + item_id)
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect('/admin/item/show-detail-item/' + item_id)
        }
    },

    edit_activity: async (req, res) => {
        const { id, name, type, item_id } = req.body
        try {
            const activity = await Activity.findById({ _id: id })
            if (req.file == undefined) {
                activity.name = name
                activity.type = type
                await activity.save()
                req.flash('alert_message', 'Berhasil mengubah activity')
                req.flash('alert_status', 'success')
                res.redirect(`/admin/item/show-detail-item/${item_id}`)
            } else {
                await fs.unlink(path.join(`public/${activity.image}`))
                activity.name = name
                activity.type = type
                activity.image = `images/${req.file.filename}`
                await activity.save()
                req.flash('alert_message', 'Berhasil mengubah activity')
                req.flash('alert_status', 'success')
                res.redirect(`/admin/item/show-detail-item/${item_id}`)
            }
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect(`/admin/item/show-detail-item/${item_id}`)
        }
    },

    delete_activity: async (req, res) => {
        const { id, item_id } = req.params;
        try {
            const activity = await Activity.findById({ _id: id })
            const item = await Item.findOne({ _id: item_id }).populate('activity_id')
            for(let i = 0; i < item.activity_id.length; i++) {
                if (item.activity_id[i]._id.toString() === activity._id.toString()) {
                    item.activity_id.pop({ _id: activity._id })
                    await item.save()
                }
            }
            await fs.unlink(path.join(`public/${activity.image}`))
            await activity.remove()
            req.flash('alert_message', 'Berhasil menghapus activity')
            req.flash('alert_status', 'success')
            res.redirect(`/admin/item/show-detail-item/${item_id}`)
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect(`/admin/item/show-detail-item/${item_id}`)
        }
    },

    view_booking: async (req, res) => {
        try {
            const booking = await Booking.find().populate('member_id').populate('bank_id')
            const view_path = './booking/view.ejs'
            const user = req.session.user
            const data = {
                content: view_path, 
                menu_active: 'booking',
                title: 'Booking - ' + config.site_name,
                user,
                bookings: booking
            }
            res.render('admin/index', data)
        } catch (error) {
            res.redirect('/admin/booking');
        }
    },

    show_detail_booking: async (req, res) => {
        const { id } = req.params
        const booking = await Booking.findOne({ _id: id }).populate('member_id').populate('bank_id')
        console.log(booking.payments.proof_payment)
        const view_path = './booking/show_detail_booking.ejs'
        const user = req.session.user
        const alert_message = req.flash('alert_message')
        const alert_status = req.flash('alert_status')
        const alert = {
            message: alert_message,
            status: alert_status
        }
        const data = {
            content: view_path,
            menu_active: 'booking',
            title: 'Detail Booking - ' + config.site_name,
            user,
            booking,
            alert
        }
        res.render('admin/index', data)
    },

    booking_confirmation: async (req, res) => {
        const { id } = req.params
        try {
            const booking = await Booking.findOne({ _id: id })
            booking.payments.status = 'Accept'
            await booking.save() 
            req.flash('alert_message', 'Pesanan berhasil diterima')
            req.flash('alert_status', 'success')
            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect(`/admin/booking/${id}`);
        }
    },

    booking_reject: async (req, res) => {
        const { id } = req.params
        try {
            const booking = await Booking.findOne({ _id: id })
            booking.payments.status = 'Reject'
            await booking.save() 
            req.flash('alert_message', 'Pesanan berhasil ditolak')
            req.flash('alert_status', 'success')
            res.redirect(`/admin/booking/${id}`);
        } catch (error) {
            req.flash('alert_message', error.message)
            req.flash('alert_status', 'danger')
            res.redirect(`/admin/booking/${id}`);
        }
    }
}