
import { type Request, type Response } from "express";
import { deployWorker, mailWorker, oneSignalWorker } from "./queue";


export type workData = {
    type?: string,
    auth: {
        host?: string,
        port?: number,
        secure?: boolean,
        user?: string,
        pass?: string,
    }, mail: {
        from: string,
        to: string,
        subject: string,
        body?: string,
        html?: string,
    }
}

export const jobProvider = async (req: Request, res: Response): Promise<any> => {

    const body: workData = req.body;

    if (!body.mail) {
        return res.status(400).json({ status: false, message: 'mail data is required. {to,body} ' });
    }
    if (!body.mail.to) {
        return res.status(400).json({ status: false, message: 'To email is required.' });
    }

    if (!body.mail.body) {
        return res.status(400).json({ status: false, message: 'Mail body is required.' });
    }

    const jobData: workData = {
        type: "mail",
        auth: {
            host: body?.auth?.host || "smtp.gmail.com",
            user: body?.auth?.user || "info@idealedesigns.com",
            pass: body?.auth?.pass || "ssva efmi vxzd znrx",
            port: body?.auth?.port || 465,
            secure: body?.auth?.secure || true,
        },
        mail: {
            ...body.mail,
            html: body.mail.body,
            from: body.mail.from || "info@idealedesigns.com",
            subject: body.mail.subject || "Test mail form - idealedesigns.com"
        },
    }

    const job = await mailWorker.add(jobData)

    req.io.emit("log", "Send Mail Task Added Sucessfully")
    return res.status(201).json({ message: 'Task Added Sucessfully', status: true, job });

}


export const oneSignallJobProvider = async (req: Request, res: Response): Promise<any> => {
    const auth = req.headers.authorization;
    const body = req.body;
    // Check for authorization
    if (!auth) {
        return res.status(401).json({ status: false, message: "Unauthorized User" });
    }
    const job = await oneSignalWorker.add({
        auth,
        data: body
    })
    req.io.emit("log", "Task Send One Signal Quick Notification Added Sucessfully")
    return res.status(201).json({ message: 'Task Send One Signal Quick Notification Added Sucessfully', status: true, job });
}

export const oneSignallQuickJobProvider = async (req: Request, res: Response): Promise<any> => {
    const auth = req.headers.authorization;
    const body = req.body;

    // Check for authorization
    if (!auth) {
        return res.status(401).json({ status: false, message: "Unauthorized User" });
    }

    if (!body.app_id) {
        return res.status(401).json({ status: false, message: "Please Provide app_id" });
    }

    if (!body.title) {
        return res.status(401).json({ status: false, message: "Please Provide title" });
    }

    if (!body.desc) {
        return res.status(401).json({ status: false, message: "Please Provide desc" });
    }


    const job = await oneSignalWorker.add({
        auth,
        data: {
            "app_id": body.app_id,
            "headings": {
                "en": body.title,
            },
            "contents": {
                "en": body.desc,
            },
            "target_channel": "push",
            "included_segments": [
                "All"
            ]
        }
    })
    req.io.emit("log", 'Task  One Signal Quick Notification Added Sucessfully')
    return res.status(201).json({ message: 'Task  One Signal Quick Notification Added Sucessfully', status: true, job });
}


export const oneSignallQuickOneJobProvider = async (req: Request, res: Response): Promise<any> => {
    const auth = req.headers.authorization;
    const body = req.body;
    const { id } = req.params;

    // Check for authorization
    if (!auth) {
        return res.status(401).json({ status: false, message: "Unauthorized User" });
    }

    if (!body.app_id) {
        return res.status(401).json({ status: false, message: "Please Provide app_id" });
    }

    if (!body.title) {
        return res.status(401).json({ status: false, message: "Please Provide title" });
    }

    if (!body.desc) {
        return res.status(401).json({ status: false, message: "Please Provide desc" });
    }

    const job = await oneSignalWorker.add({
        auth,
        data: {
            "app_id": body.app_id,
            "headings": {
                "en": body.title,
            },
            "contents": {
                "en": body.desc,
            },
            "target_channel": "push",
            "included_segments": [
                "Subscribed Users"
            ],
            "include_aliases": {
                "external_id": [id]
            }
        }
    });
    req.io.emit("log", 'Task  One Signal User Quick Notification Added Sucessfully');
    return res.status(201).json({ message: 'Task  One Signal User Quick Notification Added Sucessfully', status: true, job });
}


export const deployJobProvider = async (req: Request, res: Response): Promise<any> => {
    const { project }: { project: string } = req.params as any;
    const job = await deployWorker.add({
        type: "deploy",
        project,
    });
    return res.send({
        status: true,
        message: "deploy process started",
        job,
    }); // Update this line
}
