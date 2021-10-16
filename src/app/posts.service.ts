import { Post } from "./post";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PostsService {
  postSubject = new Subject<string>();

  constructor(private http: HttpClient) {}

  addPost(postData: Post): any {
    return this.http
      .post<{ name: string }>(
        "https://maxi-complete-guide-default-rtdb.firebaseio.com/posts.json",
        postData,
        // default - gives only body
        // { observe: "body" }
        // gives whole response
        { observe: "response" }
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
          this.postSubject.next("success");
          // this.fetchPosts();
        },
        (error) => {
          this.postSubject.next("Post Error:" + error.error.error);
        }
      );
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append("print", "pretty");
    searchParams = searchParams.append("custom", "key");
    return this.http
      .get<{ [key: string]: Post }>(
        "https://maxi-complete-guide-default-rtdb.firebaseio.com/posts.json",
        {
          headers: new HttpHeaders({ Custom_Header: "Hello fellas" }),
          params: searchParams,
        }
      )
      .pipe(
        map((resposneData) => {
          const postsArray: Post[] = [];
          for (const key in resposneData) {
            // console.log(resposneData[key].content);
            if (resposneData.hasOwnProperty(key)) {
              postsArray.push({ ...resposneData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          // send to analyt)ics...if needed
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http.delete(
      "https://maxi-complete-guide-default-rtdb.firebaseio.com/posts.json",
      {
        observe: "events",
        // deault - json
        // responseType: "json"
        responseType: "text",
      }
    );
  }
}
