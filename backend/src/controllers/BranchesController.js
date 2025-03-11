const branchesController = {};
import branchesModel from "../models/Branches.js";
 
//SELECT
branchesController.getBranches = async (req, res) => {
    const branches = await branchesModel.find();
    res.json(branches);
}
 
//INSERT
branchesController.insertBranch = async (req, res) => {
    const {name, address, telephone, schedule} = req.body;
    const newBranch = new branchesModel({
        name, 
        address, 
        telephone, 
        schedule
    });
    await newBranch.save();
    res.json({message: "branch saved"});
}
 
//DELETE
branchesController.deleteBranch = async (req, res) => {
    await branchesModel.findByIdAndDelete(req.params.id);
    res.json({message: "branch deleted"});
}
 
//UPDATE
branchesController.updateBranch = async (req, res) => {
    const {name, address, telephone, schedule} = req.body;
    const updateBranch = await branchesModel.findByIdAndUpdate(
        req.params.id, 
        {name, address, telephone, schedule}, 
        {new: true}
    );
    res.json({message: "branch updated"});
}
 
export default branchesController;