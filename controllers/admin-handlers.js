const bcrypt = require("bcryptjs");
const adminsDb = require("../db/adminsDb");

exports.loginPage = (req, res) => {
    res.locals.title = "Admin Login | BOOK STORE";
    res.locals.page = "other";
    res.render("admins/login");
};

exports.login = async (req, res) => {
    const { username, password } = req.body;

    const admin = await adminsDb.findByUsername(username);

    if (!admin) {
        req.flash("error", "Foydalanuvchi ismi yoki parol xato");
        res.redirect("/login");

        return;
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
        req.flash("error", "Foydalanuvchi ismi yoki parol xato");
        res.redirect("/login");

        return;
    }

    req.session.admin = { adminId: admin.id };

    res.redirect("/");
};

exports.register = async (req, res) => {
    const { username, password, name } = req.body;

    const admin = await adminsDb.findByUsername(username);

    if (admin) {
        req.flash("error", "Foydalanuvchi logini allaqachon mavjud.");
        res.redirect("/register");

        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await adminsDb.insert({ name, username, password: hashedPassword });

    res.redirect("/admins");
};

exports.logout = (req, res) => {
    req.session.destroy();

    res.redirect("/");
};

exports.profile = async (req, res) => {
    const admin = await adminsDb.findById(req.adminId);

    if (!admin) {
        res.redirect("/");
        return;
    }

    res.locals.title = "Profile | BOOK STORE";
    res.locals.page = "other";
    res.render("admins/profile", { admin });
};
