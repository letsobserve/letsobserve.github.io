const commentForm = document.querySelector("#commentForm");
const userName = document.getElementById("commentAuthor");
const userComment = document.getElementById("commentContent");
const comments = document.getElementById("comments");

commentForm.addEventListener("submit", postComment);

function postComment(event) {
  event.preventDefault();

  comments.textContent += "\n";
  comments.textContent += userName.value;
  comments.textContent += "\n";
  comments.textContent += userComment.value;
};
