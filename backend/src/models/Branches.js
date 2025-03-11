import {Schema, model} from "mongoose";
 
const branchesSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100
    },
    address: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true,
        match: [
            /^[0-9]{8}$/,
            "El teléfono debe contener exactamente 8 dígitos numéricos"
        ]
    },
    schedule: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    strict: false
});
 
export default model("branches", branchesSchema);