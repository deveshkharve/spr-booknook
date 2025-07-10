import createHttpError from 'http-errors';


const createErrorResponse = (statusCode, errorMessage="Something went wrong") => {
    return createHttpError(statusCode, errorMessage);
};

const createSuccessResponse = (data, message="Success") => {
    return {
        data,
        message,
    };
};

export { createErrorResponse, createSuccessResponse };
