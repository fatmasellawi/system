import WorkPermit from "../models/workPermitModel.js";

export const createWorkPermit = async (req, res) => {
  try {
    const permit = new WorkPermit(req.body);
    await permit.save();
    res.status(201).json(permit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllWorkPermits = async (req, res) => {
  try {
    const permits = await WorkPermit.find();
    res.json(permits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWorkPermitById = async (req, res) => {
  try {
    const permit = await WorkPermit.findById(req.params.id);
    if (!permit) return res.status(404).json({ message: "Not found" });
    res.json(permit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateWorkPermit = async (req, res) => {
  try {
    const updated = await WorkPermit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteWorkPermit = async (req, res) => {
  try {
    const deleted = await WorkPermit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
