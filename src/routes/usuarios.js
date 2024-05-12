const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { httpUsuarios } = require('../controllers/usuarios.js');
const { validarCampos } = require('../middleware/validarCampos.js');
const { usuarioHelper } = require('../helpers/usuarios');
const { validarJWT } = require('../middleware/validarJWT.js');


router.get('/usuarios', [
    validarJWT
], httpUsuarios.listarUsuarios);

router.get('/usuarios/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(usuarioHelper.existeUsuarioID),
    validarCampos
], httpUsuarios.obtenerUsuarioPorId);

router.get('/activos', [
    validarJWT
], httpUsuarios.listarUsuariosActivos);

router.get('/inactivos', [
    validarJWT
], httpUsuarios.listarUsuariosInactivos);

router.post('/usuarios', [
    check('email', 'El documento es obligatorio!').not().isEmpty(),
    check('email').custom(usuarioHelper.existeEmail),
    check('password', 'Password no es válido').isLength({ min: 8, max: 15 }),
    validarCampos
], httpUsuarios.insertarUsuario);

router.post('/usuarios/login', [
    check("email", "El email es obligatorio").not().isEmpty(),
    check('email', "El email no es valido").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos
], httpUsuarios.login);

router.put('/pass/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(usuarioHelper.existeUsuarioID),
    check('newPassword', 'Password no es válido').isLength({ min: 8, max: 15 }),
    validarCampos
], httpUsuarios.cambiarContraseña);

router.put('/mail/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(usuarioHelper.existeUsuarioID),
    check("email", "El email es obligatorio").notEmpty(),
    check('email', "El email no es valido").isEmail(),
    validarCampos
], httpUsuarios.modificarUsuario);

router.put('/activar/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(usuarioHelper.existeUsuarioID),
    validarCampos
], httpUsuarios.activarUsuario);

router.put('/desactivar/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(usuarioHelper.existeUsuarioID),
    validarCampos
], httpUsuarios.desactivarUsuario);

module.exports = router;

