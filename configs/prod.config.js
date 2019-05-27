export const ProdConfig = {
    PROFILE: 'production',
    AUTH_DB: {
        url: 'mongodb+srv://cluster0-xg3hl.mongodb.net/online-quiz', options: {
            user: "admin",
            pass: "admin",
            useNewUrlParser: true
        }
    },
    URL_BACKEND: "https://online-quiz-ttcnpm.herokuapp.com/api",
    URL_FRONTEND: "https://online-quiz-client.herokuapp.com",
    BASE_NAME: '/',
    ACCESS_CONTROL_ORIGIN: '*'
}