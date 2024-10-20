import axios from "axios";


// Define the function to send the email
export const sendNotification = async (site: { name: string, url: string }): Promise<void> => {
    try {
        // Prepare the data to be sent
        const data = {
            mail: {
                subject: site.name + " - Website is Down",
                to: "sourav0w@gmail.com,codexsourav404@gmail.com,aryamehtaa@gmail.com",
                body: genrateTemplate(site),
            }
        };
        // Configure the request
        const config = {
            method: 'post',
            url: 'http://194.238.19.82:1122/mail/process',
            headers: {
                'Content-Type': 'application/json',
                "access-key": "1236789",
            },
            data: JSON.stringify(data),
            maxBodyLength: Infinity
        };

        // Send the request
        const response = await axios.request(config);

        // Log the response data
        console.log('Response:', response.data.message);

    } catch (error: any) {
        // Handle and log the error
        if (axios.isAxiosError(error)) {
            // Axios-specific error handling
            if (error.response) {
                // Server responded with a status other than 2xx
                console.error('Error Response:', error.response.data);
                console.error('Status:', error.response.status);
            } else if (error.request) {
                // Request was made but no response received
                console.error('No Response received:', error.request);
            } else {
                // Something else happened in setting up the request
                console.error('Error:', error.message);
            }
        } else {
            // Non-Axios errors
            console.error('Unexpected Error:', error.message);
        }
    }
};



const genrateTemplate = ({ name, url }: { name: string, url: string }) => {
    return /* html */`
<div style="font-family: Arial, sans-serif;background-color: #f4f4f4;margin: 0;padding: 0;color: #333;">
    <div class="container" style="max-width: 600px;margin: 50px auto;background-color: #ffffff;border-radius: 8px;box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);padding: 20px;">
        <div class="header" style="background-color: #ff6f61;color: white;padding: 10px;text-align: center;border-radius: 8px 8px 0 0;">
            <h1 style="font-size: 24px;color: #ff6f61;">Website Down Alert</h1>
        </div>
        <div class="content" style="padding: 20px;text-align: center;">
            <p style="font-size: 16px;line-height: 1.6;margin: 15px 0;">Hello,</p>
            <p style="font-size: 16px;line-height: 1.6;margin: 15px 0;">We have detected that the following website is currently down:</p>
            <h2>${name}</h2>
            <p style="font-size: 16px;line-height: 1.6;margin: 15px 0;">URL: <a href="${url}" style="color: #007bff;text-decoration: none;">${url}</a></p>
            <p style="font-size: 16px;line-height: 1.6;margin: 15px 0;">Please check the website's status and resolve the issue as soon as possible.</p>
            <a href="${url}" class="btn" style="color: white;text-decoration: none;display: inline-block;padding: 10px 20px;background-color: #ff6f61;border-radius: 5px;margin-top: 20px;font-size: 16px;">Visit Website</a>
        </div>
    </div>
</div>
`
}