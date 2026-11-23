
import express, { Router } from "express";
import * as projectController from "../controllers/projectController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// All three roles can view projects
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead", "developer"] }),
    projectController.getAllProjects
);

// All three roles can view one project
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead", "developer"] }),
    projectController.getProjectById
);

// Admin and lead can create projects
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead"] }),
    projectController.createProject
);

// Admin and lead can update projects
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead"] }),
    projectController.updateProject
);

// Only admin can delete projects
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    projectController.deleteProject
);

export default router;
