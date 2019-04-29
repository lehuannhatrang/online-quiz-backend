export const QuestionSchema = {
    question: {
        type: String,
        require: true,
        trim: true
    },
    answer: {
        type: String,
        trim: true,
        require:true
    },
    options: {
        type: [String],
        require: true
    }
}