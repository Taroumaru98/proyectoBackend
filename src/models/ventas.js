const mongoose = require('mongoose');

const ventasSchema = new mongoose.Schema({
    idproducto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    idcliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente' },
    fecha: { type: Date, required: true },
    valor: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    descuento: { type: Number, default: 0 },
    activo: { type: Boolean, required: true, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Venta", ventasSchema)
