import { createLogger, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  transports: [new transports.Console()],
});

export const LogExecutionDuration = (): MethodDecorator => {
  return (_target: any, key: string, propertyDecorator: PropertyDescriptor) => {
    const fn = propertyDecorator.value;

    if (typeof fn === 'function') {
      propertyDecorator.value = async function (...args: any) {
        const start = new Date();
        logger.info(`${key} started at ${start}`);
        try {
          return fn.apply(this, args);
        } catch (e) {
          logger.error(`${key} execution got error`, { error: e });
          throw e;
        } finally {
          const end = new Date();
          logger.info({
            message: `${key} finished at ${end}`,
          });
          logger.info({
            message: `${key}'s execution duration ${
              end.getTime() - start.getTime()
            } ms`,
          });
        }
      };
    }
  };
};
