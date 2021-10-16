import { PostsService } from "./posts.service";
import { Post } from "./post";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscriber, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { HttpEventType } from "@angular/common/http";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error: string;
  postSubscription!: Subscription;
  constructor(private postService: PostsService) {}

  ngOnInit() {
    this.fetchPosts();
    this.postSubscription = this.postService.postSubject.subscribe((data) => {
      if (data === "success") {
        this.fetchPosts();
      } else {
        this.error = data;
      }
    });
  }

  onCreatePost(postData: Post) {
    // Send Http request
    // console.log(postData);
    this.postService.addPost(postData);
    // .subscribe((data) => {
    //   this.fetchPosts();
    // });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.postService
      .deletePosts()
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            console.log("from sent");
            console.log(event.type);
          }
          if (event.type === HttpEventType.Response) {
            console.log("from response");
            console.log(event.body);
          }
        })
      )
      .subscribe((events) => {
        // console.log(events.type);
        this.fetchPosts();
      });
  }

  onHandleError() {
    this.error = null;
  }

  private fetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.loadedPosts = posts;
        this.isFetching = false;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.error.error;
        console.log(this.error);
      }
    );
  }
  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
  }
}
