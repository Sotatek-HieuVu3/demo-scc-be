jest.setTimeout(60000);

jest.mock('bull', () => {
  return class {
    jobCnt = 0;
    jobQueue = [];
    eventCallback = {};
    processors = {};
    async process(name, callback) {
      if (!this.processors[name]) {
        this.processors[name] = callback;
      }
      const curJob = this.jobQueue.pop();
      if (curJob?.name === name) {
        try {
          this.eventCallback.active?.(curJob);
          await callback(curJob);
          this.eventCallback.completed?.(curJob);
        } catch (error) {
          this.eventCallback.failed?.(curJob);
        }
      }
    }
    on(event, callback) {
      this.eventCallback[event] = callback;
      return this;
    }
    close = jest.fn();
    add(name, data) {
      this.jobQueue.unshift({
        id: this.jobCnt + 1,
        data,
        name,
      });
      this.jobCnt += 1;
      void this.process(name, this.processors[name]);
    }
  };
});

process.on('unhandledRejection', (err) => {
  console.warn(`UnhandledRejection`);
  console.warn(err);
});
