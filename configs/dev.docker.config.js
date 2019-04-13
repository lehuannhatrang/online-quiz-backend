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
    BASE_NAME: '/',
    CLIENT_PATH: path.resolve(__dirname, 'dist'),
    ACCESS_CONTROL_ORIGIN: '*'
}

//create folder if not exist