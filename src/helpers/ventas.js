const Ventas = require('../models/ventas.js');

const ventasHelper = {
    existeVentaID: async (id, req) => {
        const existe = await Ventas.findById(id)
        if (!existe) {
            throw new Error(`Registro no existe ${id}`)
        }

        req.req.Ventasbd = existe

    }
}

module.exports = { ventasHelper }