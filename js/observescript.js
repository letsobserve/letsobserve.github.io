const tags = ["Observation", "Blog", "Media", "Nature", "Food", "Dreams"];

function setThemeFromCookie() {
	const themeState = document.getElementById("allBody");
	themeState.className = isThemeSelected() ? "light-mode" : "dark-mode";
}

function setThemeSwitchState() {
	document.getElementById("toggleTheme").checked = isThemeSelected();
}

function isThemeSelected() {
	return document.cookie.match(/theme=dark/i) != null;
}

function toggleTheme() {
	const themeState = document.getElementById("allBody");
	const currentState = themeState.classList;
	const newState = themeState.classList == "light-mode" ? "light-mode" : "dark-mode";
	const column = document.getElementsByClassName("column");
	var btn = document.getElementById("toggleTheme");
	var sun = document.getElementById("themeImageSun");
	var moon = document.getElementById("themeImageMoon");

	themeState.className = newState;
	document.cookie = "theme=" + (newState == "light-mode" ? "dark" : "light");

	if (btn.checked) {
		moon.style.opacity = "1";
		sun.style.opacity = "0";
		document.getElementById("allBody").classList.toggle("dark-mode");
		document.getElementById("allBody").classList.toggle("light-mode");
		for (i = 0; i < column.length; i++) {
			column[i].style.borderColor = "var(--main-darkgrey)";
		}
	}
	else {
		sun.style.opacity = "1";
		moon.style.opacity = "0";
		document.getElementById("allBody").classList.toggle("light-mode");
		document.getElementById("allBody").classList.toggle("dark-mode");
		for (i = 0; i < column.length; i++) {
			column[i].style.borderColor = "var(--alt-darkgrey)";
		}
	}
}

(function() {
	setThemeFromCookie();
	setThemeSwitchState();
	document.getElementById("toggleTheme").onchange = toggleTheme();
}) ();

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
