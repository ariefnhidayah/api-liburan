const is_login = (req, res, next) => {
    if (req.session.user == null || req.session.user == undefined) {
        req.flash('alert_message', 'Login terlebih dahulu!')
        req.flash('alert_status', 'danger')
        res.redirect('/admin/login')
    } else {
        next()
    }
}

module.exports = is_login