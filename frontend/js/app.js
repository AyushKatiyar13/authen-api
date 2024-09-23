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
    profileSection.style.display = 'none'; // Hide profile section initially

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

        try {
            const response = await fetch('https://authen-api-j9n4.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            console.log("Response status:", response.status); // Log the status code

            const responseBody = await response.json(); // Parse response body once
            console.log("Response body:", responseBody); // Log the response body

            if (!response.ok) {
                if (responseBody.detail === "Username already exists.") {
                    alert("This username is already taken. Please choose another one.");
                } else {
                    alert(responseBody.detail || "An error occurred during registration.");
                }
            } else {
                alert("Registration successful! Please verify your email.");
                registerForm.reset(); // Clear the form fields
            }
        } catch (error) {
            console.error("Error during registration:", error);
            alert("Network error or server not responding.");
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

        try {
            const response = await fetch('https://authen-api-j9n4.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json(); // Parse response once

            if (!response.ok) {
                console.error("Error response:", result);
                alert(result.detail || "An error occurred during login.");
            } else {
                alert("Welcome Back! " + result.message);
                if (result.access_token) {
                    localStorage.setItem('access_token', result.access_token);
                    profileSection.style.display = 'block';
                    loginSection.style.display = 'none';
                    registerSection.style.display = 'none';
                    deleteMessage.textContent = ''; // Clear any previous messages
                    loginForm.reset(); // Clear the form fields
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("Network error or server not responding.");
        }
    });

    // Handle delete account action
    document.getElementById('delete-account-button').addEventListener('click', async () => {
        const username = loginForm.username.value; // Make sure this value is correct
        const token = localStorage.getItem('access_token'); // Get the token from localStorage
    
        if (!username || !token) {
            alert("User is not logged in or no token found.");
            return;
        }
    
        try {
            const response = await fetch(`https://authen-api-j9n4.onrender.com/delete_user/${username}`, { // Correct API URL
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                alert("Account deleted successfully!");
                localStorage.removeItem('access_token'); // Clear the token
                window.location.href = "registration.html"; // Redirect to the registration page
            } else {
                const errorData = await response.json();
                alert(errorData.detail || "An error occurred while deleting the account.");
            }
        } catch (error) {
            console.error("Error occurred while deleting account:", error);
            alert("Network error or server not responding.");
        }
    });
});
