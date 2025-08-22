import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const timezoned = () => {
    return new Date().toLocaleString("en-US", {
        timeZone: "UTC"
    });
};

const logger = winston.createLogger({
    level: process.env.NODE_ENV !== "production" ? "debug" : "info", // Log to console in development
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: timezoned }),
        winston.format.json(),
        winston.format.printf((log) => {
            if (log.stack) return `[${log.timestamp}] [${log.level}] ${log.stack}`;
            return `[${log.timestamp}] [${log.level}] ${log.message}`;
        })
    ),
    transports: [
        new DailyRotateFile({
            filename: "src/logs/%DATE%-combined.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d"
        }),
        new DailyRotateFile({
            filename: "src/logs/%DATE%-error.log",
            datePattern: "YYYY-MM-DD",
            zippedArchive: true,
            level: "error",
            maxSize: "20m",
            maxFiles: "14d"
        })
    ]
});

// Log to console in development
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console());
}

export default logger;
