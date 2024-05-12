const Venta = require('../models/ventas.js');
const Cliente = require('../models/clientes.js');
const Producto = require('../models/productos.js');

const httpVenta = {
    // Listar todas las ventas
    listarTodo: async (req, res) => {
        try {
            const ventas = await Venta.find();
            res.json(ventas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener una venta por su ID
    obtenerPorId: async (req, res) => {
        try {
            const venta = await Venta.findById(req.params.id);
            if (venta) {
                res.json(venta);
            } else {
                res.status(404).json({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Listar ventas activas
    listarActivas: async (req, res) => {
        try {
            const ventasActivas = await Venta.find({ activo: true });
            res.json(ventasActivas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Listar ventas inactivas
    listarInactivas: async (req, res) => {
        try {
            const ventasInactivas = await Venta.find({ activo: false });
            res.json(ventasInactivas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Listar ventas de un cliente específico
    listarPorCliente: async (req, res) => {
        try {
            const ventasCliente = await Venta.find({ idcliente: req.params.id });
            res.json(ventasCliente);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Listar todas las ventas entre dos fechas
    listarPorRangoDeFechas: async (req, res) => {
        try {
            const { inicio, fin } = req.params;
            const ventasEnRango = await Venta.find({ fecha: { $gte: inicio, $lte: fin } });
            res.json(ventasEnRango);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Listar ventas con un valor superior a cierto valor
    listarPorValorSuperior: async (req, res) => {
        try {
            const ventasValorSuperior = await Venta.find({ valor: { $gt: req.params.valor } });
            res.json(ventasValorSuperior);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Calcular el total de ventas entre dos fechas
    calcularTotalPorRangoDeFechas: async (req, res) => {
        try {
            const { inicio, fin } = req.params;
            const totalVentas = await Venta.aggregate([
                {
                    $match: {
                        fecha: { $gte: new Date(inicio), $lte: new Date(fin) }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$valor" }
                    }
                }
            ]);
            res.json(totalVentas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Calcular el total de descuento aplicado en todas las ventas
    calcularTotalDescuento: async (req, res) => {
        try {
            const totalDescuento = await Venta.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$descuento" }
                    }
                }
            ]);
            res.json(totalDescuento);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Insertar una nueva venta
    crear: async (req, res) => {
        const { idproducto, idcliente, fecha, descuento } = req.body;

        try {
            const productoVendido = await Producto.findById(idproducto);
            if (!productoVendido) {
                return res.status(404).json({ message: 'El producto no existe' });
            }

            const valor = productoVendido.precio;

            const cliente = await Cliente.findById(idcliente);
            if (!cliente) {
                return res.status(404).json({ message: 'El cliente no existe' });
            }

            const total = descuento ? valor - (valor * (descuento / 100)) : valor;

            const nuevaVenta = new Venta({
                idproducto,
                idcliente,
                fecha,
                valor,
                total,
                descuento: descuento || 0
            });

            await nuevaVenta.save();

            res.status(201).json(nuevaVenta);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Actualizar una venta por su ID
    actualizar: async (req, res) => {
        try {
            const venta = await Venta.findById(req.params.id);
            if (!venta) {
                return res.status(404).json({ message: 'Venta no encontrada' });
            }

            // Actualizar solo los campos que se han proporcionado en el cuerpo de la solicitud
            if (req.body.idproducto) {
                const productoVendido = await Producto.findById(req.body.idproducto);
                if (!productoVendido) {
                    return res.status(404).json({ message: 'El producto no existe' });
                }
                venta.idproducto = req.body.idproducto;
                venta.valor = productoVendido.precio;
            }

            if (req.body.idcliente) {
                const cliente = await Cliente.findById(req.body.idcliente);
                if (!cliente) {
                    return res.status(404).json({ message: 'El cliente no existe' });
                }
                venta.idcliente = req.body.idcliente;
            }

            if (req.body.fecha) {
                venta.fecha = req.body.fecha;
            }

            if (req.body.descuento) {
                const valor = venta.valor;
                const total = req.body.descuento ? valor - (valor * (req.body.descuento / 100)) : valor;
                venta.descuento = req.body.descuento;
                venta.total = total;
            }

            await venta.save();

            res.json(venta);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Activar una venta por su ID
    activar: async (req, res) => {
        try {
            const venta = await Venta.findByIdAndUpdate(req.params.id, { activo: true }, { new: true });
            if (venta) {
                res.json({ msg: "Venta activado correctamente" });
            } else {
                res.status(404).json({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Desactivar una venta por su ID
    desactivar: async (req, res) => {
        try {
            const venta = await Venta.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
            if (venta) {
                res.json({ msg: "Venta desactivado correctamente" });
            } else {
                res.status(404).json({ message: 'Venta no encontrada' });
            }
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = { httpVenta }
