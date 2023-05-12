import pino from "pino";

const MyLogger = pino({
    level: 'trace',
    browser: {
        asObject: false
    },
});

MyLogger.level = 'trace';

export default MyLogger;