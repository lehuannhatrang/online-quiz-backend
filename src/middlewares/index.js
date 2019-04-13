import {IndexConfig} from '../../configs';
import {ObUtil} from '../utils';
import {UserModel, UserInfoModel} from '../models';

// const CasStrategy = require('passport-cas').Strategy;
const LocalStrategy = require('passport-local').Strategy;
class AuthenMiddleware {
    // strategy
    // static strategyCAS() {
    //     return new CasStrategy(
    //         {
    //             version: IndexConfig.CAS_VERSION,
    //             ssoBaseURL: IndexConfig.CAS_URL,
    //             serverBaseURL: IndexConfig.URL_BACKEND
    //         },
    //         function (profile, done) {
    //             // get user from profile
    //             const login = profile.user;
    //             // get user check from username
    //             UserModel.findOne({user: login}).then((user) => {
    //                 if (!user) {
    //                     user = {
    //                         user: login,
    //                         localAccount: false,
    //                         status: 'DISABLED',
    //                     }
    //                     UserModel.createModel(user)
    //                         .then(data => {
    //                             const profiles = JSON.parse(profile.attributes.profile);
    //                             const userInfo = {
    //                                 businessPhones: profiles.businessPhones,
    //                                 employeeId: profiles.employeeId,
    //                                 displayName: profiles.displayName,
    //                                 department: profiles.department,
    //                                 jobTitle: profiles.jobTitle,
    //                                 mail: profiles.mail,
    //                                 mobilePhone: profiles.mobilePhone,
    //                                 user: data._id,
    //                             }
    //                             UserInfoModel.createModel(userInfo);
    //                             return done(null, data);
    //                         })
    //                         .catch(err => done(err))
    //                 } else {
    //                     //user.attributes = profile.attributes;
    //                     return done(null, user);
    //                 }
    //             }, (err) => {
    //                 return done(err);
    //             });
    //         }
    //     )
    // }

    static strategyLocal() {
        return new LocalStrategy((username, password, done) => {
            UserModel.getUserByUsername(username)
                .then(user => {
                    if (!user) {
                        return done(null, false, {message: 'Incorrect username or password'});
                    }

                    const result = password === user.password;    
                    console.log("result: ", result);
                    if (!result) {
                        return done(err, false, {message: 'Incorrect username or password'});
                    }
                    console.log("OK");
                    return done(null, user);
                });
        })
    }

    

    // serial User
    static serializeUser(user, done) {
        // lay ghi du lieu ra ngoai
        done(null, user);
    }

    // deserialLize
    static deserializeUser(user, done) {
        // get user by Id
        let userId = ObUtil.toObjectIdMongo(user._id);
        // get user by id
        UserModel.getById(userId).then((user) => {
            if (!user) {
                return done(null, false, { message: 'Unknown user' });
            }
            // set atrribute
            return done(null, user);
        }, (err) => {
            return done(err);
        });
    }

    static isAuthenticated(req, res, next) {
        //console.log(req.headers);
        return next();
        // if (req.isAuthenticated()) {
        //     return next();
        // } else {
        //     res.redirect(urljoin(IndexConfig.BASE_NAME, 'auth'));
        // }
    }
}

export default AuthenMiddleware;