export const ProdConfig = {
    PROFILE: 'production',
    AUTH_DB: {
        url: 'mongodb://mongodb:27017/online-quiz', options: {
            user: "",
            pass: "",
            useNewUrlParser: true
        }
    },
    URL_BACKEND: "https://onlinequiz.com/api",
    URL_FRONTEND: "https://onlinequiz.com",
    BASE_NAME: '/',
    ACCESS_CONTROL_ORIGIN: '*'
}