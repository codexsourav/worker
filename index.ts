
import express from "express";
import { deployJobProvider, jobProvider, oneSignallJobProvider, oneSignallQuickJobProvider, oneSignallQuickOneJobProvider } from "./jobProvider";
import { DeployWorkerProcess, OneSignallWorkerProcess, WorkerProcess } from "./worker";
import http from 'http';
import { Server } from 'socket.io';
import { deployWorker } from "./queue";
import { HelgthCheckWorker, startHelgthCheckWorker } from "./helgth/helgthWorker";


const app = express()
app.use(express.json());
const port: number = 1122;
const server = http.createServer(app);
const io = new Server(server);
const ACCESS_KEY = "1236789"


// Middleware to check access key in headers
const authenticate = (req: express.Request, res: express.Response, next: express.NextFunction): any => {
    const apiKey = req.headers['access-key'] as string;
    if (apiKey && apiKey === ACCESS_KEY) {
        req.io = io;
        next();
    } else {
        return res.status(403).json({
            status: false,
            message: "Forbidden: Invalid or missing access key"
        });
    }
}

// Apply authentication middleware globally
app.use(authenticate);

// Create a job queue
app.post("/mail/process", jobProvider);

app.post("/onesignal/push", oneSignallJobProvider);

app.post("/onesignal/push/quick", oneSignallQuickJobProvider);

app.post("/onesignal/push/quick/:id", oneSignallQuickOneJobProvider);

app.get("/deploy/:project", deployJobProvider);

app.get("/helgth/check", (req, res): any => {
    HelgthCheckWorker();
    return res.send("Rechecking..");
});


server.listen(port, () => {
    console.log("Worker Run On Port -- " + port);
    io.on('connection', (socket) => {
        console.log('A user connected');
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
    WorkerProcess(io);
    OneSignallWorkerProcess(io)
    DeployWorkerProcess(io);
    startHelgthCheckWorker();
});