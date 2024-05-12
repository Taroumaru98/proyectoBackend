const express = require('express');
const router = express.Router();
const { httpDetalle } = require('../controllers/detalle_ventas.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos.js');
const { detalleVentasHelper } = require('../helpers/detalleVenta.js');
const { ventasHelper } = require('../helpers/ventas.js')
const { productoHelper } = require('../helpers/productos.js');
const { validarJWT } = require('../middleware/validarJWT.js');



router.get('/detalle-venta/:idVenta', [
    validarJWT,
    check('idventa', 'No es un ID válido').isMongoId(),
    check('idventa').custom(ventasHelper.existeVentaID),
    validarCampos
], httpDetalle.listarDetalleVentaPorIdVenta);

router.post('/detalle-venta', [
    validarJWT,
    check('idventa', 'No es un ID válido').isMongoId(),
    check('idventa').custom(ventasHelper.existeVentaID),
    check('idproducto', 'No es un ID válido').isMongoId(),
    check('idproducto').custom(productoHelper.existeProductoID),
    check('cantidad', 'Este campo es obligatorio').notEmpty(),
    check('cantidad', 'La cantidad no es valida').isNumeric(),
    check('descuento', 'El descuento no es valido').isNumeric(),
    validarCampos
], httpDetalle.insertarDetalleVenta);

router.put('/detalleventa/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(detalleVentasHelper.existeDetalleVentaID),
    check('cantidad', 'Este campo es obligatorio').notEmpty(),
    check('cantidad', 'La cantidad no es valida').isNumeric(),
    check('descuento', 'El descuento no es valido').isNumeric(),
    check('descuento', 'Este campo es obligatorio').notEmpty(),
    validarCampos
], httpDetalle.modificarDetalleVenta);

module.exports = router;