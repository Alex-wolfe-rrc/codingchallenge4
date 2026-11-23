
import { Project } from "../models/interfaces";

let projects: Project[] = [
    {
        id: 1,
        name: "Website Redesign",
        status: "active",
        createdAt: "2025-01-10T10:00:00.000Z",
    },
    {
        id: 2,
        name: "Mobile App v2",
        status: "planning",
        createdAt: "2025-01-08T10:00:00.000Z",
    },
    {
        id: 3,
        name: "API Migration",
        status: "active",
        createdAt: "2025-01-05T10:00:00.000Z",
    },
    {
        id: 4,
        name: "Security Audit",
        status: "completed",
        createdAt: "2025-01-03T10:00:00.000Z",
    },
];

export const getAllProjects = (): Project[] => {
    return projects;
};

export const getProjectById = (id: number): Project | undefined => {
    return projects.find((project) => project.id === id);
};

export const createProject = (
    name: string,
    status: string
): Project => {
    const newId = projects.length > 0
        ? Math.max(...projects.map((project) => project.id)) + 1
        : 1;

    const newProject: Project = {
        id: newId,
        name,
        status,
        createdAt: new Date().toISOString(),
    };

    projects.push(newProject);
    return newProject;
};

export const updateProject = (
    id: number,
    name?: string,
    status?: string
): Project | undefined => {
    const project = getProjectById(id);

    if (!project) {
        return undefined;
    }

    if (name !== undefined) project.name = name;
    if (status !== undefined) project.status = status;

    return project;
};

export const deleteProject = (id: number): boolean => {
    const index = projects.findIndex((project) => project.id === id);

    if (index === -1) {
        return false;
    }

    projects.splice(index, 1);
    return true;
};
