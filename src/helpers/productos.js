const Producto = require('../models/productos.js');

const productoHelper = {
    existeProductoID: async (id, req) => {
        const existe = await Producto.findById(id)
        if (!existe) {
            throw new Error(`Registro no existe ${id}`)
        }

        req.req.productobd = existe

    },
    verificarNombreProducto: async (nombre, req) => {

        const existe = await Producto.findOne({ nombre });

        if (existe == nombre) {
            throw new Error(`El producto ${nombre}, ya existe`)
        }

        req.req.productobd = existe;

    }
}

module.exports = { productoHelper }