const express = require('express');
const router = express.Router();
const { httpVenta } = require('../controllers/ventas.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos.js');
const { clienteHelper } = require('../helpers/clientes.js');
const { productoHelper } = require('../helpers/productos.js');
const { ventasHelper } = require('../helpers/ventas.js');
const { validarJWT } = require('../middleware/validarJWT.js');


router.get('/', [
    validarJWT
], httpVenta.listarTodo);

router.get('/ventas/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(ventasHelper.existeVentaID),
    validarCampos
], httpVenta.obtenerPorId);

router.get('/activas', [
    validarJWT
], httpVenta.listarActivas);

router.get('/inactivas', [
    validarJWT
], httpVenta.listarInactivas);

router.get('/cliente/:id', [
    validarJWT,
    check('idcliente', 'No es un ID válido').isMongoId(),
    check('idcliente').custom(clienteHelper.existeClienteID),
    validarCampos
], httpVenta.listarPorCliente);

router.get('/fechas/:inicio/:fin', [
    validarJWT
], httpVenta.listarPorRangoDeFechas);

router.get('/valor/:valor', [
    validarJWT,
    check('valor', 'Este campo no es valido').isNumeric(),
    validarCampos
], httpVenta.listarPorValorSuperior);

router.get('/totalventas/:inicio/:fin', [
    validarJWT
], httpVenta.calcularTotalPorRangoDeFechas);

router.get('/totaldescuento', [
    validarJWT
], httpVenta.calcularTotalDescuento);

router.post('/', [
    validarJWT,
    check('idproducto', 'No es un ID válido').isMongoId(),
    check('idproducto').custom(productoHelper.existeProductoID),
    check('idcliente', 'No es un ID válido').isMongoId(),
    check('idcliente').custom(clienteHelper.existeClienteID),
    check('fecha', 'Este campo es obligatorio').notEmpty(),
    check('descuento', 'Este campo es obligatorio').notEmpty(),
    check('descuento', 'Este campo es obligatorio').isNumeric(),
    validarCampos
], httpVenta.crear);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(ventasHelper.existeVentaID),
    check('idproducto', 'No es un ID válido').isMongoId(),
    check('idproducto').custom(productoHelper.existeProductoID),
    check('idcliente', 'No es un ID válido').isMongoId(),
    check('idcliente').custom(clienteHelper.existeClienteID),
    check('fecha', 'Este campo es obligatorio').notEmpty(),
    check('descuento', 'Este campo es obligatorio').notEmpty(),
    check('descuento', 'Este campo es obligatorio').isNumeric(),
    validarCampos
], httpVenta.actualizar);

router.put('/activar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(ventasHelper.existeVentaID),
    validarCampos
], httpVenta.activar);

router.put('/desactivar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(ventasHelper.existeVentaID),
    validarCampos
], httpVenta.desactivar);


module.exports = router;