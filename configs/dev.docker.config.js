import path from 'path';
export const DevDockerConfig = {
    PROFILE: 'dev',
    AUTH_DB: {
        url: 'mongodb://mongodb:27017/online-quiz', options: {
            user: "",
            pass: "",
            useNewUrlParser: true
        }
    },
    URL_BACKEND: "http://onlinequiz.com:5001",
    URL_FRONTEND: "http://onlinequiz.com",
    CAS_URL: "https://login.vng.com.vn/sso",
    CAS_VERSION: "CAS3.0",
    BASE_NAME: '/',
    CLIENT_PATH: path.resolve(__dirname, 'dist'),
    ACCESS_CONTROL_ORIGIN: '*'
}

//create folder if not exist