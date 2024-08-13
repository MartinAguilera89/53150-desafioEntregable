import io from "socket.io-client";

const socket = io();

const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messageLogs = document.getElementById("messageLogs");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (message) {
    socket.emit("message", { user: "Anonymous", message });
    messageInput.value = "";
  }
});

socket.on("messageLogs", (messages) => {
  messageLogs.innerHTML = "";
  messages.forEach((msg) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${msg.user}: ${msg.message}`;
    messageLogs.appendChild(messageElement);
  });
});
