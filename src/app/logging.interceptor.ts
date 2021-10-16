import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log(request.method + " Outgoing request went from interceptor");
    console.log(request.url);
    console.log(request.headers);

    return next.handle(request).pipe(
      tap((event) => {
        // console.log(event);
        if (event.type === HttpEventType.Response) {
          console.log("Incoming Response recived, body data:");
          console.log(event.body);
        }
      })
    );
  }
}
