///profile info
document.addEventListener("DOMContentLoaded", function () {


  const postsBtn = document.querySelector(".postsBtn");
  const commentsBtn = document.querySelector(".commentsBtn");
  const likesBtn = document.querySelector(".likesBtn");
  const followersBtn = document.querySelector('.followersBtn');
  const followingBtn = document.querySelector(".followingBtn");

  const postsContainer = document.querySelector(".postsContainer");
  const commentsContainer = document.querySelector(".commentContainer");
  const likesContainer = document.querySelector(".likesContainer");
  const followersTable = document.querySelector(".followersContainer");
  const followingTable = document.querySelector(".followingContainer");
  

const userId = localStorage.id;
const token = localStorage.token;

// Fetch user information for the post
axios
  .post(`http://localhost:5000/user/oneUser/${userId}`)
  .then((response) => {
    const userData = response.data.user;

    // Find the profilePic element
    const profilePicElement = document.querySelector('.profilePic');

    // Create the HTML content using the user data
    let postContent = '';
    
    // Check if the user has a profile picture
    if (userData.profilePic && userData.profilePic.trim() !== '') {
      postContent += `<div> <img src="${userData.profilePic}" alt=""> </div>`;
    } else {
      // Use a default image if no profile picture is available
      postContent += `<div> <img src="./Images/circle-user-icon-133471.png" alt="Default Image"> </div>`;
    }

    postContent += `
      <div class="profileName">
        <h5>${userData.name}</h5>
        <p>@${userData.username}</p>
      </div>
      <div>
        <a href="./updateProfile.html">
          <img src="./Images/mdi_pencil-outline.png" alt="" style="height: 3vh; width: 3vh;">
        </a>
      </div>
      
    `;
    // console.log(document.querySelector('.followersBtn'));
    document.querySelector('.followersBtn').innerHTML += (userData.numFollowers || 0)
    // document.querySelector('.followingBtn').appendChild(userData.numFollowing)
    document.querySelector('.followingBtn').innerHTML += (userData.numFollowing || 0)

    // Set the innerHTML of the profilePic element
    profilePicElement.innerHTML = postContent;
  })
  .catch((err) => {
    console.log(err);
  });


// Fetch all posts
  // Initially, hide the Comments and Likes containers
  postsContainer.style.display = "block";
  commentsContainer.style.display = "none";
  likesContainer.style.display = "none";
  followersTable.style.display = "none";
  followingTable.style.display = "none";
  

  // Add click event listeners to the buttons
  postsBtn.addEventListener("click", function () {
    postsContainer.style.display = "block";
    commentsContainer.style.display = "none";
    likesContainer.style.display = "none";

    const id = localStorage.id
    const token = localStorage.token


    axios
      .get(`http://localhost:5000/posts/yourposts/${id}`,
        {
          headers: {
            token: token // Include the token in the request headers
          },
        })
      .then((response) => {
        if (response.data) {
          let posts = response.data;

          if (!Array.isArray(posts) && response.data.posts) {
            posts = response.data.posts;
          }else{
              console.log("No posts");
          }

          console.log(posts);
          // Iterate through each post and fetch user information
          posts.forEach((post) => {
            if (post.userId) {
              console.log(post);
              axios.post(`http://localhost:5000/user/oneUser/${post.userId}`)
                .then((response) => {
                  console.log(response);
                  

                  const user = response.data.user;
                  // Create HTML elements for the post and user information
                  const postElement = document.createElement('div');
                  postElement.classList.add('post');

                  // Create the post content without the image if post.postPic is not available
                  let postContent = `
              <div class="home">
                <div class="profilePic">
                  <div> <img src="${user.profilePic}" alt=""> </div>
                  <div class="profileName">
                    <h5>${user.name}</h5>
                    <p>@${user.username}</p>
                  </div>
                  <a href="#" class="deletePostBtn" data-userid="${user.id}" data-postid="${post.postId}">
                    <img src="./Images/icons8-delete-24.png" height="12vh" width="10vh"  alt="Delete">
                  </a>

                <a href="#" class="updatePostBtn" data-userid="${user.id}" data-commentid="${post.postId}">
                  <img src="./Images/mdi_pencil-outline.png" height="12vh" width="10vh"  alt="Edit">
                </a>

                </div>
                <div class="postContent">
                  <p>${post.postName}</p>
                </div>
                <div class="reactions">
                  <a href="./comments.html">
                    <img src="./Images/ei_comment.png" alt="comment">
                  </a>
                  <img src="./Images/iconamoon_like-thin.png" alt="like">
                </div>
              </div>
            `;

                  // If post.postPic exists, append the image to postContent
                  if (post.postPic) {
                    postContent = `
                <div class="home">
                  <div class="profilePic">
                    <div> <img src="${user.profilePic}" alt=""> </div>
                    <div class="profileName">
                      <h5>${user.name}</h5>
                      <p>@${user.username}</p>
                    </div>
                    <a href="#" class="deletePostBtn" data-userid="${user.id}" data-postid="${post.postId}">
                    <img src="./Images/icons8-delete-24.png" height="12vh" width="10vh"  alt="Delete">
                  </a>
                  <a href="#" class="updatePostBtn" data-userid="${user.id}" data-postid="${post.postId}">
                    <img src="./Images/mdi_pencil-outline.png" height="12vh" width="10vh"  alt="Edit">
                  </a>                  </div>
                  <div class="postContent">
                    <img src="${post.postPic}" alt="">
                    <p>${post.postName}</p>
                  </div>
                  <div class="reactions">
                    <a href="./comments.html">
                      <img src="./Images/ei_comment.png" alt="comment">
                    </a>
                    <img src="./Images/iconamoon_like-thin.png" alt="like">
                  </div>
                </div>
              `;
                  }

                  // Set the post content
                  postElement.innerHTML = postContent;

                  // Find the postContainer within postSection
                  const postSection = document.querySelector('.postSection');
                  const postContainer = postSection.querySelector('.postContainer');

                  // Append the postElement to postContainer
                  postContainer.appendChild(postElement);

              
                  // Add an event listener to the Delete Post button for each follower
        const deletePostBtn = postElement.querySelector(".deletePostBtn");
        deletePostBtn.addEventListener("click", () => {
          const postId = post.postId;
          toggleDeletePost(postId);
        });


        const updatePostBtn = postElement.querySelector(".updatePostBtn");
        updatePostBtn.addEventListener("click", ()=>{
          const postId = post.postId;
          toggleUpdatePost(postId);
        })

        // Get the modal element by its id
        const updatePostModal = document.querySelector('#updatePostModal');

        // Get the <span> element that closes the modal
        const closeModal = updatePostModal.querySelector('.close');

        // When the user clicks on the "updatePostBtn," open the modal
        updatePostBtn.addEventListener('click', () => {
          updatePostModal.style.display = 'block';
        });

        // When the user clicks on the <span> (x), close the modal
        closeModal.addEventListener('click', () => {
          updatePostModal.style.display = 'none';
        });

        // When the user clicks anywhere outside of the modal, close it
        window.addEventListener('click', (event) => {
          if (event.target === updatePostModal) {
            updatePostModal.style.display = 'none';
          }
        });

                })
                .catch((err) => {
                  console.log(err);
                })
            }
          });
        } else {
          console.error('No posts found in the response data.');
        }
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  });



  commentsBtn.addEventListener("click", function () {
    // Clear the postContainer to avoid duplicating comments
    const postContainer = document.querySelector('.commentContainer');
    postContainer.innerHTML = ''; // Clear the container

    postsContainer.style.display = "none";
    commentsContainer.style.display = "block";
    likesContainer.style.display = "none";
    followersTable.style.display = "none";
    followingTable.style.display = "none";
  
    const userId = localStorage.id;
    const token = localStorage.token;
    const postId = localStorage.postId;
  
    // Fetch comments for the specific user's post
    axios
      .get(`http://localhost:5000/comments/yourcomments/${userId}`, {
        headers: {
          token: token
        }
      })
      .then((response) => {
        console.log(response);
        if (response.data) {
          let userPostsComments = response.data.allUserComments;
  
          // Check if userPostsComments is an array; if not, convert it to an array
          if (!Array.isArray(userPostsComments)) {
            userPostsComments = [userPostsComments];
          }
  
          // Iterate through each comment
          userPostsComments.forEach((alluserComments) => {
            console.log(alluserComments);
            if (alluserComments.userId) {
              axios.post(`http://localhost:5000/user/oneUser/${alluserComments.userId}`)
                .then((response) => {
                  console.log(response);
  
                  const user = response.data.user;
                  console.log(user);
  
                  // Create HTML elements for the comment and user information
                  const commentElement = document.createElement('div');
                  commentElement.classList.add('post');
  
                  // Create the comment content
                  let commentContent = `
                  <div class="home">
                  <div class="profilePic">
                    <div> <img src="${user.profilePic}" alt=""> </div>
                    <div class="profileName">
                      <h5>${user.name}</h5>
                      <p>@${user.username}</p>
                    </div>
                    <a href="#" class="deleteCommentBtn" data-userid="${user.userId}" data-commentid="${alluserComments.postId}">
                      <img src="./Images/icons8-delete-24.png" height="12vh" width="10vh"  alt="Delete">
                    </a>
                    <a href="#" class="updateCommentBtn" data-userid="${user.userId}" data-commentid="${alluserComments.postId}">
                      <img src="./Images/mdi_pencil-outline.png" height="12vh" width="10vh"  alt="Edit">
                    </a>
  
                  </div>
                  <div class="postContent">
                    <p>${alluserComments.commentText}</p>
                  </div>
                  <div class="reactions">
                    <a href="./comments.html">
                      <img src="./Images/ei_comment.png" alt="comment">
                    </a>
                    <img src="./Images/iconamoon_like-thin.png" alt="like">
                  </div>
                </div>
                  `;
  
                  // If comment.postPic exists, append the image to commentContent
                  if (alluserComments.commentPic) {
                    commentContent = `
                    <div class="home">
                    <div class="profilePic">
                      <div> <img src="${user.profilePic}" alt=""> </div>
                      <div class="profileName">
                        <h5>${user.name}</h5>
                        <p>@${user.username}</p>
                      </div>
                      <a href="#" class="deleteCommentBtn" data-userid="${user.userId}" data-commentid="${alluserComments.commentId}" data-postId="${alluserComments.postId}">
                      <img src="./Images/icons8-delete-24.png" height="12vh" width="10vh"  alt="Delete">
                    </a>
                    <a href="#" class="updateCommentBtn" data-userid="${user.userId}"  data-commentId ="${alluserComments.commentId}" data-postId="${alluserComments.postId}">
                      <img src="./Images/mdi_pencil-outline.png" height="12vh" width="10vh"  alt="Edit">
                    </a>
                    </div>
                    <div class="postContent">
                      <img src="${alluserComments.commentPic}" alt="">
                      <p>${alluserComments.commentText}</p>
                    </div>
                    <div class="reactions">
                      <a href="./comments.html">
                        <img src="./Images/ei_comment.png" alt="comment">
                      </a>
                      <img src="./Images/iconamoon_like-thin.png" alt="like">
                    </div>
                  </div>
                    `;
                  }
  
                  // Set the comment content
                  commentElement.innerHTML = commentContent;
  
                  // Append the commentElement to postContainer
                  postContainer.appendChild(commentElement);


           // Add an event listener to the Delete Comment button for each follower
           const deleteCommentBtn = commentElement.querySelector(".deleteCommentBtn");
           deleteCommentBtn.addEventListener("click", () => {
             const postId = alluserComments.postId;
             const commentId = alluserComments.commentId;
             toggleDeleteComment(postId, commentId);
           });


           // Get the button that opens the modal
            const updateCommentBtn = commentElement.querySelector('.updateCommentBtn');
            updateCommentBtn.addEventListener("click", ()=>{
              const commentId = alluserComments.commentId
              toggleUpdateComment(commentId)
            })
            // Get the modal element by its id
            const updateCommentModal = document.querySelector('#updateCommentModal');

            // Get the <span> element that closes the modal
            const closeModal = updateCommentModal.querySelector('.close');

            // When the user clicks on the "updateCommentBtn," open the modal
            updateCommentBtn.addEventListener('click', () => {
              updateCommentModal.style.display = 'block';
            });

            // When the user clicks on the <span> (x), close the modal
            closeModal.addEventListener('click', () => {
              updateCommentModal.style.display = 'none';
            });

            // When the user clicks anywhere outside of the modal, close it
            window.addEventListener('click', (event) => {
              if (event.target === updateCommentModal) {
                updateCommentModal.style.display = 'none';
              }
            });



                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
        } else {
          console.error('No comments found in the response data.');
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  });
  
  
  likesBtn.addEventListener("click", function () {
    // Clear the postContainer to avoid duplicating comments
    const postContainer = document.querySelector('.likesContainer');
    postContainer.innerHTML = ''; // Clear the container

    postsContainer.style.display = "none";
    commentsContainer.style.display = "none";
    likesContainer.style.display = "block";
    followersTable.style.display = "none";
    followingTable.style.display = "none";
  
    const userId = localStorage.id;
    const token = localStorage.token;
    const postId = localStorage.postId;
  
    // Fetch comments for the specific user's post
    axios
      .get(`http://localhost:5000/like/yourlikes/${userId}`, {
        headers: {
          token: token
        }
      })
      .then((response) => {
        console.log(response.data);
//  const likes = 
        if (response.data) {
          let likes = response.data;
  
          // Check if likes is an array; if not, convert it to an array
          if (!Array.isArray(likes)) {
            likes = [likes];
            console.log(likes);
          }
  
          // Iterate through each comment
          likes.forEach((like) => {
            console.log(like);
            if (like.userId) {
              axios.post(`http://localhost:5000/user/oneUser/${like.userId}`)
                .then((response) => {
                  console.log(response);
  
                  const user = response.data.user;
                  console.log(user);
  
                  // Create HTML elements for the comment and user information
                  const commentElement = document.createElement('div');
                  commentElement.classList.add('post');
  
                  // Create the comment content
                  let commentContent = `
                  <div class="home">
                  <div class="profilePic">
                    <div> <img src="${user.profilePic}" alt=""> </div>
                    <div class="profileName">
                      <h5>${user.name}</h5>
                      <p>@${user.username}</p>
                    </div>

  
                  </div>
                  <div class="postContent">
                    <p>${like.postName }</p>
                  </div>
                  <div class="reactions">
                    <a href="./comments.html">
                      <img src="./Images/ei_comment.png" alt="comment">
                    </a>
                    <img src="./Images/iconamoon_like-thin.png" alt="like">
                  </div>
                </div>
                  `;
  
                  // If comment.postPic exists, append the image to commentContent
                  if (like.commentPic) {
                    commentContent = `
                    <div class="home">
                    <div class="profilePic">
                      <div> <img src="${user.profilePic}" alt=""> </div>
                      <div class="profileName">
                        <h5>${user.name}</h5>
                        <p>@${user.username}</p>
                      </div>
                    </div>
                    <div class="postContent">
                      <img src="${like.commentPic}" alt="">
                      <p>${like.commentText}</p>
                    </div>
                    <div class="reactions">
                      <a href="./comments.html">
                        <img src="./Images/ei_comment.png" alt="comment">
                      </a>
                      <img src="./Images/iconamoon_like-thin.png" alt="like">
                    </div>
                  </div>
                    `;
                  }
  
                  // Set the comment content
                  commentElement.innerHTML = commentContent;
  
                  // Append the commentElement to postContainer
                  postContainer.appendChild(commentElement);
                  
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          });
        } else {
          console.error('No comments found in the response data.');
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  });


 // Function to toggle the follow/unfollow state
function toggleFollowState(button, personId) {
  // Check if the button contains "Follow" or "Unfollow"
  const isFollow = button.textContent === "Follow";

  // Create the URL based on the state (follow or unfollow)
  const followUrl = isFollow
    ? `http://localhost:5000/follow/follow/${userId}/${personId}`
    : `http://localhost:5000/follow/unfollow/${userId}/${personId}`;

  // Create the request method based on the state (POST for follow, DELETE for unfollow)
  const method = isFollow ? "POST" : "DELETE";

  axios({
    method: method,
    url: followUrl,
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.data) {
        // Toggle the button text and style
        button.textContent = isFollow ? "Unfollow" : "Follow";
        button.classList.toggle("unfollowBtn");
      }
    })
    .catch((error) => {
      console.error("Error toggling follow state:", error);
    });
}



// Add an event listener to the "Followers" button
followersBtn.addEventListener("click", function () {
  const followersTable = document.querySelector('.followersContainer ');

  // Clear any existing data in the table
  followersTable.innerHTML = "";

  postsContainer.style.display = "none";
  commentsContainer.style.display = "none";
  likesContainer.style.display = "none";
  followersTable.style.display = "block";
  followingTable.style.display = "none";

  // Make an HTTP GET request to the server endpoint
  const userId = localStorage.id; // Replace with the actual user ID
  const token = localStorage.token;

  axios
    .get(`http://localhost:5000/follow/yourfollowers/${userId}`, {
      headers: {
        token: token,
      },
    })
    .then((response) => {
      console.log(response);
      const followersData = response.data;

      // Iterate through the followersData and create HTML elements
      followersData.forEach((follower) => {
        const post = document.createElement("div");
        post.classList.add("post");
        post.innerHTML = `
                <tr>
                    <td><img src="${follower.profilePic}" alt="" style="height: 10vh; width: 10vh; border-radius: 100%;"></td>
                    <td>${follower.name}</td>
                    <td>@${follower.username}</td>
                    <button class="followBtn" data-person-id="${follower.id}"> Follow</button>
        `;

        // Append the post to the table
        followersTable.appendChild(post);

        // Add an event listener to the follow button for each follower
        const followButton = post.querySelector(".followBtn");
        followButton.addEventListener("click", () => {
          const personId = follower.id;
          toggleFollowState(followButton, personId);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching your followers:", error);
    });
});


  
followingBtn.addEventListener('click', () => {
    const followingTable = document.querySelector(' .followingContainer ');
  
  //   // Clear any existing data in the table
    followingTable.innerHTML = '';

    postsContainer.style.display = "none";
    commentsContainer.style.display = "none";
    likesContainer.style.display = "none";
    followersTable.style.display = "none";
    followingTable.style.display = "block";
  
  //   // Make an HTTP GET request to the server endpoint
    const userId = localStorage.id;
    const token = localStorage.token;
  
    axios
      .get(`http://localhost:5000/follow/personsyouarefollowing/${userId}`, {
        headers: {
          token: token,
        },
      })
      .then((response) => {
        console.log(response.data);
        const followingData = response.data;
        
        followingData.forEach((following) => {
          const raw = document.createElement('div');
          raw.classList.add("post");
          raw.innerHTML = `
            <td><img src="${following.profilePic}" alt="" style="height: 10vh; width: 10vh; border-radius: 100%;"></td>
            <td>${following.name}</td>
            <td>@${following.username}</td>
            <td><button type="submit" class="followBtn"data-person-id="${following.id}">Unfollow</button></td>

          `;
  
          followingTable.appendChild(raw);
           // Add an event listener to the follow button for each follower
        const followButton = raw.querySelector(".followBtn");
        followButton.addEventListener("click", () => {
          const personId = following.id;
          toggleFollowState(followButton, personId);
        });
        });
      })
      .catch((error) => {
        console.error('Error fetching your following:', error);
      });
  });
  

function toggleDeletePost(postId) {
  const userId = localStorage.id
    const token = localStorage.token;

    axios.delete(`http://localhost:5000/posts/deletepost/${userId}/${postId}`, {
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "token": token
        }
    })
        .then((response) => {
          console.log(postId, userId);

            console.log("Post deleted:", response.data);
            window.location.reload();
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
}


function toggleDeleteComment(postId, commentId) {
  const userId = localStorage.id
    const token = localStorage.token;

    axios.delete(`http://localhost:5000/comments/deletecomment/${userId}/${postId}/${commentId}`, {
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            token: token
        }
    })
        .then((response) => {
          console.log(postId, userId);

            console.log("Comment deleted:", response.data);
            window.location.reload();
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        });
}


function toggleUpdateComment(commentId) {
  // Get references to modal elements
  const modal = document.getElementById("updateCommentModal");
  const commentTextElement = modal.querySelector(".commentText");
  const commentPicElement = modal.querySelector('.commentPic')
  const errorMsgElement = modal.querySelector(".errorMsg");
  const updateCommentForm = modal.querySelector(".updateComment");

  // Open the modal
  modal.style.display = "block";

  // Add an event listener to the "Update Comment" form
  updateCommentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get the updated comment text
    const updatedCommentText = commentTextElement.value;
    const updatedCommentPic = commentPicElement.value

    // Send a POST request to update the comment
    const token = localStorage.token;

    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    };

    const updateData = {
      commentText: updatedCommentText,
      commentPic: updatedCommentPic
    };

    axios
      .post(`http://localhost:5000/comments/updatecomment/${commentId}`, updateData, axiosConfig)
      .then((response) => {
        console.log(response);
        console.log('Comment updated successfully:', response.data);

        modal.style.display = "none";

      })
      .catch((error) => {
        console.error('Error updating the comment:', error);
        errorMsgElement.innerText = "Error updating the comment. Please try again.";
      });
  });
}


function toggleUpdatePost(postId) {
  // Get references to modal elements
  const modal = document.getElementById("updatePostModal");
  const postTextElement = modal.querySelector(".postName");
  const postPicElement = modal.querySelector('.postPic')
  const errorMsgElement = modal.querySelector(".errorMsg");
  const updatePost = modal.querySelector(".updatePost");

  // Open the modal
  modal.style.display = "block";

  // Add an event listener to the "Update post" form
  updatePost.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get the updated post text
    const updatedpostText = postTextElement.value;
    const updatedpostPic = postPicElement.value

    // Send a POST request to update the post
    const token = localStorage.token;

    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        token: token,
      },
    };

    const updateData = {
      postName: updatedpostText,
      postPic: updatedpostPic
    };

    axios
      .post(`http://localhost:5000/posts/updatepost/${postId}`, updateData, axiosConfig)
      .then((response) => {
        console.log(response);
        console.log('post updated successfully:', response.data);

        modal.style.display = "none";

      })
      .catch((error) => {
        console.error('Error updating the post:', error);
        errorMsgElement.innerText = "Error updating the post. Please try again.";
      });
  });
}



})
