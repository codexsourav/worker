import axios, { AxiosError } from 'axios';

export interface WebsiteHealth {
    isHealthy: boolean;
    status: number;
    responseTime: number; // in milliseconds
}

export async function checkWebsiteHealth(url: string): Promise<WebsiteHealth> {
    const startTime = Date.now();

    try {
        const response = await axios.get(url);
        const responseTime = Date.now() - startTime;

        return {
            isHealthy: response.status === 200,
            status: response.status,
            responseTime
        };
    } catch (error) {
        const responseTime = Date.now() - startTime;

        // Check if error is an AxiosError
        if (axios.isAxiosError(error)) {
            const status = error.response ? error.response.status : 500;
            const message = getAxiosErrorMessage(error);

            // Handle AxiosError with additional error context
            console.error(`AxiosError - Status: ${status}, Message: ${message}`);

            return {
                isHealthy: false,
                status,
                responseTime
            };
        } else {
            // Non-Axios errors, e.g., programming error
            console.error(`Unexpected error: ${error}`);
            return {
                isHealthy: false,
                status: 500,
                responseTime
            };
        }
    }
}

// Function to interpret AxiosError based on type
function getAxiosErrorMessage(error: AxiosError): string {
    if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        return `Server responded with status ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
        // The request was made but no response was received
        return 'No response received from the server';
    } else {
        // Something happened in setting up the request that triggered an Error
        return `Error in request setup: ${error.message}`;
    }
}

