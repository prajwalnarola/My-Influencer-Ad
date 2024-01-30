require("dotenv").config();
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWTFunctions = require("../Helpers/JWTFunctions");

const db = require("../config/db.config"); // models path
const { user, jobs, advertising_platform, industry } = db;

const userControl = require("./user.controller");
const uploadFile = require("../utils/uploadFile");
const functions = require("../utils/helperFunctions");
const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const constants = require("../utils/constants");

exports.createPost = async (req, res) => {
  try {
    if (!req?.body) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content is required"))
      return;
    }

    if (!req.decoded) {
      res.status(responseCode.UNAUTHORIZEDREQUEST).send(responseObj.failObject("You are unauthorized to access this api! Please check the authorization token."));
      return;
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject(errors?.errors[0]?.msg));
      return;
    }

    const decoded = req?.decoded;

    const data = await user.findAll({
      where: { id: decoded?.id, is_delete: 0 },
    })

    if (data?.length > 0) {

      let img = "";
      if (req.files['media']) {
        img = await uploadFile(req, res);
        console.log("Image: ", img);
        if (img.length == 0) {
          throw { text: "Something went wrong uploading the image" };
        } else {
          img = img[0]?.name;
        }
      }
      const postData = {
        user_id: decoded?.id,
        image: img,
        description: req.body?.description,
        website: req.body?.website,
        minimum_followers: req.body?.minimum_followers,
        due_date: req.body?.due_date,
        open_to_applicants: req.body?.open_to_applicants,
        age_range: req.body?.age_range,
        role: req.body?.role,
        budget: req.body?.budget,
        job_status: req.body?.job_status
      };

      await jobs.create(postData)
        .then(async (result) => {
          if (!result.isEmpty) {

            const platformData = {
              advertising_platform: req.body?.advertising_platform,
            };

            const platformsArray = platformData.advertising_platform.split(',').map(platform => platform.trim());
            console.log(platformsArray);

            // platformsArray.map(async platform => {
            //   const newPlatformEntry = {
            //     job_id: result.id,
            //     advertising_platform: platform,
            //   };
            //   console.log(newPlatformEntry);
            //   await advertising_platform.create(newPlatformEntry);
            // });

            platformsArray.forEach(async platform => {
              const newPlatformEntry = {
                job_id: result.id,
                advertising_platform: platform,
              }
              console.log(newPlatformEntry);
              await advertising_platform.create(newPlatformEntry);
            });

            const industryData = {
              industry: req.body?.industry,
            }

            const industriesArray = industryData.industry.split(',').map(industry => industry.trim());
            console.log(industriesArray);

            industriesArray.forEach(async industryData => {
              const newIndustryEntry = {
                job_id: result.id,
                industry: industryData,
              }
              console.log(newIndustryEntry);
              await industry.create(newIndustryEntry);
            });

            res.status(responseCode.OK).send(responseObj.successObject("Data has been inserted!"));

          }

        })
        .catch((err) => {
          res.status(400).send({ message: "Somthing went wrong while inserting data!" });
        });

    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"))
    }



  } catch (err) {
    if (err?.message) {
      if (Object.keys(err).length == 1) {
        res
          .status(responseCode.BADREQUEST)
          .send(responseObj.failObject(err?.message ?? null));
      } else {
        res
          .status(err?.status ?? responseCode.BADREQUEST)
          .send(
            responseObj.failObject(
              err?.message ?? null,
              err?.status ? null : err
            )
          );
      }
    } else {
      console.log("Error: ", err);
      res
        .status(responseCode.BADREQUEST)
        .send(responseObj.failObject(null, err));
    }
  }
};
