// Fetch all posts
axios
  .get('http://localhost:5000/posts/allPosts')
  .then((response) => {
    if (response.data) {
      let posts = response.data;

      if (!Array.isArray(posts) && response.data.posts) {
        posts = response.data.posts;
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

              // Create a unique container for each post with postId as the identifier
              postElement.dataset.postId = post.postId;

              // Create the post content without the image if post.postPic is not available
              let postContent = `
                <div class="home">
                  <div class="profilePic">
                    <div> <img src="${user.profilePic}" alt=""> </div>
                    <div class="profileName">
                    <h5><a href="./anotherUsersAcount.html?id=${user.id}" class="userAccountBtn">${user.name}</a></h5>
                    <p>@${user.username}</p>
                    </div>
                  </div>
                  <div class="postContent">
                    <p>${post.postName}</p>
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
              if (post.postPic) {
                postContent = `
                  <div class="home">
                    <div class="profilePic">
                      <div> <img src="${user.profilePic}" alt=""> </div>
                      <div class="profileName">
                      <h5><a href="./anotherUsersAcount.html?id=${user.id}" class="userAccountBtn">${user.name}</a></h5>
                      <p>@${user.username}</p>
                      </div>
                    </div>
                    <div class="postContent">
                      <img src="${post.postPic}" alt="">
                      <p>${post.postName}</p>
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
              const postContainer = postSection.querySelector('.postContainer');

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

// Send a GET request to fetch persons to follow
const userId = localStorage.id;
const token = localStorage.token;

// Function to toggle the follow/unfollow state
function toggleFollowState(button, personId) {
  // Check if the user is logged in (has a valid token)
  if (!token) {
    // You can display a message to prompt the user to log in
    alert('Please log in to follow users.');
    return;
  }

  // Check if the button contains "Follow" or "Unfollow"
  const isFollow = button.textContent == "Follow";

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

// Send a GET request to fetch persons to follow
axios
  .get(`http://localhost:5000/follow/personstofollow/${userId}`, {
    headers: {
      token: token,
    },
  })
  .then((response) => {
    if (response.data) {
      const personsToFollow = response.data; // Assuming it's an array of persons

      // Find the container where you want to append the persons to follow
      const container = document.querySelector('.personsToFollowContainer'); // Replace with the actual container's class or ID

      // Iterate through each person to follow and create HTML elements
      personsToFollow.forEach((person) => {
        // Create a post element for each person
        const postElement = document.createElement('div');
        postElement.classList.add('post');

        // Create the post content
        const postContent = `
          <div class="home">
            <div class="profilePic">
              <div><img src="${person.profilePic}" alt=""></div>
              <div class="profileName">
              <h5><a href="./anotherUsersAcount.html?id=${person.id}" class="userAccountBtn">${person.name}</a></h5>
              <p>@${person.username}</p>
              </div>
              <button type="button" class="followBtn" data-person-id="${person.id}">Follow</button>
            </div>
          </div>
        `;

        // Set the post content
        postElement.innerHTML = postContent;

        // Append the postElement to the container
        container.appendChild(postElement);

        // Add an event listener to the follow button
        const followButton = postElement.querySelector('.followBtn');
        followButton.addEventListener('click', () => {
          const personId = followButton.getAttribute('data-person-id');
          toggleFollowState(followButton, personId);
        });
      });
    } else {
      console.error('No persons to follow found in the response data.');
    }
  })
  .catch((error) => {
    console.error('Error fetching persons to follow:', error);
  });
