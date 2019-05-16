import path from 'path';
export const DevOnlineDBConfig = {
    PROFILE: 'dev',
    AUTH_DB: {
        url: 'mongodb+srv://cluster0-xg3hl.mongodb.net/online-quiz', options: {
            user: "admin",
            pass: "admin",
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