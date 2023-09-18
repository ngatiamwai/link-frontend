// Function to like a post
const token = localStorage.token
const userId = localStorage.userId
const postId = localStorage.postId
// Function to update the like status of a post


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
              postElement.dataset.id = user.id;

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
                    <h5><a href="./anotherUsersAcount.html?id=${user.id}" class="userAccountBtn">${user.name}</a></h5>
                    <p>@${user.username}</p>
                    </div>
                    <div class="profileName" >
                    <div style="font-size:8px; color: rgba(0, 0, 0, 0.5) ">${timeString} </div>
                    <div style="font-size:8px; color: rgba(0, 0, 0, 0.5) ">${dateString}</div>
                    </div>
                  </div>
                  
                  <div class="postContent">
<p class="postName">${post.postName}</p>
                  </div>
                  <div class="reactions">
                  ${post.numComments}
                    <a href="#" class="commentLink"> <!-- Use "#" as a placeholder -->
                      <img src="./Images/ei_comment.png" alt="comment">
                    </a>
                    ${post.numLikes}
                    <a href="#"  class = numLikes>
                    <img src="./Images/iconamoon_like-thin.png" alt="like" class = "like" class="unlike" data-postId="${post.postId}">
                    </a>
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
                      <div class="profileName" >
                    <div style="font-size:8px; color: rgba(0, 0, 0, 0.5) ">${timeString} </div>
                    <div style="font-size:8px; color: rgba(0, 0, 0, 0.5) ">${dateString}</div>
                    </div>
                    </div>
                    <div class="postContent">
                      <img src="${post.postPic}" alt="">
                      <p class="postName">${post.postName}</p>
                    </div>
                    <div class="reactions">
                    ${post.numComments}
                      <a href="#" class="commentLink"> <!-- Use "#" as a placeholder -->
                        <img src="./Images/ei_comment.png" alt="comment">
                      </a>
                      ${post.numLikes}
                      <a href="#"  class = numLikes>
                    <img src="./Images/iconamoon_like-thin.png" alt="like" class = "like"  class="unlike" data-postId="${post.postId}">
                    </a>
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

              // Add an event listener to the comment link
              const commentLink = postElement.querySelector('.commentLink');
              commentLink.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent the default link behavior

                // Get the postId from the parent postElement's dataset
                const clickedPostId = postElement.dataset.postId;
                const clickedOwnerPost = postElement.dataset.id


                // Store the postId in local storage
                localStorage.setItem('postId', clickedPostId);
                localStorage.setItem('ownersPostId', clickedOwnerPost)

                // Redirect to the comments.html page
                window.location.href = './comments.html';
              });
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    } else {
      console.error('No posts found in the response data.');
    }
  })
  .catch((error) => {
    console.error('Error fetching posts:', error);
  });



// Function to toggle the follow/unfollow state
function toggleFollowState(button, personId) {

 const userId = localStorage.id
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


// Add an event listener to handle liking when the "like" element is clicked
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('like')) {
    // Find the parent element of the clicked "like" button
    const postElement = e.target.closest('.post');

    // Check if the parent post element exists and has a postId
    if (postElement && postElement.dataset.postId) {
      const postId = postElement.dataset.postId;

      // Call the likePost function to like the post
      likePost(postId);
      
    }
  }else{
    const postElement  = e.target.closest('.post')
    if(postElement && postElement.dataset.postId){
      const postId = postElement.dataset.postId

      unlikePost(postId)
    }
  }
});

// Function to like a post
function likePost(postId) {
  const userId = localStorage.id;
  const token = localStorage.token;

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  };

  axios.get(`http://localhost:5000/like/likepost/${userId}/${postId}`, axiosConfig)
    .then((response) => {
      console.log('Post liked successfully:', response.data);
      window.location.reload();
    })
    .catch((error) => {
      console.error('Error liking the post:', error);
    });
}


// Function to like a post
function unlikePost(postId) {
  const userId = localStorage.id;
  const token = localStorage.token;

  const axiosConfig = {
    headers: {
      'Content-Type': 'application/json',
      token: token,
    },
  };

  axios.delete(`http://localhost:5000/like/unlikepost/${userId}/${postId}`, axiosConfig)
    .then((response) => {
      console.log('Post unliked successfully:', response.data);

    })
    .catch((error) => {
      console.error('Error unliking the post:', error);
    });
}


function myFunction() {
  var input, filter, ul, productItems, p, i, txtValue;
  input = document.querySelector('.search');
  filter = input.value.toUpperCase();
  ul = document.querySelector('.postContainer'); // Update to select the post container
  productItems = ul.querySelectorAll('.home'); // Update to select individual posts
  const searchResultsContainer = document.querySelector('.search-results'); // Get search results container

  // Clear the previous search results
  searchResultsContainer.innerHTML = '';

  for (i = 0; i < productItems.length; i++) {
    p = productItems[i].querySelector('.postContent p'); // Update the selector for the <p> element
    txtValue = p.textContent || p.innerText;

    if (txtValue.toUpperCase().includes(filter)) {
      // Clone the matching post and append it to search results
      const matchingPost = productItems[i].cloneNode(true);
      searchResultsContainer.appendChild(matchingPost);
      matchingPost.style.display = 'block'; // Show the matching post in the search results container
    } else {
      productItems[i].style.display = 'none'; // Hide non-matching posts in the original container
    }
  }

  // Display the search results container at the top or in a modal
  // You can add your logic here to show the results where you prefer
  // Example: displayResultsInModal(searchResultsContainer);
}

// Function to display search results in a modal
function displayResultsInModal(resultsContainer) {
  // Get the modal and open it
  const modal = document.getElementById('searchModal');
  modal.style.display = 'block';

  // Clear any previous results in the modal
  modal.querySelector('.search-results').innerHTML = '';

  // Append the search results container to the modal content
  modal.querySelector('.modal-content').appendChild(resultsContainer);
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById('searchModal');
  modal.style.display = 'none';

  // Clear the modal content
  modal.querySelector('.search-results').innerHTML = '';
}

// Add an event listener to close the modal when clicking outside of it
window.addEventListener('click', (event) => {
  const modal = document.getElementById('searchModal');
  if (event.target === modal) {
    closeModal();
  }
});










