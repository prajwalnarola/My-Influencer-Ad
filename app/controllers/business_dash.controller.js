require("dotenv").config();
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWTFunctions = require("../Helpers/JWTFunctions");
const Sequelize = require("sequelize");


const db = require("../config/db.config"); // models path
const { user, jobs, advertising_platform, industry, candidates, available_platforms, available_industries } = db;

const userControl = require("./user.controller");
const uploadFile = require("../utils/uploadFile");
const functions = require("../utils/helperFunctions");
const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const constants = require("../utils/constants");

exports.getPlatforms = async (req, res) => {
  try {
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
      where: { id: decoded?.id, profession_type: 'Business', is_delete: 0 },
    })

    if (data?.length > 0) {

      const platformData = await available_platforms.findAll({
        attributes: { exclude: ["created_at", "updated_at", "is_testdata", "is_delete"] }
      });
      res.status(responseCode.OK).send(responseObj.successObject(null, platformData));

    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"));
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
  }
}

exports.getIndustries = async (req, res) => {
  try {
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
      where: { id: decoded?.id, profession_type: 'Business', is_delete: 0 },
    })

    if (data?.length > 0) {

      const industryData = await available_industries.findAll({
        attributes: { exclude: ["created_at", "updated_at", "is_testdata", "is_delete"] }
      });
      res.status(responseCode.OK).send(responseObj.successObject(null, industryData));

    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"));
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err))
  }
}


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
      where: { id: decoded?.id, profession_type: 'Business', is_delete: 0 },
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
        headline: req.body?.headline,
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
              advertising_platform: req.body?.platform_id,
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
                platform_id: platform,
              }
              console.log(newPlatformEntry);
              await advertising_platform.create(newPlatformEntry);
            });

            const industryData = {
              industry: req.body?.industry_id,
            }

            const industriesArray = industryData.industry.split(',').map(industry => industry.trim());
            console.log(industriesArray);

            industriesArray.forEach(async industryData => {
              const newIndustryEntry = {
                job_id: result.id,
                industry_id: industryData,
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


exports.getAllDetails = async (req, res) => {
  try {
    // if (!req.body) {
    //   res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content cannot be empty!"))
    //   return;
    // }

    // console.log(req.decoded);
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
      where: { id: decoded?.id, profession_type: 'Business', is_delete: 0 },
      // attributes: ['id', 'name', 'email', 'profession_type']
    })
    if (data?.length > 0) {

      const totalPostData = await jobs.count({
        where: { user_id: data[0].id, is_delete: 0 }
      });

      const totalActiveJobsData = await jobs.count({
        where: { job_status: 1, is_delete: 0 }
      });

      const totalInfluencerData = await user.count({
        where: { profession_type: 'Influencer', is_delete: 0 }
      });

      const responseData = {
        totalPosts: totalPostData,
        totalActiveJobs: totalActiveJobsData,
        totalInfluencers: totalInfluencerData,
      };

      res.status(responseCode.OK).send(responseObj.successObject(null, responseData));

    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"));
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
  }
}

exports.getJobs = async (req, res) => {
  try {
    // if (!req.body) {
    //   res.status(responseCode.BADREQUEST).send(responseObj.failObject("Content cannot be empty!"))
    //   return;
    // }

    // console.log(req.decoded);
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
      where: { id: decoded?.id, profession_type: 'Business', is_delete: 0 },
    })

    if (data?.length > 0) {

      const totalActiveJobsData = await jobs.findAll({
        where: { job_status: 1, is_delete: 0 },
        order: [
          ['id', 'DESC'],
        ],
        attributes: {
          exclude: ["updated_at", "is_testdata", "is_delete"]
        },
        include: [
          {
            model: user,
            as: "user",
            where: { profession_type: 'Business', is_delete: 0 },
            attributes: ['name'],
            required: false,
          },
          {
            model: candidates,
            as: "candidates",
            where: { is_delete: 0 },
            attributes: {
              exclude: ["created_at", "updated_at", "is_testdata", "is_delete"]
            },
            required: false,
            include: [
              {
                model: user,
                as: "user",
                where: { profession_type: 'Influencer', is_delete: 0 },
                attributes: {
                  exclude: ["updated_at", "is_testdata", "is_delete"]
                },
                required: false,
              },
            ]
          }
        ],
        group: ['jobs.id', 'candidates.id']
      });

      const responseData = await Promise.all(totalActiveJobsData.map(async (data) => {

        const platformData = await advertising_platform.findAll({
          where: { job_id: data.id, is_delete: 0 },
          attributes: ["id"],
          include: [
            {
              model: available_platforms,
              as: "available_platforms",
              where: { is_delete: 0 },
              attributes: ['id','platform'],
              required: false,
            },
          ],
          group: ['advertising_platform.id']
        });

        const industryData = await industry.findAll({
          where: { job_id: data.id, is_delete: 0 },
          attributes: ["id"],
          include: [
            {
              model: available_industries,
              as: "available_industries",
              where: { is_delete: 0 },
              attributes: ['id','industry'],
              required: false,
            },
          ],
          group: ['industry.id']
        });

        return {
          id: data.id,
          user_id: data.user_id,
          image: data.image,
          headline: data.headline,
          description: data.description,
          website: data.website,
          platform_data: platformData,
          industry_data: industryData,
          minimum_followers: data.minimum_followers,
          due_date: data.due_date,
          open_to_applicants: data.open_to_applicants,
          age_range: data.age_range,
          role: data.role,
          budget: data.budget,
          job_status: data.job_status,
          created_date: data.created_at,
          created_by: data.user,
          candidates: data.candidates,
        };

      }));

      res.status(responseCode.OK).send(responseObj.successObject("Success", responseData));

    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"));
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
  }
}
