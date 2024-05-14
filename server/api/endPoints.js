const express = require('express');
const router = express.Router();

const { login } = require('../controllers/loginController');
const Consultorio = require('../controllers/consultorioController');
const Usuario = require('../controllers/usuarioController');
const Clinica = require('../controllers/clinicaController');
const Cita = require('../controllers/citaController.js');
const Paciente = require('../controllers/pacienteController.js');

///////////////////////////Iniciar sesión////////////////////////////////////
router.post('/login', login);

///////////////////////////////Consultorios////////////////////////////
router.get('/consultorios', Consultorio.getAll)
router.put('/consultorio/:idConsultorio', Consultorio.updateById);
router.delete('/consultorio/delete/:id', Consultorio.delete);
router.get('/consultorio/check-roomname/:nombreConsultorio/:idConsultorio', Consultorio.checkRoomname);
router.post('/consultorio/create', Consultorio.create);
router.get('/clinica', Clinica.getAll);
router.put('/clinica/update', Clinica.update);
router.get('/servicios', Consultorio.service);
router.get('/consultorio-servicio/:id', Consultorio.serviceById)
router.get('/consultorio/servicio/:id', Consultorio.serviceByRoom)


///////////////////////////////Usuarios//////////////////////////////
router.get('/usuarios', Usuario.getAll);
router.put('/usuario/:idUsuario', Usuario.updateById);
router.put('/usuario/delete/:id', Usuario.delete);
router.get('/usuario/check-username/:nombreUsuario', Usuario.checkUsername);
router.post('/usuario/create', Usuario.create);

///////////////////////////Citas/////////////////////////////////////
router.get('/citas', Cita.getAll);
router.get('/citas/horario', Cita.disponibilidad);

///////////////////////Pacientes&Expedientes////////////////////////
router.get('/pacientes', Paciente.getAll);
router.get('/propietarios', Paciente.propietarios);
router.get('/paciente/:id', Paciente.pacientesById);

module.exports = router;