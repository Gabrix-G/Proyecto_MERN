import express from "express";
import branchesController from "../controllers/BranchesController.js";

const router = express.Router();

router.route("/")
    .get(branchesController.getBranches)
    .post(branchesController.insertBranch);

router.route("/:id")
    .put(branchesController.updateBranch)
    .delete(branchesController.deleteBranch);

export default router;