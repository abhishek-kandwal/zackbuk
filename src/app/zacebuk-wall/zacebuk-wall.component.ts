import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FetchJsonDataService } from '../fetch-json-data.service';
import { PostdataService } from '../post-data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CurrentUserService } from '../current-user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-zacebuk-wall',
  templateUrl: './zacebuk-wall.component.html',
  styleUrls: ['./zacebuk-wall.component.css']
})


export class ZacebukWallComponent implements OnInit, OnDestroy {
  commentboxid;
  temparray;
  likerlist: any[] = [];
  likerlist1: any[] = [];
  commenterlist: any[] = [];
  commenterlist1: any[] = [];
  commentValue = [];
  currentUser;
  postForm: FormGroup;
  commentForm: FormGroup;
  totalLikes = [];
  totalComments = [];
  likeId;
  new_post = [];
  new_comment = [];
  postid = 0;
  posts = [];
  comments = [];
  postsContent = [];
  user_logged: any;
  isloggedin: boolean;
  postValue = [];
  postList = [];
  counter;
  postData: any;
  commentData: any;
  fetchPost = [];
  subscription: Subscription;
  likedUserKey = [];
  posterId = [];
  isCollapsed = true;
  delKeys = [];

  constructor(private _postsData: FetchJsonDataService,
    private post_form: FormBuilder,
    private post_comment: FormBuilder,
    private route: Router,
    private fetchLikes: FetchJsonDataService,
    private post_data: PostdataService,
    private postsData: FetchJsonDataService,
    private currentuser: CurrentUserService,
    private check: FetchJsonDataService
  ) { }

  ngOnInit() {
    this.check.isloggedin.subscribe((val) => {
      this.isloggedin = val;
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // console.log(this.currentUser);
    try {
      this.subscription = this._postsData.getPost()
        .subscribe(data => {
          let temp;
          this.postList = Object.keys(data);
          this.postValue = Object.values(data);
          this.postList.map((el, index) => {
            let temp1: number;
            let temp2: number;
            try {
              temp1 = Object.values(this.postValue[index].Likes).length;
              temp2 = Object.values(this.postValue[index].Comments).length;
            } catch (error) {
              console.log('Read Error');
            }
            this.totalLikes.push(temp1);
            this.totalComments.push(temp2);
            temp = data[el].Post_content;
            const temp3 = data[el].Poster_ID;

            this.posterId.push(temp3);
            this.postid = this.postList.length;
            this.postsContent.push(temp);
            // console.log(this.likerlist);
            const url = `https://example-81cdf.firebaseio.com/Posts/${el}/Likes.json`;
            const cUrl = `https://example-81cdf.firebaseio.com/Posts/${el}/Comments.json`;
            this.subscription = this.fetchLikes.getlikes(url).subscribe(val => {
              try {

                const temp = [];
                temp.push(Object.keys(val));
                const temp1 = Object.values(val);
                //  console.log(temp1);
                // temp1[].Liker_Name);
                temp1.map((val, ind) => {
                  if (val.Liker_Name === this.currentUser.fullName) {

                    // console.log(val)
                    // document.getElementById('like'.concat('' + index)).setAttribute('disabled', 'true');
                    document.getElementById('like'.concat('' + index)).setAttribute('style', 'background-color:red');
                  }
                });
              } catch (error) {
                console.log('First like to the post.');
              }

            }

            );

          });
        });
      let temp1;

      this.fetchLikes.Posts.subscribe((val) => {
        temp1 = Object.values(val);
        console.log(temp1);

        temp1.map((ele, inde) => {

          if (ele['Likes']) {
            let li = Object.values(ele['Likes']);
            console.log(li);
            this.delKeys[inde] = Object.keys(ele.Likes)
            this.likerlist[inde] = li;
          } else {
            this.likerlist[inde] = '';
          }


          // }catch(error){
          //   console.log('first');

          // }



          // if(li){

          // }else{
          //   console.log('not defined');

          //   this.likerlist.push(" ");
          // }

          const co = Object.values(ele.Comments);
          this.commenterlist.push(co);
        });
      });
      // console.log(this.delKeys);
      console.log(this.likerlist);

      for (let i = 0; i < this.likerlist.length; i++) {
        const a = this.likerlist[i].length;
        const temp = [];
        for (let j = 0; j < a; j++) {

          temp[j] = this.likerlist[i][j].Liker_Name;
        }
        this.likerlist1[i] = temp;
        // if(temp){
        //   
        // }else{
        //   this.likerlist1.push(' ');
        // }

        // console.log(temp);

      }

      console.log(this.likerlist1);

      for (let i = 0; i < this.commenterlist.length; i++) {
        const a = this.commenterlist[i].length;
        const temp = [];
        const temp2 = [];
        for (let j = 0; j < a; j++) {
          temp[j] = this.commenterlist[i][j].Comment_Content;
          temp2[j] = this.commenterlist[i][j].Commenter_ID;

        }
        this.commenterlist1.push(temp2);
        this.commentValue.push(temp);
      }

      this.totalLikes.map((val, ind) => {
        // console.log(`totallikes${ind}`);
        document.getElementById(`totallikes${ind}`).innerHTML = `${this.totalLikes[val]}`;
      });

      this.totalComments.map((val, ind) => {
        // console.log(`totallikes${ind}`);
        document.getElementById(`totalcomments${ind}`).innerHTML = `${this.totalComments[val]}`;
      });
      console.log(this.totalLikes);
      this.postForm = this.post_form.group({
        new_post: ['']
      });

      this.commentForm = this.post_comment.group({
        new_comment: ['', Validators.required]
      });

      this.subscription = this.postsData.getPost().subscribe(val => {
        this.fetchPost.push(val);
      });
    } catch (error) {
      console.log('Read Error');

    }

    setTimeout(() => {
      document.getElementById('message').style.display = 'none';
    }, 2000);
  }

  openModal(event: { currentTarget: Element; }) {
    const modid = (event.currentTarget as Element).id;
    // console.log(modid);
    document.getElementById('mod'.concat(modid.slice(10))).style.display = 'block';
  }

  closeModal(event: { currentTarget: Element; }) {
    const modid = (event.currentTarget as Element).id;
    // console.log(modid);
    document.getElementById('mod'.concat(modid.slice(4))).style.display = 'none';
  }

  cOpenModal(event: { currentTarget: Element; }) {
    const modid = (event.currentTarget as Element).id;
    // console.log(modid);
    document.getElementById('cmod'.concat(modid.slice(12))).style.display = 'block';
  }

  cCloseModal(event: { currentTarget: Element; }) {
    const modid = (event.currentTarget as Element).id;
    // console.log(modid);
    document.getElementById('cmod'.concat(modid.slice(5))).style.display = 'none';
  }

  ngOnDestroy() {

    this.subscription.unsubscribe();
  }
  onSubmit(): void {
    console.log(this.currentuser.data);
    const { new_post } = this.postForm.value;
    // tslint:disable-next-line: one-variable-per-declaration
    const time = new Date().toTimeString(), post_Id = this.postid,
      poster = this.currentUser.fullName;
    this.postData = {
      Post_content: new_post,
      Time: time,
      Post_ID: post_Id,
      Poster_ID: poster
    };

    this.subscription = this.post_data.addPost(this.postData)
      .subscribe(post => {
        this.posts.push(post);
        //window.location.reload();
      });
    this.postForm.reset();
  }

  // Likes Function
  likes(event: { currentTarget: Element; }) {
    if (this.isloggedin) {
      this.likeId = (event.currentTarget as Element).id;
      console.log(this.likeId);
      let temp1d = this.likeId.slice(4);
      if (this.likeId) {
        const url = `https://example-81cdf.firebaseio.com/Posts/${this.postList[Number(this.likeId.slice(4))]}/Likes.json`;
        console.log(this.likerlist1);

        if (this.likerlist1[temp1d]) {
          let likerindex = this.likerlist1[temp1d].indexOf(this.currentUser.fullName);
          console.log(this.likerlist1[temp1d]);

          if (likerindex > -1) {
            let dislikekey = this.delKeys[temp1d][likerindex];
            const delurl = `https://example-81cdf.firebaseio.com/Posts/${this.postList[Number(this.likeId.slice(4))]}/Likes/${dislikekey}.json`
            console.log(delurl);
            this.post_data.deleteLikes(delurl).subscribe(() => console.log('User Deleted'));

            setTimeout(() => {
              location.reload();
            }, 2000)

          } else {
            // console.log('totallikes'.concat(this.likeId.slice(4)));
            document.getElementById('totallikes'.concat(this.likeId.slice(4))).innerHTML = `${this.totalLikes[this.likeId.slice(4)]}`;
            // document.getElementById(this.likeId).setAttribute("disabled", "true");
            //  let data = JSON.parse(localStorage.getItem('Posts'));

            this.post_data.pushlikes(url, { Liker_Name: this.currentUser.fullName }).subscribe(() => { });
            setTimeout(() => {
              location.reload();
            }, 2000);
          }
        } else {
          document.getElementById('totallikes'.concat(this.likeId.slice(4))).innerHTML = `${this.totalLikes[this.likeId.slice(4)]}`;

          //  let data = JSON.parse(localStorage.getItem('Posts'));

          this.post_data.pushlikes(url, { Liker_Name: this.currentUser.fullName }).subscribe(() => { });
          setTimeout(() => {
            location.reload();
          }, 2000);
        }
      }

    } else {
      window.alert('Please Login');
    }

  }

  comment(event: { currentTarget: Element; }) {
    const commentId = (event.currentTarget as Element).id;
    console.log(commentId);
    const { new_comment } = this.commentForm.value;
    console.log(new_comment);

    if (new_comment !== '') {
      this.commentData = {
        Comment_Content: new_comment,
        Time: new Date().toTimeString(),
        Commenter_ID: this.currentUser.fullName
      };
    }
    const curl = `https://example-81cdf.firebaseio.com/Posts/${this.postList[Number(commentId.slice(7))]}/Comments.json`;

    this.subscription = this.post_data.addComment(this.commentData, curl)
      .subscribe(comment => {
        this.comments.push(comment);
        location.reload();
      });
  }
}