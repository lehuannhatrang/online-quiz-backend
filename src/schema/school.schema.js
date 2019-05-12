import Schema from "mongoose";
export const SchoolSchema = {
    name: {
        type: String,
    },
    level:{
        type:String,
        enum:['primary','secondary','college'],
        require:true
    },
    provine:{
        type:String,
        require:true 
    },
    address:{
        type:String,
        require:true
    }
}