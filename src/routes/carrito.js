const express = require('express');
const router = express.Router();
const { httpCarrito } = require('../controllers/carrito.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos.js');
const { clienteHelper } = require('../helpers/clientes.js');
const { carritoHelper } = require('../helpers/carrito.js');
const { productoHelper } = require('../helpers/productos.js');

// Rutas para operaciones del carrito
router.get('/cliente/:clienteId', [
    check('cliente', 'No es un ID válido').isMongoId(),
    check('cliente', 'El ID del cliente no existe').custom(clienteHelper.existeClienteID),
    validarCampos
], httpCarrito.listarCarritoPorCliente);

router.post('/carrito', [
    check('cliente', 'No es un ID válido').isMongoId(),
    check('cliente').custom(clienteHelper.existeClienteID),
    check('productos', 'No es un ID válido').isMongoId(),
    check('productos').custom(productoHelper.existeProductoID),
    check('cantidad', 'Este campo es obligatorio').notEmpty(),
    check('cantidad', 'La cantidad no es valida').isNumeric(),
    validarCampos
], httpCarrito.insertarElementoAlCarrito);

router.delete('/carrito/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id', 'El ID del carrito no existe').custom(carritoHelper.existeCarritoID),
    validarCampos
], httpCarrito.eliminarElementoDelCarrito);

module.exports = router;