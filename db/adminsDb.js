const fsp = require("fs/promises");
const path = require("path");

async function findByUsername(username) {
    const data = await fsp.readFile(
        path.join(__dirname, "admins.json"),
        "utf8"
    );

    const admins = JSON.parse(data);
    const admin = admins.find((admin) => admin.username === username);

    if (!admin) {
        return null;
    }

    return admin;
}

async function findById(id) {
    const data = await fsp.readFile(
        path.join(__dirname, "admins.json"),
        "utf8"
    );

    const admins = JSON.parse(data);
    const admin = admins.find((admin) => admin.id === id);

    if (!admin) {
        return null;
    }

    return admin;
}

async function insert({ name, password, username }) {
    const admins = await findAll();

    const admin = {
        id: randomUUID(),
        name,
        password,
        username,
        is_deleted: false,
    };

    admins.unshift(admin);

    await fsp.writeFile(
        path.join(__dirname, "admins.json"),
        JSON.stringify(admins)
    );

    return true;
}

module.exports = {
    findByUsername,
    findById,
    insert,
};
