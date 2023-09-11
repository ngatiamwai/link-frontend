//pos

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
        }
        reader.readAsDataURL(file);
    }
});

const token = localStorage.token;
const registerForm = document.querySelector(".registerForm")
const uploadPost = document.querySelector(".uploadPost")
const uploadImage = document.querySelector(".uploadImage")
// const id = localStorage.getItem("id");
const userId = localStorage.getItem("id");

let uploadImageUrl = ''

uploadImage.addEventListener('change', (event) => {
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

const errorMsg = document.querySelector(".errorMsg")

registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (uploadPost.value !== "" && uploadImageUrl && userId) { // Check if userId is available
        axios
            .post(`http://localhost:5000/posts/upload/${userId}`,
                {
                    postName: uploadPost.value,
                    postPic: uploadImageUrl, 
                    userId: userId, 
                },
                {
                    headers: {
                        Accept: 'application/json',
                        "Content-Type": "application/json",
                        token: token,
                    },
                })
            .then((response) => {
                console.log(response.data.message);
                if (response.data.message === 'Post uploaded successfully') {
                    const errorMsgElement = document.querySelector('.errorMsg');
                    

                    if (errorMsgElement) {
                        errorMsgElement.textContent = response.data.message;
                        errorMsgElement.classList.remove('error');
                        errorMsgElement.classList.add('success');

                        setTimeout(() => {
                            window.location.href = '/homeApp.html';
                        }, 5000);
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