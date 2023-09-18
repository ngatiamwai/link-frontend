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
const ownersPostId = localStorage.ownersPostId;
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
                    .post(`http://localhost:5000/user/oneUser/${ownersPostId}`)
                    .then((userResponse) => {
                        const user = userResponse.data.user;
                        console.log(user);
                        // Create HTML elements for the post and user information
                        const postElement = document.createElement('div');
                        postElement.classList.add('post');
                        const res = response.data;
                        const post = (res.post)[0]

                        console.log(post);

                        const updatedAt = new Date(post.updated_at);

                        // Format the time and date strings
                        const timeString = updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        const dateString = updatedAt.toLocaleDateString();
                        

                        // Create the post content without the image if post.postPic is not available
                        let postContent = `
              <div class="home">
                <div class="profilePic">
                  <div> <img src="${user.profilePic}" alt=""> </div>
                  <div class="profileName">
                    <h5>${user.name}</h5>
                    <p>@${user.username}</p>
                  </div>
                  <div class="profileName" >
                    <div style="font-size:8px; color: rgba(0, 0, 0, 0.5) ">${timeString} </div>
                    <div style="font-size:8px; color: rgba(0, 0, 0, 0.5) ">${dateString}</div>
                    </div>
                </div>
                
                <div class="postContent">
                  <p>${post.postName}</p>
                </div>
                <div class="reactions">
                ${post.numComments}
                  <a href="#" class="commentLink" data-post-id="${post.postId}">
                    <img src="./Images/ei_comment.png" alt="comment">
                    </a>
                    ${post.numLikes}
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
                    <div class="profileName" >
                    <div style="font-size:8px; color: rgba(0, 0, 0, 0.5) ">${timeString} </div>
                    <div style="font-size:8px; color: rgba(0, 0, 0, 0.5) ">${dateString}</div>
                    </div>
                  </div>
                  <div class="postContent">
                    <img src="${post.postPic}" alt="">
                    <p>${post.postName}</p>
                  </div>
                  <div class="reactions">
                  ${post.numComments}
                    <a href="#" class="commentLink" data-post-id="${post.postId}">
                    <img src="./Images/ei_comment.png" alt="comment">
                    </a>
                    ${post.numLikes}
                    <img src="./Images/iconamoon_like-thin.png" alt="like">
                  </div>
                </div>
              `;
                        }
                             // Assuming you have the user's profile image URL stored in a variable, e.g., userProfileImageUrl
const userProfileImageUrl = `${user.profilePic}`;

// Get a reference to the img element by its class name
const navImageElement = document.querySelector('.navImage');

// Set the src attribute of the img element to the user's profile image URL
navImageElement.src = userProfileImageUrl;

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

let uploadImageUrl = ''

commentPic.addEventListener('change', (event) => {
    const target = event.target
    const files = target.files
    if (files) {
        const formData = new FormData()
        formData.append("file", files[0])
        formData.append("upload_preset", "Shoppie")
        formData.append("cloud_name", "dhgs8thzx")

        fetch('https://api.cloudinary.com/v1_1/dhgs8thzx/image/upload', {
            method: 'POST',
            body: formData
        }).then((res) => res.json()).then(res => uploadImageUrl = res.url)
    }
})


registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let comment =
        commentText.value !== "" && uploadImageUrl
        
    if (comment) {
        axios
            .post(`http://localhost:5000/comments/comment/${userId}/${postId}`,
                {
                    commentText: commentText.value,
                    commentPic: uploadImageUrl
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
                      }, 1000);
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
                      }, 1000);
                    }
                    window.location.reload();
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
      const noComments = allPostsComments.length
      console.log(noComments);


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
if (allPostsComments.commentPic) {
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
        <img src="${allPostsComments.commentPic}" alt="">
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


  // Check if the user is authenticated
function isAuthenticated() {
  const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
  return !!token; // Return true if the token exists, false otherwise
}

// Redirect to login page if not authenticated
function redirectToLogin() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

// Logout function
function logout() {
  // Clear authentication data (e.g., token, user information)
  localStorage.removeItem('token');
  // Redirect to the login page
  window.location.href = 'login.html';
}

// Add an event listener to the Logout button
const logoutButton = document.getElementById('logoutButton');
if (logoutButton) {
  logoutButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default link behavior
    logout();
  });
}

// Call redirectToLogin on pages that require authentication
redirectToLogin();