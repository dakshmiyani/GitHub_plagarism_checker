const express = require("express");
const { expressjwt: jwt } = require("express-jwt");

const AuthenticationError = require("../../errorHandlers/AuthenticationError");
const AccessPermissionError = require("../../errorHandlers/AccessPermissionError");
const { RES_LOCALS } = require("./constant");
const AuthModel = require("../../models/AuthModel");
const GithubAnalyticsRouter = require("../router/gitHubAnalyticsRouter");
const PlagiarismRouter = require("../router/plagiarismRouter");

const Router = express.Router();
const openrouter = express.Router();



class RouteMap {
  static setupRoutesAndAuth(app) {

    // 🔓 OPEN ROUTES
    app.use("/open/api/", openrouter);
    // 🔓 OPEN ROUTES (NO JWT)
    // app.use("/open/api/auth",Authrouter);
      

    openrouter.use("/github", GithubAnalyticsRouter);
    openrouter.use("/plagiarism", PlagiarismRouter);

    // app.use("/open/api/barcode",ProductRouter);




    //  PROTECTED ROUTES
    app.use(
      "/api",
      ...RouteMap._setupAuth(),
      RouteMap._addUserInformation,
      Router
    );



    // Router.use("/auth", Authrouter);
 
    




    //  404 HANDLER
    app.use((req, res) => {
      res.status(404).json({
        status: 404,
        message: "Specified path not found"
      });
    });

     

  }

  static _setupAuth() {
    const attachLocals = (req, res, next) => {
      req._locals = res.locals;
      next();
    };

    const authJwt = jwt({
      secret: process.env.JWT_SECRET_KEY,
      algorithms: ["HS256"],
      getToken: (req) => {
        if (req.headers.authorization) {
          return req.headers.authorization.split(" ")[1];
        }
        return null;
      }
    }).unless({
      path: [
        "/open/api/auth/login",
        "/open/api/auth/register"
      ]
    });

    return [
      attachLocals,
      authJwt,
      (err, req, res, next) => {
        if (err.name === "UnauthorizedError") {
          return res.status(401).json({
            status: 401,
            message: "Invalid or missing token"
          });
        }
        next(err);
      }
    ];
  }

  static async _addUserInformation(req, res, next) {
    try {
      const decoded = req.auth;

      if (!decoded?.user_id || !decoded?.email) {
        throw new AuthenticationError("Invalid token");
      }

      const authModel = new AuthModel();
      const userData = await authModel.getUserRoleById(decoded.email);

      if (!userData || !userData.roles?.length) {
        throw new AccessPermissionError();
      }

      res.locals[RES_LOCALS.USER_INFO.KEY] = {
        user: {
          user_id: decoded.user_id,
          email: decoded.email,
          role_id: userData.roles[0].role_id,
          roles: userData.roles
        },
        roles: userData.roles
      };

      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RouteMap;
