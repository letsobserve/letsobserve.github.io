const tags = ["Observation", "Blog", "Media", "Nature", "Food", "Dreams"];

function mediaModalFn(element) {
	var modal = document.getElementById("mediaModal");
	var modalImg = document.getElementById("mediaModalImg");
	var alttext = document.getElementById("mediaModalP1");
	modal.style.display = "flex";
	modalImg.src = element.src;
	alttext.innerHTML = element.alt;
}

function closeMediaModal() {
	var modal = document.getElementById("mediaModal");
	modal.style.display = "none";
}

function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

function themeFunction() {
	const navButton = document.getElementsByClassName("navbutton");
	const navbar = document.getElementsByClassName("navbar");
	const footer = document.getElementsByClassName("footer");
	const buttonHover = document.getElementsByClassName("navbutton:hover");
	var button = document.getElementById("themeCheckbox");
	var body = document.body;

	if (button.checked) {
		body.style.backgroundImage = "linear-gradient(var(--alt-lightgrey),var(--alt-darkgrey))";
		body.style.color = "var(--alt-text)";
		body.style.borderBottomColor = "var(--alt-text)";
		navbar[0].style.backgroundColor = "var(--alt-darkgrey)";
		footer[0].style.backgroundImage = "linear-gradient(var(--main-lightgrey),transparent)";
		for (var i = 0; i < navButton.length; i++) {
			navButton[i].style.color = "var(--alt-text)";
			navButton[i].style.backgroundColor = "var(--alt-darkgrey)";
			navButton[i].style.borderColor = "var(--alt-grey)";
		}
	}
	else {
		body.style.backgroundImage = "linear-gradient(var(--main-darkgrey),rgb(10,10,10))";
		body.style.color = "white";
		body.style.borderBottomColor = "var(--main-text)";
		navbar[0].style.backgroundColor = "var(--main-darkgrey)";
		footer[0].style.backgroundImage = "linear-gradient(var(--main-darkgrey),transparent)";
		for (var i = 0; i < navButton.length; i++) {
			navButton[i].style.color = "var(--main-text)";
			navButton[i].style.backgroundColor = "var(--main-darkgrey)";
			navButton[i].style.borderColor = "var(--main-grey)";
		}
	}
}
