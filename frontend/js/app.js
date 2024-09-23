document.addEventListener('DOMContentLoaded', () => {
    console.log("Frontend is ready!");

    // Toggle between register and login sections
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    const registerSection = document.getElementById('register-section');
    const loginSection = document.getElementById('login-section');
    const profileSection = document.getElementById('profile-section');
    const deleteMessage = document.getElementById('delete-message');

    registerLink.addEventListener('click', () => {
        registerSection.style.display = 'block';
        loginSection.style.display = 'none';
        profileSection.style.display = 'none';
        deleteMessage.textContent = ''; // Clear any previous messages
    });

    loginLink.addEventListener('click', () => {
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
        profileSection.style.display = 'none';
        deleteMessage.textContent = ''; // Clear any previous messages
    });

    // Initially show register section
    registerSection.style.display = 'block';
    loginSection.style.display = 'none';
    // profileSection.style.display = 'none';

    // Handle registration form submission
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log("Register form submitted");
        
        const formData = {
            username: registerForm.username.value,
            email: registerForm.email.value,
            password: registerForm.password.value,
        };

        const response = await fetch('https://authen-api-j9n4.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        
        console.log("Response status:", response.status); // Log the status code
        const responseBody = await response.json();
        console.log("Response body:", responseBody); // Log the response body

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);

            if (errorData.detail === "Username already exists.") {
                alert("This username or password is already taken. Please choose another one.");
            } else {
                alert(errorData.detail || "An error occurred");
            }
        }
    });

    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            username: loginForm.username.value,
            password: loginForm.password.value,
        };

        const response = await fetch('https://authen-api-j9n4.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);
            alert(errorData.detail || "An error occurred");
        } else {
            const result = await response.json();
            alert("Welcome Back! " + result.message);
            if (result.access_token) {
                // console.log("Access Token:", result.access_token);
                localStorage.setItem('access_token', result.access_token);
                profileSection.style.display = 'block';
                loginSection.style.display = 'none';
                registerSection.style.display = 'none';
                deleteMessage.textContent = ''; // Clear any previous messages
            }
        }
    });

    // document.getElementById('delete-account-button').addEventListener('click', async () => {
    //     const username = loginForm.username.value; // Make sure this value is correct
    //     const token = localStorage.getItem('access_token'); // Get the token from localStorage
    
    //     if (!username || !token) {
    //         alert("User is not logged in or no token found.");
    //         return;
    //     }
    
    //     try {
    //         const response = await fetch(`http://127.0.0.1:8000/delete_user/${username}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Authorization': `Bearer ${token}`,
    //             },
    //         });
    
    //         if (response.ok) {
    //             alert("Account deleted successfully!");
    //             localStorage.removeItem('access_token'); // Clear the token
    //             window.location.href = "registration.html"; // Redirect to the registration page
    //         } else {
    //             const errorData = await response.json();
    //             alert(errorData.detail || "An error occurred while deleting the account.");
    //         }
    //     } catch (error) {
    //         console.error("Error occurred while deleting account:", error);
    //         alert("Network error or server not responding.");
    //     }
    // });
    
    
});
