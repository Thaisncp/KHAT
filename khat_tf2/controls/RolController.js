'use strict';
var models = require('../models/');
var rol = models.rol;

class RolController {

    async guardar(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    msg: "Faltan datos",
                    code: 400,
                    errors: errors.array()
                });
            }

            const data = {
                tipo: req.body.tipo
            };

            data.externalId = uuid.v4();

            const transaction = await models.sequelize.transaction();

            await rol.create(data, { transaction });

            await transaction.commit();

            return res.status(200).json({
                msg: "Se ha registrado el rol",
                code: 200
            });

        } catch (error) {
            if (error.errors && error.errors[0].message) {
                return res.status(400).json({
                    msg: error.errors[0].message,
                    code: 400
                });
            } else {
                return res.status(400).json({
                    msg: "Ha ocurrido un error en el servidor",
                    code: 400
                });
            }
        }
    }

    async listar(req, res) {
        var lista = await rol.findAll({
            attributes: [
                'tipo',
                'external_id',
                'estado'
            ]
        });
        return res.status(200).json({
            msg: 'OK!',
            code: 200,
            info: lista
        });
    }
}
module.exports = RolController;