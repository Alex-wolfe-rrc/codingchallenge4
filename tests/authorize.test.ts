
import { Request, Response } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";

describe("Authorization Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = { params: {} };
        mockResponse = { locals: {} };
        nextFunction = jest.fn();
    });

    it("should return ROLE_NOT_FOUND when role is missing", () => {
        // Arrange
        mockResponse.locals = { uid: "user123" };
        const middleware = isAuthorized({ hasRole: ["admin"] });

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                code: "ROLE_NOT_FOUND",
                statusCode: 403,
            })
        );
    });

    it("should return INSUFFICIENT_ROLE when role is not allowed", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            role: "developer",
        };
        const middleware = isAuthorized({ hasRole: ["admin"] });

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                code: "INSUFFICIENT_ROLE",
                statusCode: 403,
            })
        );
    });

    it("should call next when role is allowed", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            role: "admin",
        };
        const middleware = isAuthorized({ hasRole: ["admin"] });

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should allow multiple roles", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            role: "lead",
        };
        const middleware = isAuthorized({
            hasRole: ["admin", "lead"],
        });

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith();
    });
});
