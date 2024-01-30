module.exports = (sequelize, Sequelize) => {
    const Advertising_platform = sequelize.define(
        "advertising_platform",
        {
            job_id: {
                type: Sequelize.INTEGER,
                validate: {
                    notEmpty: true
                },
            },
            advertising_platform: {
                type: Sequelize.STRING,
                validate: {
                    notEmpty: true,
                },
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

    return Advertising_platform;
};
