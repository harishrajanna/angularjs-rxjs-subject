var app=angular.module("app",[])
app.controller("appCtrl",($scope )=>{
    $scope.sample="some text here";
})
app.component("posts",{
    templateUrl:"posts/posts.html",
    controller:function($http,myFact){
        var ctrl=this;
        ctrl.heading="Posts"
        ctrl.posts=[];

        ctrl.$onInit = function(){ 
            var postReq=new Rx.Observable
            .fromPromise($http.get("https://jsonplaceholder.typicode.com/posts"))
            .map(response=>response.data)
            .flatMap(res=>res)
            .take(5)
            //.map(res=>res)
            .subscribe(data=>{
                console.log('data',data);
                ctrl.posts.push(data);
             });

             var sampleSubject=new Rx.Subject()

             sampleSubject.subscribe(val=>console.log("val 11",val));
             sampleSubject.subscribe(val=>console.log("val 22",val));
             sampleSubject.next("first value");
        }
        var postObs=myFact.postSubject()
        ctrl.selectedPost=function(post){
            postObs.sendPost(post);
        }  
    }
})
app.factory("myFact",function(){
    var postSubject=new Rx.Subject()
   this.postSubject=function(){
      
            this.sendPost=function(post){
                postSubject.next(post);
            };
            this.getPosts=()=>{
                return postSubject.asObservable();
            };

            return this;
   }
    return this;
});
app.component("postDetails",{
    templateUrl:"posts/postDetails.html",
    controller:function(myFact){
        var ctrl=this;
        var postObs=myFact.postSubject()
        postObs.getPosts().subscribe(res=>{
            this.post=res;
         })
    }
})