const registerForm = document.querySelector(".registerForm");
const email = document.querySelector(".email");
const password = document.querySelector(".password");
const errMessage = document.querySelector('.errMessage');

let token = "";
let id = "";

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (email.value !== "" && password.value !== "") {
    axios
      .post(
        "http://localhost:5000/user/login",
        {
          email: email.value,
          password: password.value,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        id = response.data.id;
        localStorage.setItem("id", id);
        token = response.data.token;
        localStorage.setItem("token", token);
        console.log(response.data);
        localStorage.setItem('token', response.data.token);
        
        registerForm.reset()

        if (response.data.message === 'Logged in') {
          const errorMsgElement = document.querySelector('.errorMsg');

          if (errorMsgElement) {
            errorMsgElement.textContent = response.data.message;
            errorMsgElement.classList.remove('error');
            errorMsgElement.classList.add('success');

            setTimeout(() => {
              window.location.href = '/homeApp.html';
            }, 2000);
          }
        } else {
          // Display error message here
          const errorMsgElement = document.querySelector('.errorMsg');

          if (errorMsgElement) {
            errorMsgElement.textContent = response.data.message;
            errorMsgElement.classList.remove('success');
            errorMsgElement.classList.add('error');
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

        // Display error message for network errors or unexpected errors
                  const errorMsgElement = document.querySelector('.errorMsg');

        if (errorMsgElement) {
          errorMsgElement.textContent = error.response ? error.response.data.message : 'An error occurred.';
          errorMsgElement.classList.remove('success');
          errorMsgElement.classList.add('error');
        }
      });
  }
});
