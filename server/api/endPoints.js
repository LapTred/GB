const express = require('express');
const router = express.Router();

//Iniciar sesión
const { login } = require('../controllers/loginController');

const Consultorio = require('../controllers/consultorioController');
const Usuario = require('../controllers/usuarioController');


const { rhistorial } = require('../controllers/rhistorialController');
const { preguntas } = require('../controllers/preguntasController');
const { ppreguntas} = require('../controllers/ppreguntasController');    
const { ipreguntas} = require('../controllers/ipreguntasController');   
const { vigencias } = require('../controllers/vigenciasController');    
const { inconformidades } = require('../controllers/inconformidadesController');    
const Asignacion = require('../controllers/asignacionController');
const Departamento = require('../controllers/departamentosController');

const Usuarios = require('../controllers/usuariosController');

const Formulario = require('../controllers/formularioController'); 

router.post('/login', login);

/////////////////////////////////////Consultorios/////////////////////////////////////
router.get('/consultorios', Consultorio.getAll)
// Ruta para actualizar un consultorio por su id
router.put('/consultorio/:idConsultorio', Consultorio.updateById);
router.delete('/consultorio/delete/:id', Consultorio.delete);
// Ruta para verificar si un nombre de consultorio ya existe
router.get('/consultorio/check-roomname/:nombreConsultorio/:idConsultorio', Consultorio.checkRoomname);
router.post('/consultorio/create', Consultorio.create);

//////////////////////////////////////Usuarios////////////////////////////////////////
// Ruta para obtener todos los usuarios
router.get('/usuarios', Usuario.getAll);
// Ruta para actualizar un usuario por su id
router.put('/usuario/:idUsuario', Usuario.updateById);
// Ruta para cambiar el acceso de un usuario a 'INACTIVO' por su id
router.put('/usuario/delete/:id', Usuario.delete);
// Ruta para verificar si un nombre de usuario ya existe
router.get('/usuario/check-username/:nombreUsuario', Usuario.checkUsername);
router.post('/usuario/create', Usuario.create);






router.get('/rhistorial', rhistorial);  
router.get('/preguntas', preguntas);
router.get('/ppreguntas', ppreguntas);
router.get('/ipreguntas', ipreguntas);  
router.get('/vigencias', vigencias);  
router.get('/inconformidades', inconformidades);



router.get('/asignacionesgetAll', Asignacion.getAll);
router.post('/asignacionesCreate', Asignacion.create);
router.get('/asignacion/:id', Asignacion.findById);
router.delete('/asignacion/delete/:id', Asignacion.delete);
router.put('/asignacion/update/:id', Asignacion.updateById);
router.get('/departamentos', Departamento.getAll);
router.get(`/asignacionesAllAuditor/:nombre`, Asignacion.getAllnom);
router.get('/asignacionesgetAllpast', Asignacion.getAllpast);



router.get('/formulario/preguntas', Formulario.Preguntas);
router.get('/formulario/:id/respuestas', Formulario.VerRespuestas);

router.post('/formulario/:id/respuestasUpdate', Formulario.Respuestas);

module.exports = router;