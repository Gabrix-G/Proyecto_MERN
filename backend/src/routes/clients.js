import express from "express";
import clientsControllers from "../controllers/ClientsController.js"
 
const router = express.Router();
 
router.route("/")
.get(clientsControllers.getClients)
.post(clientsControllers.insertClients)
 
router.route("/:id")
.put(clientsControllers.updateClients)
.delete(clientsControllers.deleteClients);
 
export default router;