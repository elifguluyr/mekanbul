const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('user');
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, done) => {
            User.findOne({ email: email })
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: "Kullanıcı bulunamadı." }); // İlk parametre null olmalı
                    }
                    if (!user.checkPassword(password)) {
                        return done(null, false, { message: "Şifre hatalı." }); // İlk parametre null olmalı
                    }
                    return done(null, user); // Başarılı: hata yok (null), kullanıcıyı döndür
                }).catch((err) => {
                    return done(err); // Sistem hatası
            });
        }
    )
);
