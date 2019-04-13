import path from 'path';
export const DevConfig = {
    PROFILE: 'dev',
    AUTH_DB: {
        url: 'mongodb://localhost:27017/online-quiz', options: {
            user: "",
            pass: "",
            useNewUrlParser: true
        }
    },
    URL_BACKEND: "http://localhost:5001",
    URL_FRONTEND: "http://localhost:5000",
    BASE_NAME: '/',
    CLIENT_PATH: path.resolve(__dirname, 'dist'),
    ACCESS_CONTROL_ORIGIN: '*'
}

//create folder if not exist