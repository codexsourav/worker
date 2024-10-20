import { deployWorker, mailWorker, oneSignalWorker } from "./queue";
import type { workData } from "./jobProvider";
import nodemailer from "nodemailer";
import axios from "axios";
import type { Server } from "socket.io";
import { exec } from "child_process";

export const WorkerProcess = (id: Server) => {
    // Process jobs in the mail queue
    mailWorker.process(async (job) => {
        const data: workData = job.data;
        id.emit("log", { type: "info", data: `Processing send Mail --> : ${data.mail.to}` });

        try {
            const transporter = nodemailer.createTransport({
                host: data.auth.host,
                port: data.auth.port,
                secure: data.auth.secure, // true for port 465, false for other ports
                auth: {
                    user: data.auth.user,
                    pass: data.auth.pass,
                },
            });
            const info = await transporter.sendMail(data.mail);
            console.warn(info.messageId);
            id.emit("log", { type: "info", data: `Mail sent successfully to ${data.mail.to}. Message ID: ${info.messageId}` });
            return Promise.resolve(); // or return some result
        } catch (error: any) {
            const errorMessage = `Job SendMail --> ${data.mail.to} failed: ${error?.message}`;
            console.error(errorMessage);
            id.emit("log", { type: "error", data: errorMessage });
            throw error; // To mark the job as failed
        }
    });

    // Handle job completion and failure
    mailWorker.on('completed', (job) => {
        const successMessage = `Job with ID ${job.id} has been completed.`;
        console.log(successMessage);
        id.emit("log", { type: "info", data: successMessage });
    });

    mailWorker.on('failed', (job, err) => {
        const failureMessage = `Job with ID ${job.id} failed with error: ${err?.message}`;
        console.error(failureMessage);
        id.emit("log", { type: "error", data: failureMessage });
    });
}

export const OneSignallWorkerProcess = (id: Server) => {
    // Process jobs in the OneSignal queue
    oneSignalWorker.process(async (job) => {
        const data: { auth: string; data: any } = job.data;
        id.emit("log", { type: "info", data: `Processing Send Notification --> ${job.id}` });

        try {
            const res = await axios.post("https://api.onesignal.com/notifications", data.data, {
                headers: {
                    "Authorization": data.auth,
                    "Content-Type": "application/json",
                },
            });
            console.log(res.data);
            id.emit("log", { type: "info", data: `Notification sent successfully. Response: ${JSON.stringify(res.data)}` });

            return Promise.resolve(); // or return some result
        } catch (error: any) {
            const errorMessage = `Job SendNotification failed: ${error?.message}`;
            console.error(errorMessage);
            id.emit("log", { type: "error", data: errorMessage });
            throw error; // To mark the job as failed
        }
    });

    // Handle job completion and failure
    oneSignalWorker.on('completed', (job) => {
        const successMessage = `Job SendNotification with ID ${job.id} has been completed.`;
        console.log(successMessage);
        id.emit("log", { type: "info", data: successMessage });
    });

    oneSignalWorker.on('failed', (job, err) => {
        const failureMessage = `Job SendNotification with ID ${job.id} failed with error: ${err?.message}`;
        console.error(failureMessage);
        id.emit("log", { type: "error", data: failureMessage });
    });
}


// Define the worker process
export const DeployWorkerProcess = (io: Server) => {
    // Process jobs in the queue
    deployWorker.process(async (job) => {
        try {
            const data: { type: string, project: string } = job.data;

            console.log(`Starting job: ${job.id}, data: ${JSON.stringify(data)}`);

            // Run a bash script asynchronously using exec
            const task = exec(`bash bash.sh ${data.project}`);

            // Stream stdout data as it comes in
            task.stdout?.on("data", (chunk) => {
                io.emit("log", {
                    type: "log",
                    data: chunk
                })
            });

            // Stream stderr data for errors
            task.stderr?.on("data", (chunk) => {
                io.emit("log", {
                    type: "error",
                    data: chunk,
                })
            });

            // Listen for when the process closes
            task.on("close", (code) => {
                io.emit("log", {
                    type: "log",
                    data: `Process completed with exit code: ${code}`
                });
            });

            console.log(`Job ${job.id} - Finished processing`);

            // Return success for the job processing
            return Promise.resolve();
        } catch (error) {
            console.error(`Error processing job ${job.id}: ${error}`);

            // Rethrow the error to mark the job as failed
            throw error;
        }
    });

    // Handle job completion
    deployWorker.on('completed', (job) => {
        console.log(`Job with ID ${job.id} has been completed.`);
    });

    // Handle job failure
    deployWorker.on('failed', (job, err) => {
        console.error(`Job with ID ${job.id} failed with error: ${err?.message}`);
    });
};
