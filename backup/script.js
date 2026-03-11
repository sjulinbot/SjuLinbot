const chatBox = document.getElementById("chat-box");

function addMessage(message, sender) {
  const msg = document.createElement("div");
  msg.className = sender;
  msg.innerText = message;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const userText = input.value.trim().toLowerCase();

  if (userText === "") return;

  addMessage(input.value, "user");
  input.value = "";

  setTimeout(() => {
    botReply(userText);
  }, 500);
}

function quickReply(type) {
  addMessage(type, "user");
  botReply(type);
}

function botReply(text) {
  let response = "Sorry, I didn't understand your question.";

  if (text.includes("hello") || text.includes("hi")) {
    response = "Hello 👋 How can I help you today?";
  }
  else if (text.includes("attendance")) {
    response = "Attendance details are available in the Student Portal under Academic Section.";
  }
  else if (text.includes("fees")) {
    response = "Fee payment and structure details can be found in the Fees section of the portal.";
  }
  else if (text.includes("result")) {
    response = "Results are published under Examination → Results on the university website.";
  }
  else if (text.includes("admission")) {
    response = "Admissions for 2026 are now open. Visit the Admissions page for eligibility and application form.";
  }
  else if (text.includes("contact")) {
    response = "You can contact the university office via email or phone listed on the Contact Us page.";
  }

  addMessage(response, "bot");
}