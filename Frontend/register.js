//Register
const registerForm = document.querySelector(".registerForm")
const name = document.querySelector(".name")
const userName = document.querySelector(".userName")
const email = document.querySelector(".email")
const phoneNumber = document.querySelector(".phoneNumber")
const password = document.querySelector(".password")
const errorMsg = document.querySelector(".errorMsg")

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let user =
        name.value !== "" &&
        userName.value !== "" &&
        email.value !== "" &&
        phoneNumber.value !== "" &&
        password.value !== "";

    if (user) {
        axios
            .post("http://localhost:5000/user/register",
                {
                    name: name.value,
                    username: userName.value,
                    email: email.value,
                    phone_number: phoneNumber.value,
                    password: password.value
                },
                {
                    headers: {
                        Accept: 'application/json',
                        "Content-Type": "application/json"
                    },
                })
            .then((response) => {
                registerForm.reset()
                console.log(response.data);
                if (response.data.message === 'User registered successfully') {
                    const errorMsgElement = document.querySelector('.errorMsg');

                    if (errorMsgElement) {
                        errorMsgElement.textContent = response.data.message;
                        errorMsgElement.classList.remove('error');
                        errorMsgElement.classList.add('success');

                        setTimeout(() => {
                            window.location.href = '/login.html';
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
            })
    }
})