
const express = require("express");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Require authentication for every transaction route
router.use(authenticateToken);

// GET: Read only the logged-in user's transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user.id,
    }).sort({
      date: -1,
      createdAt: -1,
    });

    return res.json(transactions);
  } catch (error) {
    console.error("Failed to fetch transactions:", error);

    return res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
});

// POST: Create a transaction for the logged-in user
router.post("/", async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    const transaction = await Transaction.create({
      title,
      amount,
      type,
      category,
      date,
      user: req.user.id,
    });

    return res.status(201).json(transaction);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Failed to create transaction:", error);

    return res.status(500).json({
      message: "Failed to create transaction",
    });
  }
});

// PUT: Update only a transaction owned by the logged-in user
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    const { title, amount, type, category, date } = req.body;

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { title, amount, type, category, date },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.json(transaction);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Failed to update transaction:", error);

    return res.status(500).json({
      message: "Failed to update transaction",
    });
  }
});

// DELETE: Delete only a transaction owned by the logged-in user
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid transaction ID",
      });
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    return res.json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete transaction:", error);

    return res.status(500).json({
      message: "Failed to delete transaction",
    });
  }
});

module.exports = router;
