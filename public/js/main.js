const chatForm = document.querySelector("#chat-form");
const chatMessage = document.querySelector(".chat-messages");
const socket = io();

//
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("joinRoom", { username, room });

socket.on("message", (message) => {
  outputMessage(message);
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage({ username, text, time }) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${username}<span>${time}</span></p>
  <p class="text">${text}</>`;
  document.querySelector(".chat-messages").appendChild(div);
}
