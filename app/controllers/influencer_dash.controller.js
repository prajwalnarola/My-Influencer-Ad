require("dotenv").config();
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWTFunctions = require("../Helpers/JWTFunctions");

const db = require("../config/db.config"); // models path
const { user, jobs, advertising_platform, industry, candidates, available_platforms, available_industries } = db;

const userControl = require("./user.controller");
const uploadFile = require("../utils/uploadFile");
const functions = require("../utils/helperFunctions");
const responseCode = require("../utils/responseStatus");
const responseObj = require("../utils/responseObjects");
const constants = require("../utils/constants");

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
      where: { id: decoded?.id, profession_type: 'Influencer', is_delete: 0 },
      // attributes: ['id', 'name', 'email', 'profession_type']
    })
    if (data?.length > 0) {

      const totalBusinessData = await user.count({
        where: { profession_type: 'Business', is_delete: 0 }
      });

      const totalAppliedJobsData = await candidates.count({
        where: { user_id: data[0].id, is_delete: 0 }
      });

      const responseData = {
        totalBrands: totalBusinessData,
        totalAppliedJobs: totalAppliedJobsData,
      };

      res.status(responseCode.OK).send(responseObj.successObject(null, responseData));

    } else {
      res.status(responseCode.BADREQUEST).send(responseObj.failObject("Something went wrong!"));
    }
  } catch (err) {
    res.status(responseCode.BADREQUEST).send(responseObj.failObject(err?.message, err));
  }
}

exports.applyJobs = async (req, res) => {
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
      where: { id: decoded?.id, profession_type: 'Influencer', is_delete: 0 },
    })

    if (data?.length > 0) {

      const requestdUserData = {
        user_id: decoded?.id,
        job_id: req.body?.job_id,
        bid_amount: req.body?.bid_amount,
        cover_letter: req.body?.cover_letter,
      };

      const jobData = await jobs.findAll({
        where: {job_status: 1, is_delete: 0},
      })

      if(jobData[0].budget >= req.body?.bid_amount){ 
        
        await candidates.create(requestdUserData);
        res.status(responseCode.OK).send(responseObj.successObject("Data has been inserted!"));

      } else {
        res.status(responseCode.BADREQUEST).send(responseObj.failObject("invalid bid amount"))
      }
      
    }

    else {
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
      where: { id: decoded?.id, profession_type: 'Influencer', is_delete: 0 },
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
