import winston, { format, transports } from "winston";
const { combine, printf, colorize, timestamp } = format;

const logger = winston.createLogger({
  defaultMeta: { service: "efm-listener" },
  level: "info",
  format: combine(
    timestamp(),
    printf(
      ({ timestamp, level, message }) =>
        `${new Date(timestamp).toLocaleDateString("tr-Tr", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })} ${level.toLocaleUpperCase()}: ${message}`
    ),
    colorize({ all: true })
  ),
  transports: [new transports.Console()],
});

export default logger;
