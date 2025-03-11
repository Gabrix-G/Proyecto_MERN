const Cliente = require('../models/Cliente');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');

const clientsController = {
  // Obtener todos los clientes
  getClients: async (req, res) => {
    try {
      const clientes = await Cliente.find()
        .select('-password'); // No devolver la contraseña
      
      res.json({
        ok: true,
        clientes
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al obtener los clientes, contacte al administrador'
      });
    }
  },

  // Obtener un cliente por ID
  getClientById: async (req, res) => {
    const { id } = req.params;
    
    try {
      const cliente = await Cliente.findById(id)
        .select('-password');
      
      if (!cliente) {
        return res.status(404).json({
          ok: false,
          msg: 'Cliente no encontrado'
        });
      }
      
      res.json({
        ok: true,
        cliente
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al obtener el cliente, contacte al administrador'
      });
    }
  },

  // Crear un nuevo cliente
  createClient: async (req, res) => {
    const { email, password, dui, ...resto } = req.body;
    
    try {
      // Verificar si el email ya existe
      const existeEmail = await Cliente.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: 'El correo ya está registrado'
        });
      }
      
      // Verificar si el DUI ya existe
      const existeDui = await Cliente.findOne({ dui });
      if (existeDui) {
        return res.status(400).json({
          ok: false,
          msg: 'El DUI ya está registrado'
        });
      }
      
      // Crear instancia del cliente
      const cliente = new Cliente({ email, password, dui, ...resto });
      
      // Encriptar la contraseña
      const salt = bcrypt.genSaltSync(10);
      cliente.password = bcrypt.hashSync(password, salt);
      
      // Guardar en BD
      await cliente.save();
      
      // Generar JWT
      const token = await generarJWT(cliente.id);
      
      res.status(201).json({
        ok: true,
        cliente: {
          id: cliente.id,
          name: cliente.name,
          lastName: cliente.lastName,
          email: cliente.email,
          isVerified: cliente.isVerified
        },
        token
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al crear el cliente, contacte al administrador'
      });
    }
  },

  // Actualizar un cliente
  updateClient: async (req, res) => {
    const { id } = req.params;
    const { password, email, dui, ...resto } = req.body;
    
    try {
      // Verificar si el cliente existe
      const clienteDB = await Cliente.findById(id);
      if (!clienteDB) {
        return res.status(404).json({
          ok: false,
          msg: 'Cliente no encontrado'
        });
      }
      
      // Si viene el email, verificar que no exista para otro usuario
      if (email && email !== clienteDB.email) {
        const existeEmail = await Cliente.findOne({ email });
        if (existeEmail) {
          return res.status(400).json({
            ok: false,
            msg: 'El correo ya está registrado'
          });
        }
        resto.email = email;
      }
      
      // Si viene el DUI, verificar que no exista para otro usuario
      if (dui && dui !== clienteDB.dui) {
        const existeDui = await Cliente.findOne({ dui });
        if (existeDui) {
          return res.status(400).json({
            ok: false,
            msg: 'El DUI ya está registrado'
          });
        }
        resto.dui = dui;
      }
      
      // Si viene el password, encriptarlo
      if (password) {
        const salt = bcrypt.genSaltSync(10);
        resto.password = bcrypt.hashSync(password, salt);
      }
      
      // Actualizar cliente
      const clienteActualizado = await Cliente.findByIdAndUpdate(id, resto, { new: true })
        .select('-password');
      
      res.json({
        ok: true,
        cliente: clienteActualizado
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al actualizar el cliente, contacte al administrador'
      });
    }
  },

  // Eliminar un cliente
  deleteClient: async (req, res) => {
    const { id } = req.params;
    
    try {
      // Verificar si el cliente existe
      const cliente = await Cliente.findById(id);
      if (!cliente) {
        return res.status(404).json({
          ok: false,
          msg: 'Cliente no encontrado'
        });
      }
      
      // Eliminar cliente (físicamente de la BD)
      await Cliente.findByIdAndDelete(id);
      
      res.json({
        ok: true,
        msg: 'Cliente eliminado correctamente'
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al eliminar el cliente, contacte al administrador'
      });
    }
  },

  // Verificar el cliente
  verifyClient: async (req, res) => {
    const { id } = req.params;
    
    try {
      const cliente = await Cliente.findById(id);
      
      if (!cliente) {
        return res.status(404).json({
          ok: false,
          msg: 'Cliente no encontrado'
        });
      }
      
      // Actualizar a verificado
      cliente.isVerified = true;
      await cliente.save();
      
      res.json({
        ok: true,
        msg: 'Cliente verificado correctamente'
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error al verificar el cliente, contacte al administrador'
      });
    }
  },

  // Login de cliente
  loginClient: async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Verificar si el email existe
      const cliente = await Cliente.findOne({ email });
      if (!cliente) {
        return res.status(400).json({
          ok: false,
          msg: 'Correo o contraseña incorrectos'
        });
      }
      
      // Verificar la contraseña
      const validPassword = bcrypt.compareSync(password, cliente.password);
      if (!validPassword) {
        return res.status(400).json({
          ok: false,
          msg: 'Correo o contraseña incorrectos'
        });
      }
      
      // Generar JWT
      const token = await generarJWT(cliente.id);
      
      res.json({
        ok: true,
        cliente: {
          id: cliente.id,
          name: cliente.name,
          lastName: cliente.lastName,
          email: cliente.email,
          isVerified: cliente.isVerified
        },
        token
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: 'Error en el login, contacte al administrador'
      });
    }
  }
};

module.exports = clientsController;