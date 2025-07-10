
export const BASE_URL = "http://localhost:4000";

export const DEFAULT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNzUxODg3OTM3LCJleHAiOjE3NTI0OTI3Mzd9.DARALa0Y6xLbRzUT__9TABO1UVMcB3TI23JmqqATFcE"

export const getAuthToken = () => {
    // get token from localstorage
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
}