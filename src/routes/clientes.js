const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { httpCliente } = require('../controllers/clientes.js');
const { validarCampos } = require('../middleware/validarCampos.js');
const { clienteHelper } = require('../helpers/clientes.js');
const { validarJWT } = require('../middleware/validarJWT.js');


// Rutas para los controladores de clientes
router.get('/clientes', [
    validarJWT
], httpCliente.listarClientes);

router.get('/activos', [
    validarJWT
], httpCliente.listarClientesActivos);

router.get('/inactivos', [
    validarJWT
], httpCliente.listarClientesInactivos);

router.get('/clientes/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(clienteHelper.existeClienteID),
    validarCampos
], httpCliente.obtenerClientePorId);

router.post('/clientes', [
    validarJWT,
    check('nombre', 'Este campo es obligatorio').notEmpty(),
    check('documento', 'Este campo es obligatorio').notEmpty(),
    check('documento', 'Este documento no es valido').isLength(({ min: 10, max: 10 })),
    check('documento', 'Este documento ya existe').custom(clienteHelper.existeDocumento),
    check('direccion', 'Este campo es obligatorio').notEmpty(),
    check('email', 'Este campo es obligatorio').notEmpty(),
    check('email', 'El email no es valido').isEmail(),
    check('email').custom(clienteHelper.existeEmail),
    check('fecha_compra', 'Este campo es obligatorio').notEmpty(),
    validarCampos
], httpCliente.insertarCliente);

router.put('/clientes/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(clienteHelper.existeClienteID),
    check('nombre', 'Este campo es obligatorio').optional().notEmpty(),
    check('documento', 'Este campo es obligatorio').optional().notEmpty(),
    check('documento', 'Este documento no es valido').isLength(({ min: 10, max: 10 })),
    check('documento', 'Este documento ya existe').custom(clienteHelper.existeDocumento),
    check('direccion', 'Este campo es obligatorio').optional().notEmpty(),
    check('email', 'Este campo es obligatorio').optional().notEmpty(),
    check('email', 'El email no es valido').optional().isEmail(),
    check('email').optional().custom(clienteHelper.existeEmail),
    check('fecha_compra', 'Este campo es obligatorio').optional().notEmpty(),
    check('fecha_compra', 'La fecha no es valida').optional().isDate(),
    validarCampos
], httpCliente.modificarCliente);

router.put('/desactivar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(clienteHelper.existeClienteID),
    validarCampos
], httpCliente.desactivarCliente);

router.put('/activar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(clienteHelper.existeClienteID),
    validarCampos
], httpCliente.activarCliente);


module.exports = router;


