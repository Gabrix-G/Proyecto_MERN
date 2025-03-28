// Importo todo lo de la libreria express
import express from "express";
import productsRoutes from "./src/routes/products.js";
import branchesRoutes from "./src/routes/branches.js";
import clientsRoutes from "./src/routes/clients.js";
import employeesRoutes from "./src/routes/employees.js";

// Creo una constante que es igual
// a la libreria que importé y la ejecuta
const app = express();

// Uso un middleware para que acepte datos Json
app.use(express.json());

// Definir las rutas
app.use("/api/products", productsRoutes);
app.use("/api/login", productsRoutes);
app.use("/api/branches", branchesRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/employees", employeesRoutes);

// Exporto la constante para poder usar express en otros lados
export default app;