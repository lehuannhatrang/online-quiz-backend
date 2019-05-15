export const ProdConfig = {
    PROFILE: 'production',
    AUTH_DB: {
        url: 'mongodb+srv://cluster0-xg3hl.mongodb.net/test', options: {
            user: "admin",
            pass: "admin",
            useNewUrlParser: true
        }
    },
    URL_BACKEND: "https://online-quiz-ttcnpm.herokuapp.com/api",
    URL_FRONTEND: "https://onlinequiz.com",
    BASE_NAME: '/',
    ACCESS_CONTROL_ORIGIN: '*'
}