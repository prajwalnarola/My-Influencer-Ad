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
    });

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
                  exclude: ["password", "uuid", "updated_at", "is_testdata", "is_delete"]
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
              attributes: ['id', 'platform'],
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
              attributes: ['id', 'indutry'],
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

exports.getMyJobs = async (req, res) => {
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
    });

    if (data?.length > 0) {

      const totalActiveJobsData = await jobs.findAll({
        where: { user_id: data[0].id, job_status: 1, is_delete: 0 },
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
                  exclude: ["password", "uuid", "updated_at", "is_testdata", "is_delete"]
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
              attributes: ['id', 'platform'],
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
              attributes: ['id', 'indutry'],
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

exports.updatePost = async (req, res) => {
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

      const jobData = await jobs.findAll({
        where: { id: req.body?.job_id, user_id: decoded?.id, is_delete: 0 },
      })

      if (jobData?.length > 0) {

        // const job_id: jobData[0].id;
        const job_id = req.body?.job_id
        const previous_platform_id = req.body?.previous_platform_id
        const new_platform_id = req.body?.new_platform_id

        let updated_post = {};
        let img;
        if (req.files && req.files['media']) {
          img = (await uploadFile(req, res))[0]?.name
        }

        if (img) {
          updated_post["image"] = img;
        }

        if (req.body?.headline) {
          updated_post['headline'] = req.body?.headline
        }

        if (req.body?.description) {
          updated_post['description'] = req.body?.description
        }

        if (req.body?.website) {
          updated_post['website'] = req.body?.website
        }

        if (req.body?.minimum_followers) {
          updated_post['minimum_followers'] = req.body?.minimum_followers
        }

        if (req.body?.due_date) {
          updated_post['due_date'] = req.body?.due_date
        }

        if (req.body?.open_to_applicants) {
          updated_post['open_to_applicants'] = req.body?.open_to_applicants
        }

        if (req.body?.age_range) {
          updated_post['age_range'] = req.body?.age_range
        }

        if (req.body?.role) {
          updated_post['role'] = req.body?.role
        }

        if (req.body?.budget) {
          updated_post['budget'] = req.body?.budget
        }

        if (updated_post) {
          const data = await jobs.update(updated_post, { where: { id: job_id, user_id: decoded?.id, is_delete: 0 } });

          if (data) {

            if (req.body && previous_platform_id) {

              const verifyPlatformData = await advertising_platform.findAll({
                where: { platform_id: req.body?.previous_platform_id, job_id: job_id, is_delete: 0 },
              });

              if (verifyPlatformData.length > 0) {

                const platformsArray = previous_platform_id.split(',').map(platform => platform.trim());
                console.log(platformsArray);
                platformsArray.forEach(async platform => {
                  await advertising_platform.update({ is_delete: 1 }, { where: { platform_id: platform, job_id: job_id, is_delete: 0 } });
                });

                if (req.body && new_platform_id) {

                  const platformsArray = new_platform_id.split(',').map(platform => platform.trim());
                  console.log(platformsArray);
  
                  platformsArray.forEach(async platform => {
                    const newPlatformEntry = {
                      job_id: job_id,
                      platform_id: platform,
                    }
                    console.log(newPlatformEntry);
                    await advertising_platform.create(newPlatformEntry);
                  });
                }

                res.status(responseCode.OK).send(responseObj.successObject("data updated successfuly!"));  

              } else {
                res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong updating the user profile!"));
              }

            } else {

              if (req.body && new_platform_id) {

                const platformsArray = new_platform_id.split(',').map(platform => platform.trim());
                console.log(platformsArray);

                platformsArray.forEach(async platform => {
                  const newPlatformEntry = {
                    job_id: job_id,
                    platform_id: platform,
                  }
                  console.log(newPlatformEntry);
                  await advertising_platform.create(newPlatformEntry);
                  res.status(responseCode.OK).send(responseObj.successObject("data updated successfuly!"));
                });

              }
            }
          } else {
            res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"));
          }


        } else {
          res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"));
        }
      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong! No data to update."));
      }

    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"));
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
