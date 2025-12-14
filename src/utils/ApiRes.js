import fs from "fs";
import path from "path";

class API_RES {
  constructor(
    isExecutionSuccess = true,
    statusCode,
    message,
    data,
    errors,
    errorStack,
    req
  ) {
    this.isExecutionSuccess = isExecutionSuccess;
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400 && statusCode != 409;
    this.errors = errors;
    this.data = data;
    this.req = req;

    if (errorStack) {
      errorStack
        ? (this.errorStack = errorStack)
        : Error.captureStackTrace(this, this.constructor);
      this.reportError().catch((err) =>
        console.error("Failed to log error:", err)
      );
    }
  }

  toJSON() {
    return {
      isExecutionSuccess: this.isExecutionSuccess,
      statusCode: this.statusCode,
      success: this.success,
      message: this.message,
      data: this.data,
      errors: this.errors,
    };
  }

  async reportError() {
    try {
      const logsDir = path.join(process.cwd(), "logs");

      try {
        await fs.promises.access(logsDir);
      } catch {
        await fs.promises.mkdir(logsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString();
      const date = timestamp.split("T")[0];
      const logFile = path.join(logsDir, `error-${date}.log`);

      const errorLog = `
    ============================================================================================
    ============================================================================================
                                      SERVER ERROR OCCURRED
    ============================================================================================
    ============================================================================================

        Error Occured At: ${timestamp},
        Status Code: ${this.statusCode},
        Url: ${this.req?.originalUrl},
        Method: ${this.req?.method},
        Request Body: ${JSON.stringify(this.req?.body)},
        Params: ${JSON.stringify(this.req?.params)},
        Query: ${JSON.stringify(this.req?.query)},
        Ip: ${this.req?.ip},
        Request Headers : ${JSON.stringify(this.req?.headers)}

        Stack: ${JSON.stringify(this.errorStack?.stack)} 
      `;

      await fs.promises.appendFile(logFile, errorLog);
    } catch (e) {
      console.error("Error occured while logging error", e);
    }
  }
}

export default API_RES;
