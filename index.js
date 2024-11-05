require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Offer = require("./models/Offer");

app.get("/", (req, res) => {
  try {
    return res.status(200).json("Bienvenue sur notre serveur Vinted !");
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

const userRoutes = require("./routes/user");
app.use(userRoutes);

const offerRoutes = require("./routes/offer");
app.use(offerRoutes);

app.get("/offers", async (req, res) => {
  try {
    // aller récupérer les offres dans la BDD
    // la méthode find prend comme paramètre(facultatif) un OBJET :
    // recherche par product_name :
    // const offers = await Offer.find({
    //   product_name: new RegExp("rob", "i"),
    // }).select("product_name product_price -_id");

    // recherche par prix :
    // pour rechercher un prix max, on va rechercher toutes les offres dont le prix est inférieur ou égal à 67
    // en anglais : lower than or equal
    // pour l'inverse = greater than or equal
    // const offers = await Offer.find({
    //   product_price: { $gt: 67, $lt: 200 },
    // }).select("product_name product_price -_id");

    // trier les offres : avec la methode .sort )à mettre à la suite du find
    // pour croissant : "asc" OU 1
    // pour décroissant : "desc" OU -1
    // const offers = await Offer.find()
    //   .sort({ product_price: -1 })
    //   .select("product_name product_price -_id");

    // pagination :
    // etape 1 : limiter le nombre de résultats ! Pour çà, on va utiliser .limit()
    // etape 2 : sauter un certain nombre de résultats pour obtenir les suivants ! Pour çà, on va utiliser .skip()

    // trouver la formule pour faire une pagination : c'est à dire trouver combien de résultats à skip selon le numéro de page !
    const limit = 5;
    // La formule est la suivante :
    // const skip = page - 1 * limit;
    // page 1 => skip 0 => 0 x limit
    // page 2 => skip 5 => 1 x limit
    // page 3 => skip 10 => 2 x limit
    // page 4 => skip 15 => 3 x limit

    const filters = {};
    filters.product_name = req.query.title;

    const offers = await Offer.find(filters)
      .sort({ product_price: 1 })
      .select("product_name product_price -_id")
      .limit(5);
    // .skip(page - 1 * limit);

    return res.status(200).json(offers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});

app.listen(process.env.PORT, () => {
  console.log("Server started 🏃‍♂️🏃‍♂️🏃‍♂️");
});
