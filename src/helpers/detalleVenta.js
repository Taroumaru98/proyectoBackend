const detalleVentas = require('../models/detalle_ventas');

const detalleVentasHelper = {
    existeDetalleVentaID: async (id, req) => {
        const existe = await detalleVentas.findById(id)
        if (!existe) {
            throw new Error(`Registro no existe ${id}`)
        }

        req.req.detalleVentasbd = existe

    }
}

module.exports = { detalleVentasHelper }