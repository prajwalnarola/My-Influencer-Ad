module.exports = (sequelize, Sequelize) => {
    const Candidates = sequelize.define(
        "candidates",
        {
            job_id: {
                type: Sequelize.INTEGER,
                validate: {
                    notEmpty: true
                },
            },
            user_id: {
                type: Sequelize.INTEGER,
                validate: {
                    notEmpty: true
                },
            },
            bid_amount: {
                type: Sequelize.INTEGER,
                validate: {
                    notEmpty: true,
                },
            },
            cover_letter: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: true,
                },
            },
            is_shortlisted: {
                type: Sequelize.BOOLEAN,
                defaultValue: "0",
                comment: "0 = reject, 1 = shortlisted",
            },
            is_hired: {
                type: Sequelize.BOOLEAN,
                defaultValue: "0",
                comment: "0 = reject, 1 = hired",
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

    return Candidates;
};
