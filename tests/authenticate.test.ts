
import { Request, Response } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { auth } from "../config/firebaseConfig";

describe("Authentication Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRequest = { headers: {} };
        mockResponse = { locals: {} };
        nextFunction = jest.fn();
    });

    it("should return TOKEN_NOT_FOUND when token is missing", async () => {
        // Arrange
        mockRequest.headers = {};

        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                code: "TOKEN_NOT_FOUND",
                statusCode: 401,
            })
        );
        expect(auth.verifyIdToken).not.toHaveBeenCalled();
    });

    it("should return TOKEN_INVALID when token is invalid", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Bearer invalid-token",
        };
        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
            new Error("Invalid token")
        );

        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                code: "TOKEN_INVALID",
                statusCode: 401,
            })
        );
    });

    it("should store uid when token is valid", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };
        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: "user123",
            role: "admin",
        });

        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(mockResponse.locals?.uid).toBe("user123");
        expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should store role when token is valid", async () => {
        // Arrange
        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };
        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: "user123",
            role: "lead",
        });

        // Act
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(mockResponse.locals?.role).toBe("lead");
        expect(nextFunction).toHaveBeenCalledWith();
    });
});
