// Select elements
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

// Button click event
sendBtn.addEventListener("click", sendMessage);

// Press Enter to send
userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

    let message = userInput.value.trim();
    if (message === "") return;

    // Show user message
    const userMsg = document.createElement("div");
    userMsg.classList.add("message", "user");
    userMsg.innerText = message;
    chatBox.appendChild(userMsg);

    // Clear input
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // Show loading message
    const loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "bot");
    loadingMsg.innerText = "Thinking...";
    chatBox.appendChild(loadingMsg);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // Call Flask backend
        const response = await fetch("http://127.0.0.1:5000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();

        // Replace loading text with real reply
        loadingMsg.innerText = data.reply;

    } catch (error) {
        loadingMsg.innerText = "Error connecting to server 😢";
        console.error(error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}