const express = require('express');
const router = express.Router();
const { httpProducto } = require('../controllers/productos.js');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validarCampos.js');
const { productoHelper } = require('../helpers/productos.js');
const { usuarioHelper } = require('../helpers/usuarios');
const { validarJWT } = require('../middleware/validarJWT.js');

// Rutas para operaciones CRUD de productos
router.get('/productos', [
    validarJWT
], httpProducto.listarProductos);

router.get('/productos/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productoHelper.existeProductoID),
    validarCampos
], httpProducto.obtenerProductoPorId);

router.get('/activos', [
    validarJWT
], httpProducto.listarProductosActivos);

router.get('/inactivos', [
    validarJWT
], httpProducto.listarProductosInctivos);

router.get('/bajoStockMinimo', [
    validarJWT
], httpProducto.listarProductosBajoStock);

router.get('/PrecioMayorA/:precio', [
    validarJWT,
    check('precio', 'Este campo no es valido').isNumeric(),
    validarCampos
], httpProducto.listarProductosPorPrecio);

router.post('/productos', [
    validarJWT,
    check('usuarioid', 'No es un ID válido').isMongoId(),
    check('usuarioid').custom(usuarioHelper.existeUsuarioID),
    check('nombre', 'Este campo es obligatorio').notEmpty(),
    check('nombre', 'Este producto ya existe').custom(productoHelper.verificarNombreProducto),
    check('precio', 'Este campo es obligatorio').notEmpty(),
    check('precio', 'Este campo no es valido').isNumeric(),
    check('cantidad', 'Este campo es obligatorio').notEmpty(),
    check('cantidad', 'Este campo es obligatorio').isNumeric(),
    check('stockminimo', 'Este campo es obligatorio').notEmpty(),
    check('stockminimo', 'No es un stock válido').isNumeric(),
    validarCampos
], httpProducto.insertarProducto);

router.put('/productos/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productoHelper.existeProductoID),
    check('nombre', 'Este campo es obligatorio').notEmpty(),
    check('nombre', 'Este producto ya existe').custom(productoHelper.verificarNombreProducto),
    check('precio', 'Este campo es obligatorio').notEmpty(),
    check('precio', 'Este campo no es valido').isNumeric(),
    check('cantidad', 'Este campo es obligatorio').notEmpty(),
    check('cantidad', 'Este campo es obligatorio').isNumeric(),
    check('stockminimo', 'Este campo es obligatorio').notEmpty(),
    check('stockminimo', 'No es un stock válido').isNumeric(),
    validarCampos
], httpProducto.modificarProducto);

router.put('/activar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productoHelper.existeProductoID),
    validarCampos
], httpProducto.activarProducto);

router.put('/desactivar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(productoHelper.existeProductoID),
    validarCampos
], httpProducto.desactivarProducto);

module.exports = router;