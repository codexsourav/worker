import Bull from "bull";

export const mailWorker = new Bull('mailWorker', {
    redis: {
        host: '194.238.19.82',
        port: 6379,
        password: 'sourav',
    },
});


export const oneSignalWorker = new Bull('oneSignalWorker', {
    redis: {
        host: '194.238.19.82',
        port: 6379,
        password: 'sourav',
    },
});


export const deployWorker = new Bull('deployWorker', {
    redis: {
        host: '194.238.19.82',
        port: 6379,
        password: 'sourav',
    },
});
