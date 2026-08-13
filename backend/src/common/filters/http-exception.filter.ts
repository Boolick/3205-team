import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

export interface ErrorResponseFormat {
  statusCode: number;
  message: string;
  errors: string[];
  timestamp: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
        errors = [exceptionResponse];
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        const respObj = exceptionResponse as Record<string, unknown>;
        const respMsg = respObj.message;

        if (Array.isArray(respMsg)) {
          errors = respMsg.map((e) => String(e));
          message = "Validation failed";
        } else if (typeof respMsg === "string") {
          message = respMsg;
          errors = [respMsg];
        } else {
          message = exception.message;
          errors = [exception.message];
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errors = [exception.message];
    } else {
      errors = ["An unknown error occurred"];
    }

    const formattedResponse: ErrorResponseFormat = {
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(formattedResponse);
  }
}
