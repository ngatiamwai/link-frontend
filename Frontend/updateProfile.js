const uploadInput = document.getElementById('upload');
const previewImage = document.getElementById('previewImage');
uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

const token = localStorage.token;
const registerForm = document.querySelector(".registerForm");
const name = document.querySelector(".name");
const username = document.querySelector(".username");
const email = document.querySelector(".email");
const phoneNumber = document.querySelector(".phoneNumber");
const profilePic = document.querySelector(".profilePic");
const id = localStorage.getItem("id");

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Check if at least one field has been filled out
    if (name.value || username.value || email.value || phoneNumber.value || profilePic.files.length > 0) {
        if (profilePic.files.length > 0) {
            const formData = new FormData()
            formData.append("file", profilePic.files[0])
            formData.append("upload_preset", "Shoppie")
            formData.append("cloud_name", "dhgs8thzx")

            fetch('https://api.cloudinary.com/v1_1/dhgs8thzx/image/upload', {
                method: 'POST',
                body: formData
            })
            .then((res) => res.json())
            .then((res) => {
                const profileurl = res.url;

                // Send the user data along with the profile URL to the backend
                axios
                .put(`http://localhost:5000/user/update/${id}`, {
                    name: name.value,
                    username: username.value,
                    email: email.value,
                    phone_number: phoneNumber.value,
                    profilePic: profileurl,
                }, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        token: token,
                    },
                })
                .then((response) => {
                    registerForm.reset()
                    console.log(response.data);
                    if (response.data.message === 'Your details were updated successfully') {
                        const errorMsgElement = document.querySelector('.errorMsg');

                        if (errorMsgElement) {
                            errorMsgElement.textContent = response.data.message;
                            errorMsgElement.classList.remove('error');
                            errorMsgElement.classList.add('success');

                            setTimeout(() => {
                                window.location.href = '/account.html';
                            }, 2000);
                        }
                    }

                    setTimeout(() => {
                        const errorMsgElement = document.querySelector('.errorMsg');

                        if (errorMsgElement) {
                            errorMsgElement.textContent = '';
                            errorMsgElement.classList.remove('success');
                            errorMsgElement.classList.remove('error');
                        }
                    }, 2000);
                })
                .catch((error) => {
                    console.error(error);

                    setTimeout(() => {
                        const errorMsgElement = document.querySelector('.errorMsg');

                        if (errorMsgElement) {
                            errorMsgElement.textContent = error.response ? error.response.data.error : 'An error occurred.';
                        }
                    }, 2000);
                });
            })
            .catch((error) => {
                console.error('Error uploading profile picture:', error);
            });
        }
    } else {
        console.log("No fields to update.");
    }
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