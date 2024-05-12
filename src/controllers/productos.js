const Producto = require('../models/productos.js')
const httpProducto = {
    // Listar todos los productos
    listarProductos: async (req, res) => {
        try {
            const productos = await Producto.find();
            res.json(productos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Listar producto por ID
    obtenerProductoPorId: async (req, res) => {
        const { id } = req.params;
        try {
            const producto = await Producto.findById(id);
            if (producto) {
                res.json(producto);
            } else {
                res.status(404).json({ msg: "Producto no encontrado" });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Listar productos por debajo del stock mínimo
    listarProductosBajoStock: async (req, res) => {
        try {
            const productosBajoStock = await Producto.find({ $expr: { $lt: ["$cantidad", "$stockminimo"] } });
            res.json(productosBajoStock);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    // Listar productos por encima del precio especificado
    listarProductosPorPrecio: async (req, res) => {
        const { precio } = req.params;
        try {
            const productosPorPrecio = await Producto.find({ precio: { $gt: precio } });
            res.json(productosPorPrecio);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET: Listar productos Activos
    listarProductosActivos: async (req, res) => {
        try {
            const produtosActivos = await Producto.find({ estado: 1 });
            res.json({ produtosActivos });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // GET: Listar Productos inactivos
    listarProductosInctivos: async (req, res) => {
        try {
            const produtosInactivos = await Producto.find({ estado: 0 });
            res.json({ produtosInactivos });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Insertar nuevo producto
    insertarProducto: async (req, res) => {
        const { nombre, precio, cantidad, stockminimo, estado } = req.body;
        try {
            const producto = new Producto({ nombre, precio, cantidad, stockminimo, estado });
            await producto.save();
            res.json(producto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Modificar producto
    modificarProducto: async (req, res) => {
        const { id } = req.params;
        const { nombre, precio, cantidad, stockminimo, estado } = req.body;
        try {
            const producto = await Producto.findByIdAndUpdate(id, { nombre, precio, cantidad, stockminimo, estado }, { new: true });
            res.json(producto);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Activar producto
    activarProducto: async (req, res) => {
        const { id } = req.params;
        try {
            const producto = await Producto.findByIdAndUpdate(id, { estado: 1 }, { new: true });
            res.json({ msg: "Producto activado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Desactivar producto
    desactivarProducto: async (req, res) => {
        const { id } = req.params;
        try {
            const producto = await Producto.findByIdAndUpdate(id, { estado: 0 }, { new: true });
            res.json({ msg: "Producto desactivado correctamente" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = { httpProducto };