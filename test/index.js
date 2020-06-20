const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const app = require('../app')
const fs = require('fs')

chai.use(chaiHttp)

describe('API ENDPOINT TESTING', () => {
    it("GET Landing Page", (done) => {
        chai.request(app).get('/api/v1/member/landing-page').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('Object')
            expect(res.body).to.have.property('hero')
            expect(res.body.hero).to.have.all.keys('travelers', 'treasures', 'cities')
            expect(res.body).to.have.property('mostpicked')
            expect(res.body.mostpicked).to.have.an('array')
            expect(res.body).to.have.property('category')
            expect(res.body.category).to.have.an('array')
            expect(res.body).to.have.property('testimonial')
            expect(res.body.testimonial).to.have.an('Object')
            done()
        })
    })

    it("GET Detail Page", (done) => {
        chai.request(app).get('/api/v1/member/detail/5e96cbe292b97300fc902222').end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('Object')
            expect(res.body).to.have.property('country')
            expect(res.body).to.have.property('is_popular')
            expect(res.body).to.have.property('sum_booking')
            expect(res.body).to.have.property('_id')
            expect(res.body).to.have.property('title')
            expect(res.body).to.have.property('price')
            expect(res.body).to.have.property('description')
            expect(res.body).to.have.property('unit')
            expect(res.body).to.have.property('category_id')
            expect(res.body).to.have.property('image_id')
            expect(res.body.image_id).to.have.an('array')
            expect(res.body).to.have.property('feature_id')
            expect(res.body.feature_id).to.have.an('array')
            expect(res.body).to.have.property('activity_id')
            expect(res.body.activity_id).to.have.an('array')
            expect(res.body).to.have.property('bank')
            expect(res.body.bank).to.have.an('array')
            expect(res.body).to.have.property('testimonial')
            expect(res.body.testimonial).to.have.an('object')
            done()
        })
    })

    it("POST Booking", (done) => {
        const image = __dirname + '/payment.jpeg'
        const dataSample = {
            image,
            duration : 2,
            date_start : '2020-06-20',
            date_end : '2020-06-22',
            first_name : 'Arief',
            last_name : 'Hidayah',
            email : 'ariefnhidayah@gmail.com',
            phone : '085695469574',
            account_holder : 'Arief',
            bank_from : 'BCA',
            item_id : '5e96cbe292b97300fc902222'
        }

        chai.request(app).post('/api/v1/member/booking')
            .set('Content-Type', 'application/x-www-urlencoded')
            .attach('image', fs.readFileSync(dataSample.image), 'payment.jpeg')
            .field('duration', dataSample.duration)
            .field('date_start', dataSample.date_start)
            .field('date_end', dataSample.date_end)
            .field('first_name', dataSample.first_name)
            .field('last_name', dataSample.last_name)
            .field('email', dataSample.email)
            .field('phone', dataSample.phone)
            .field('account_holder', dataSample.account_holder)
            .field('bank_from', dataSample.bank_from)
            .field('item_id', dataSample.item_id)
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(201)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.equal("Success Booking")
                expect(res.body).to.have.property('booking')
                expect(res.body.booking).to.have.all.keys('payments', '_id', 'invoice', 'date_start', 'date_end', 'total', 'item_id', 'member_id', '__v')
                expect(res.body.booking.payments).to.have.all.keys('status', 'proof_payment', 'bank_from', 'account_holder')
                expect(res.body.booking.item_id).to.have.all.keys('_id', 'title', 'price', 'duration')
                done()
            })
    })
})