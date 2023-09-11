// Add an event listener to handle image uploads
const uploadInput = document.getElementById('upload');
const imagePreview = document.getElementById('imagePreview');
uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.style.maxWidth = '100%';
            imgElement.style.height = 'auto';
            imagePreview.innerHTML = '';
            imagePreview.appendChild(imgElement);
        };
        reader.readAsDataURL(file);
    }
});


///The selected comment on the comment page
const userId = localStorage.id
const postId = localStorage.postId;
const token = localStorage.token;

if (postId) {
    const axiosConfig = {
        headers: {
            token: token, // Include the token in the request headers
        },
    };

    axios
        .get(`http://localhost:5000/posts/onepost/${postId}`, axiosConfig) // Pass the axiosConfig
        .then((response) => {
            if (response.data) {



                // Fetch user information for the post
                axios
                    .post(`http://localhost:5000/user/oneUser/${userId}`)
                    .then((userResponse) => {
                        const user = userResponse.data.user;
                        // Create HTML elements for the post and user information
                        const postElement = document.createElement('div');
                        postElement.classList.add('post');
                        const res = response.data;
                        const post = (res.post)[0]

                        console.log(post);

                        // Create the post content without the image if post.postPic is not available
                        let postContent = `
              <div class="home">
                <div class="profilePic">
                  <div> <img src="${user.profilePic}" alt=""> </div>
                  <div class="profileName">
                    <h5>${user.name}</h5>
                    <p>@${user.username}</p>
                  </div>
                </div>
                
                <div class="postContent">
                  <p>${post.postName}</p>
                </div>
                <div class="reactions">
                  <a href="#" class="commentLink" data-post-id="${post.postId}">
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
                  </div>
                  <div class="postContent">
                    <img src="${post.postPic}" alt="">
                    <p>${post.postName}</p>
                  </div>
                  <div class="reactions">
                    <a href="#" class="commentLink" data-post-id="${post.postId}">
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

                        // Add event listener to the comment link
                        const commentLink = postElement.querySelector('.commentLink');
                        commentLink.addEventListener('click', (e) => {
                            e.preventDefault(); // Prevent the default link behavior

                            // Get the postId from the data-post-id attribute
                            const clickedPostId = commentLink.getAttribute('data-post-id');

                            // Store the postId in local storage
                            localStorage.setItem('postId', clickedPostId);

                            // Redirect to the comments.html page
                            window.location.href = './comments.html';
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                console.error('No post found in the response data.');
            }
        })
        .catch((error) => {
            console.error('Error fetching the post:', error);
        });
} else {
    console.error('No postId found in the URL query parameters.');
}


//Comment on a post
const registerForm = document.querySelector(".registerForm")
const commentText = document.querySelector(".commentText")
const commentPic = document.querySelector(".commentPic")
const errorMsg = document.querySelector(".errorMsg")

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let comment =
        commentText.value !== ""
        
    if (comment) {
        axios
            .post(`http://localhost:5000/comments/comment/${userId}/${postId}`,
                {
                    commentText: commentText.value,
                },
                {
                    headers: {
                        Accept: 'application/json',
                        "Content-Type": "application/json",
                        token : token
                    },
                })
                .then((response) => {
                    registerForm.reset()
                    console.log(response.data);
                    const errorMsgElement = document.querySelector('.errorMsg');
                  
                    if (errorMsgElement) {
                      errorMsgElement.textContent = response.data.message;
                      
                      if (response.data.message === 'Comment uploaded successfully') {
                        errorMsgElement.classList.remove('error');
                        errorMsgElement.classList.add('success');
                      } else {
                        errorMsgElement.classList.remove('success');
                        errorMsgElement.classList.add('error');
                      }
                  
                      setTimeout(() => {
                        // Clear the message after 2 seconds
                        errorMsgElement.textContent = '';
                        errorMsgElement.classList.remove('success');
                        errorMsgElement.classList.remove('error');
                      }, 2000);
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                    const errorMsgElement = document.querySelector('.errorMsg');
                  
                    if (errorMsgElement) {
                      errorMsgElement.textContent = error.response ? error.response.data.error : 'An error occurred.';
                      errorMsgElement.classList.remove('success');
                      errorMsgElement.classList.add('error');
                  
                      setTimeout(() => {
                        // Clear the message after 2 seconds
                        errorMsgElement.textContent = '';
                        errorMsgElement.classList.remove('success');
                        errorMsgElement.classList.remove('error');
                      }, 2000);
                    }
                  })
            .catch((error) => {
                console.error(error);

                setTimeout(() => {
                    const errorMsgElement = document.querySelector('.errorMsg');

                    if (errorMsgElement) {
                        errorMsgElement.textContent = error.response ? error.response.data.error : 'An error occurred.';
                    }
                }, 2000);
            })
    }
})


////Fetch The post Comments
axios
  .get(`http://localhost:5000/comments/postscomments/${postId}`)
  .then((response) => {
    if (response.data) {
      let allPostsComments = response.data;

      if (!Array.isArray(allPostsComments) && response.data.allPostsComments) {
        allPostsComments = response.data.allPostsComments;
      }

      console.log(allPostsComments);
      // Iterate through each post and fetch user information
      allPostsComments.forEach((allPostsComments) => {
        if (allPostsComments.userId) {
          console.log(allPostsComments);
          axios.post(`http://localhost:5000/user/oneUser/${allPostsComments.userId}`)
            .then((response) => {
              console.log(response);

              const user = response.data.user;
              // Create HTML elements for the post and user information
              const postElement = document.createElement('div');
              postElement.classList.add('post');

              // Create a unique container for each post with postId as the identifier
              postElement.dataset.postId = allPostsComments.postId;

              // Create the post content without the image if post.postPic is not available
              let postContent = `
                <div class="home">
                  <div class="profilePic">
                    <div> <img src="${user.profilePic}" alt=""> </div>
                    <div class="profileName">
                      <h5>${user.name}</h5>
                      <p>@${user.username}</p>
                    </div>
                  </div>
                  <div class="postContent">
                    <p>${allPostsComments.commentText}</p>
                  </div>
                  <div class="reactions">
                    <a href="#" class="commentLink"> <!-- Use "#" as a placeholder -->
                      <img src="./Images/ei_comment.png" alt="comment">
                    </a>
                    <img src="./Images/iconamoon_like-thin.png" alt="like">
                  </div>
                </div>
              `;

              // If post.postPic exists, append the image to postContent
              if (allPostsComments.postPic) {
                postContent = `
                  <div class="home">
                    <div class="profilePic">
                      <div> <img src="${user.profilePic}" alt=""> </div>
                      <div class="profileName">
                        <h5>${user.name}</h5>
                        <p>@${user.username}</p>
                      </div>
                    </div>
                    <div class="postContent">
                      <img src="${allPostsComments.postPic}" alt="">
                      <p>${allPostsComments.commentText}</p>
                    </div>
                    <div class="reactions">
                      <a href="#" class="commentLink"> <!-- Use "#" as a placeholder -->
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
              const postContainer = postSection.querySelector('.commentContainer');

              // Append the postElement to postContainer
              postContainer.appendChild(postElement);

              // Add an event listener to the comment link
              const commentLink = postElement.querySelector('.commentLink');
              commentLink.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent the default link behavior

                // Get the postId from the parent postElement's dataset
                const clickedPostId = postElement.dataset.postId;

                // Store the postId in local storage
                localStorage.setItem('postId', clickedPostId);

                // Redirect to the comments.html page
                window.location.href = './comments.html';
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
