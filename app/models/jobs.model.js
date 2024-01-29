module.exports = (sequelize, Sequelize) => {
    const Jobs = sequelize.define(
        "jobs",
        {
            user_id: {
                type: Sequelize.INTEGER,
                validate: {
                    notEmpty: true
                },
            },
            image: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: true,
                },
            },
            description: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: true,
                },
            },
            website: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: true,
                },
            },
            minimum_followers: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: true,
                },
            },
            due_date: {
                type: Sequelize.DATE,
                validate: {
                    notEmpty: true,
                },
            },
            open_to_applicants: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: true,
                },
            },
            age_range: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: true,
                },
            },
            role: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: true,
                },
            },
            budget: {
                type: Sequelize.INTEGER,
                validate: {
                    notEmpty: true,
                },
            },
            job_status: {
                type: Sequelize.BOOLEAN,
                defaultValue: "0",
                comment: "0 = reject, 1 = hire",
            },
            is_delete: {
                type: Sequelize.BOOLEAN,
                defaultValue: "0",
                comment: "0 = false, 1 = true",
            },
            is_testdata: {
                type: Sequelize.BOOLEAN,
                defaultValue: "1",
                comment: "0 = false, 1 = true",
            },
        },
        { freezeTableName: true, timestamps: true, createdAt: "created_at", updatedAt: "updated_at" },
    );

    return Jobs;
};
