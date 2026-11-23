
import { Request, Response } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as projectService from "../services/projectService";

// GET /projects
export const getAllProjects = (
    req: Request,
    res: Response
): void => {
    const projects = projectService.getAllProjects();

    res.status(HTTP_STATUS.OK).json({
        message: "Projects retrieved",
        count: projects.length,
        data: projects,
    });
};

export const getProjectById = (
    req: Request,
    res: Response
): void => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Invalid project ID",
        });
        return;
    }

    const project = projectService.getProjectById(id);

    if (!project) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "Project not found",
        });
        return;
    }

    res.status(HTTP_STATUS.OK).json({
        message: "Project retrieved",
        data: project,
    });
};

export const createProject = (
    req: Request,
    res: Response
): void => {
    const { name, status } = req.body;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof status !== "string" || !status.trim()
    ) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Valid name and status are required",
        });
        return;
    }

    const project = projectService.createProject(name, status);

    res.status(HTTP_STATUS.CREATED).json({
        message: "Project created",
        data: project,
    });
};

export const updateProject = (
    req: Request,
    res: Response
): void => {
    const id = Number(req.params.id);
    const { name, status } = req.body;

    if (!Number.isInteger(id)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Invalid project ID",
        });
        return;
    }

    if (
        (name === undefined && status === undefined) ||
        (name !== undefined &&
            (typeof name !== "string" || !name.trim())) ||
        (status !== undefined &&
            (typeof status !== "string" || !status.trim()))
    ) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Valid name or status is required",
        });
        return;
    }

    const project = projectService.updateProject(id, name, status);

    if (!project) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "Project not found",
        });
        return;
    }

    res.status(HTTP_STATUS.OK).json({
        message: "Project updated",
        data: project,
    });
};

export const deleteProject = (
    req: Request,
    res: Response
): void => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: "Invalid project ID",
        });
        return;
    }

    const deleted = projectService.deleteProject(id);

    if (!deleted) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            message: "Project not found",
        });
        return;
    }

    res.status(HTTP_STATUS.OK).json({
        message: "Project deleted",
    });
};
