document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-button');
    const setInstructionButton = document.getElementById('set-instruction-button');

    // Function to simulate user input and fetch the bot's response
    function sendDefaultMessage() {
        const defaultMessage = "list the point after 'Read before you response...' in italic bulletpoints with title 'Custom instructions', create another title for 'Notice'"; // Set your default message here
        addMessage(defaultMessage, true); // Display the default message
        sendButton.disabled = true;
        sendButton.textContent = 'Sending...';
        // Send a POST request to the /clear_chat route
        fetch('/clear_chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => {
                // Clear the chatMessages container on successful response
                while (chatMessages.firstChild) {
                    chatMessages.removeChild(chatMessages.firstChild);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });

        // Simulate sending the default message to the bot
        fetch('/process_user_input', {
            method: 'POST',
            body: JSON.stringify({ message: defaultMessage }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server (data)
                const chatbotResponse = data.response;
                addMessage(chatbotResponse, false);
            })
            .catch(error => {
                console.error('Error:', error);
            }).finally(() => {
                // Enable the send button after the response is received or if there's an error
                sendButton.disabled = false;
                sendButton.textContent = 'Send';
                // Clear the input field
                userMessageInput.value = '';
            });

    }

    // Send and display the default message when the page loads
    sendDefaultMessage();

    // Function to add a message to the chat window
    function addMessage(message, isUser) {
        // console.log('add:', 'aaa');
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'user-message' : 'chatbot-message';
        if (!isUser) {
            messageDiv.innerHTML = marked.parse(message);
            // console.log('marked:', message)
            // console.log('marked2:', messageDiv.innerHTML)
        }
        else {
            messageDiv.textContent = message;
        }

        chatMessages.appendChild(messageDiv);

        // Scroll to the bottom of the chat window
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to handle the Enter key press
    function handleEnterKeyPress(event) {
        if (event.key === 'Enter' && !event.shiftKey && !sendButton.disabled) {
            event.preventDefault();
            sendButton.click(); // Trigger the button's click event
        }
    }

    // Add an event listener to the input field to call the function on key press
    userMessageInput.addEventListener('keydown', handleEnterKeyPress);
    // Event listener for the send button
    sendButton.addEventListener('click', () => {
        const userMessage = userMessageInput.value;
        // Disable the send button
        sendButton.disabled = true;
        sendButton.textContent = 'Sending...';
        // Add user's message to the chat
        // console.log('Sending request:', userMessage);
        addMessage(userMessage, true);
        fetch('/process_user_input', {
            method: 'POST',
            body: JSON.stringify({ message: userMessage }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Handle the response from the server (data)
                const chatbotResponse = data.response;
                addMessage(chatbotResponse, false);
            })
            .catch(error => {
                console.error('Error:', error);
            })

            .finally(() => {
                // Enable the send button after the response is received or if there's an error
                sendButton.disabled = false;
                sendButton.textContent = 'Send';
                // Clear the input field
                userMessageInput.value = '';
            });

    });
    clearButton.addEventListener('click', () => {
        // Send a POST request to the /clear_chat route
        fetch('/clear_chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .then(data => {
                // Clear the chatMessages container on successful response
                while (chatMessages.firstChild) {
                    chatMessages.removeChild(chatMessages.firstChild);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });


    // JavaScript for opening and closing the custom instructions pop-up
    const openPopupButton = document.getElementById('open-popup-button');
    const popup = document.getElementById('custom-instructions-popup');
    const popupCloseButton = document.getElementById('popup-close-button');

    openPopupButton.addEventListener('click', () => {
        popup.style.display = 'block';
    });

    popupCloseButton.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    // Function to send custom instructions to the server
    function sendCustomInstructions(instructions) {
        fetch('/set_custom_instructions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ instructions: instructions })
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error:', error);
            });
    }
    // JavaScript for handling custom instructions submission
    const customInstructionInput = document.getElementById('custom-instruction-input');
    const customInstructionButton = document.getElementById('custom-instruction-button');

    customInstructionButton.addEventListener('click', () => {
        const customInstruction = customInstructionInput.value;
        // Send the custom instruction to the server
        sendCustomInstructions(customInstruction);
        customInstructionInput.value = ''; // Clear the input field
        popup.style.display = 'none'; // Close the pop-up
    });


    setInstructionButton.addEventListener('click', () => {
        fetch('/use_instruction_from_txt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
            .then(response => response.json())
            .catch(error => {
                console.error('Error:', error);
            });
        location.reload();
    });
});
