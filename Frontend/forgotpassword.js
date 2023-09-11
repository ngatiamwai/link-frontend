const enterEmail = document.querySelector(".enterEmail");
const registerForm = document.querySelector(".registerForm");
const errorMsg = document.querySelector(".errorMsg");


registerForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    let user = enterEmail.value !== ""

    if(user){
        axios
        .post("http://localhost:5000/reset/resetPassword",{
            email: enterEmail.value
        },
        {
            headers:{
                Accept: "application/json",
                "Content-Type": "application/json" 
            }
        })
        .then((response) => {
            registerForm.reset()
            console.log(response.data);
            if (response.data.message === 'Password reset initiated. Check your email for instructions.') {
                const errorMsgElement = document.querySelector('.errorMsg');

                if (errorMsgElement) {
                    errorMsgElement.textContent = response.data.message;
                    errorMsgElement.classList.remove('error');
                    errorMsgElement.classList.add('success');

                    setTimeout(() => {
                        window.location.href = '/newForgotPassword.html';
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
