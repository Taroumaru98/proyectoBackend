const mongoose = require('mongoose');

const detalle_ventasSchema = new mongoose.Schema({
    idventa: { type: mongoose.Schema.Types.ObjectId, ref: 'Venta', required: true },
    idproducto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: { type: Number, required: true },
    total: { type: Number, default: 0 },
    descuento: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("DetalleVenta", detalle_ventasSchema);



// // //detalles ventas
// // get//listar por un id venta
// // post//insertar
// // put//modificar