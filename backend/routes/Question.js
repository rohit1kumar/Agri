const express = require("express");
const router = express.Router();
// const cloudinary = require('cloudinary').v2
require('dotenv').config()
const questionDB = require("../models/Question");

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET

// })



router.post("/", async (req, res) => {
  console.log(req.body);

  try {
    // const file = req.files.imageUrl
    // await cloudinary.uploader.upload(file.tempFilePath, (result) => {
    //   console.log(result)
    // })

    await questionDB
      .create({
        questionName: req.body.questionName,
        questionUrl: req.body.questionUrl,
        imageUrl: req.result.url,
        user: req.body.user,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Question added successfully",
        });
      })
      .catch((err) => {
        res.status(400).send({
          staus: false,
          message: "Bad format",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Error while adding question",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    await questionDB
      .aggregate([
        {
          $lookup: {
            from: "answers", //collection to join
            localField: "_id", //field from input document
            foreignField: "questionId",
            as: "allAnswers", //output array field
          },
        },
      ])
      .exec()
      .then((doc) => {
        res.status(200).send(doc);
      })
      .catch((error) => {
        res.status(500).send({
          status: false,
          message: "Unable to get the question details",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Unexpected error",
    });
  }
});

module.exports = router;
