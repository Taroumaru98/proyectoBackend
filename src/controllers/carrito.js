const Carrito = require('../models/carrito.js');
const Cliente = require('../models/clientes.js');
const Producto = require('../models/productos.js')

const httpCarrito = {
    listarCarritoPorCliente: async (req, res) => {
        const clienteId = req.params.clienteId;
        try {
            const carrito = await Carrito.find({ cliente: clienteId }).populate('productos');
            res.json(carrito);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    insertarElementoAlCarrito: async (req, res) => {
        const { cliente, productos, cantidad } = req.body;

        try {
            const productosConPrecio = await Producto.find({ _id: { $in: productos } }, 'precio');

            const valor = productosConPrecio.reduce((total, producto) => {
                const precioProducto = producto.precio;
                return total + (precioProducto * cantidad);
            }, 0);

            const nuevoElemento = new Carrito({ cliente, productos, cantidad, valor });

            await nuevoElemento.save();

            res.status(201).json(nuevoElemento);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    eliminarElementoDelCarrito: async (req, res) => {
        const elementoId = req.params.elementoId;
        try {
            await Carrito.findByIdAndDelete(elementoId);
            res.json({ message: 'Elemento eliminado del carrito correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = { httpCarrito }