const { Router } = require('express');
const { check } = require('express-validator');
const { 
    getClients, 
    getClientById, 
    createClient, 
    updateClient, 
    deleteClient, 
    verifyClient,
    loginClient 
} = require('../controllers/ClientsController');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Obtener todos los clientes - público
router.get('/', getClients);

// Obtener un cliente por ID - público
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], getClientById);

// Crear cliente - público
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastName', 'El apellido es obligatorio').not().isEmpty(),
    check('birthday', 'La fecha de nacimiento es obligatoria').not().isEmpty(),
    check('email', 'El correo no es válido').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('telephone', 'El teléfono es obligatorio').not().isEmpty(),
    check('dui', 'El DUI es obligatorio').not().isEmpty(),
    validarCampos
], createClient);

// Login de cliente
router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], loginClient);

// Actualizar cliente - privado (con token)
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], updateClient);

// Eliminar un cliente - privado (con token)
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], deleteClient);

// Verificar un cliente - privado (con token, típicamente solo admin podría hacer esto)
router.patch('/verify/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], verifyClient);

module.exports = router;