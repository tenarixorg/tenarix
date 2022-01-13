import { Worker } from "worker_threads";

export const worker = <T>(fn: string, ...data: any[]) => {
  return new Promise<T>((res, rej) => {
    const worker = new Worker(fn, {
      workerData: data,
      eval: true,
    });
    worker.on("message", (msg) => {
      if (msg.done) {
        res(msg.data);
      } else {
        console.log(msg.data);
      }
    });
    worker.on("error", rej);
    worker.on(
      "exit",
      (c) => c !== 0 && rej(new Error("worker stopped with code" + c))
    );
  });
};
