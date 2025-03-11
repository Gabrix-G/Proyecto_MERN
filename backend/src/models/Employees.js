import {Schema, model} from "mongoose";
 
const employeesSchema = new Schema({
    name: {
        type: String,
        require: true,
        maxLength: 100
    },
    lastName: {
        type: String,
        require: true,
        maxLength: 100
    },
    birthday: {
        type: Date,
        require: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
          /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
          "Por favor, ingrese un correo electrónico válido",
        ]
    },
    address: {
        type: String,
        required: true
    },
    hireDate: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        require: true,
        minLength: 6
    },
    telephone: {
        type: String,
        required: true,
        match: [
            /^[0-9]{8}$/,
            "El teléfono debe contener exactamente 8 dígitos numéricos"
        ]
    },
    dui: {
        type: String,
        required: true,
        match: [/^[0-9]{8}-[0-9]{1}$/, "El formato del DUI debe ser 12345678-9"]
    },
    isssNumber: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    strict: false
});
 
export default model("employees", employeesSchema);