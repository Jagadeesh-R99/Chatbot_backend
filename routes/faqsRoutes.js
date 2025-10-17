// routes/faqsRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const FAQ_DIR = path.join(__dirname, "../config/faqs");

// Correct categories array
const categories = [
  "cancellation",
  "coupons",
  "feedback",
  "general_enquiry",
  "giftcard",
  "okalspecials",
  "okalsupersaver",
  "orders_and_products",
  "payment",
  "return_and_replacement", // fixed
  "wallet"
];

// Helper: normalize slug
function normalizeSlug(slug) {
  return String(slug || "").toLowerCase().replace(/[\s-]+/g, "_");
}

// Helper: find FAQ file (case-insensitive, flexible)
function findFaqFile(category) {
  if (!fs.existsSync(FAQ_DIR)) return null;
  const files = fs.readdirSync(FAQ_DIR);
  const normalizeName = name => name.toLowerCase().replace(/[\s_-]/g, "");

  const matchedFile = files.find(f => normalizeName(f) === normalizeName(`${category}.json`));
  return matchedFile ? path.join(FAQ_DIR, matchedFile) : null;
}

// GET all categories
router.get("/", (req, res) => {
  res.json({ categories });
});

// GET FAQs by category
router.get("/:category", (req, res) => {
  const category = normalizeSlug(req.params.category);

  if (!categories.includes(category)) {
    return res.status(400).json({ message: "Invalid FAQ category.", category });
  }

  const filePath = findFaqFile(category);
  if (!filePath) {
    return res.status(404).json({ message: "FAQ file not found.", category });
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Error reading FAQ file.", error: err.message });
  }
});

module.exports = router;
