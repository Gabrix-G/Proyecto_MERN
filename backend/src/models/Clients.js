const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClienteSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    birthday: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un correo electrónico válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    telephone: {
        type: String,
        required: [true, 'El número de teléfono es obligatorio']
    },
    dui: {
        type: String,
        required: [true, 'El DUI es obligatorio'],
        unique: true,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // Esto agrega automáticamente los campos createdAt y updatedAt
    versionKey: false // Esto elimina el campo __v que Mongoose agrega por defecto
});

// Método para personalizar la respuesta JSON (eliminar campos sensibles)
ClienteSchema.methods.toJSON = function() {
    const { __v, password, _id, ...cliente } = this.toObject();
    cliente.uid = _id; // Renombrar _id a uid
    return cliente;
};

module.exports = mongoose.model('Cliente', ClienteSchema);