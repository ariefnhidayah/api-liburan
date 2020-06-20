const Item = require('../models/Item')
const Treasure = require('../models/Activity')
const Traveller = require('../models/Booking')
const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Member = require('../models/Member')
const Booking = require('../models/Booking')

module.exports = {
    landing_page: async (req, res) => {
        try {
            const mostpicked = await Item.find().select('_id title country city price unit image_id').limit(5).populate({ 
                path: 'image_id', 
                select: '_id image',
                perDocumentLimit: 1 
            })

            const traveller = await Traveller.find()
            const treasure = await Treasure.find()
            const city = await Item.find()

            const category = await Category.find().select('_id name').populate({ 
                path: 'item_id', 
                select: '_id title country city is_popular image_id',
                populate: {
                    path: 'image_id',
                    select: '_id image',
                    perDocumentLimit: 1
                } ,
                perDocumentLimit: 4,
                option: {
                    sort: {
                        sum_booking: -1
                    }
                }
            })

            for (let i = 0; i < category.length; i++) {
                for (let j = 0; j < category[i].item_id.length; j++) {
                    const item = await Item.findOne({ _id: category[i].item_id[j]._id })
                    item.is_popular = false
                    await item.save()
                    if (category[i].item_id[0] === category[i].item_id[j]) {
                        item.is_popular = true
                        await item.save()
                    }
                }
            }

            const testimonial = {
                _id: "asd1293uasdads1",
                image: "images/testimonial2.jpg",
                name: "Happy Family",
                rate: 4.86,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Arief",
                familyOccupation: "Web Developer"
            }

            res.status(200).json({ 
                mostpicked,
                hero: {
                    travelers: traveller.length,
                    treasures: treasure.length,
                    cities: city.length
                },
                category,
                testimonial
             })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal Server error" })
        }
    },

    detail_page: async (req, res) => {
        try {
            const { id } = req.params
            const item = await Item.findOne({ _id: id })
                                    .populate({ path: 'image_id', select: '_id image' })
                                    .populate({ 
                                        path: 'feature_id', 
                                        select: '_id qty name image',
                                    })
                                    .populate({ path: 'activity_id', select: '_id name type image' })
            
            const bank = await Bank.find()
            const testimonial = {
                _id: "asd1293uasdads1",
                image: "images/testimonial1.jpg",
                name: "Happy Family",
                rate: 4.86,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Arief",
                familyOccupation: "Web Developer"
            }

            res.status(200).json({
                ...item._doc,
                bank,
                testimonial
            })
        } catch (error) {
            res.status(500).json({
                message: 'Internal Server Error'
            })
        }
    },

    booking_page: async (req, res) => {
        const {
            duration,
            // price,
            date_start,
            date_end,
            first_name,
            last_name,
            email,
            phone,
            account_holder,
            bank_from,
            item_id
        } = req.body

        if(!req.file) {
            return res.status(404).json({
                message: "Image not found"
            })
        }

        if (duration === undefined ||
            // price === undefined ||
            date_start === undefined ||
            date_end === undefined ||
            first_name === undefined ||
            last_name === undefined ||
            email === undefined ||
            phone === undefined ||
            account_holder === undefined ||
            bank_from === undefined ||
            item_id === undefined) {
                res.status(404).json({
                    message: "Lengkapi semua field"
                })
        }

        const item = await Item.findOne({ _id: item_id })

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            })
        } 

        item.sum_booking += 1;

        await item.save()

        let total = item.price * duration
        let tax = total * 0.10

        const invoice = Math.floor(1000000 + Math.random() * 9000000)

        const member = await Member.create({
            first_name,
            last_name,
            email,
            phone_number: phone
        })

        const new_booking = {
            invoice,
            date_start,
            date_end,
            total: total + tax,
            item_id: {
                _id: item._id,
                title: item.title,
                price: item.price,
                duration: duration
            },
            member_id: member._id,
            payments: {
                proof_payment: `images/${req.file.filename}`,
                bank_from: bank_from,
                account_holder,
            }
        }

        const booking = await Booking.create(new_booking)

        res.status(201).json({
            message: "Success Booking",
            booking: booking
        })
          
    }
}