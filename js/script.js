const lightModeToggle = document.querySelector("#toggleTheme");
const column = document.getElementsByClassName("column");

let lightMode = localStorage.getItem("lightMode");
let btn = document.getElementById("toggleTheme");
let sun = document.getElementById("themeImageSun");
let moon = document.getElementById("themeImageMoon");

// if it's disabled, turn it on
const enableLightMode = () => {
	// 1. add the class darkmode to the body
	document.body.classList.add("light-mode");
	lightModeToggle.checked = true;
	sun.style.opacity = "1";
	moon.style.opacity = "0";
	moon.style.left = "32px";
	sun.style.left = "0";
	for (i = 0; i < column.length; i++) {
		column[i].style.borderColor = "var(--alt-darkgrey)";
	}
	//2. update lightmode in the localStorage
	localStorage.setItem("lightMode", "enabled");
};

// if it's enabled, turn it off
const disableLightMode = () => {
	// 1. remove the class darkmode from the body
	document.body.classList.remove("light-mode");
	lightModeToggle.checked = false;
	moon.style.opacity = "1";
	sun.style.opacity = "0";
	sun.style.left = "-32px";
	moon.style.left = "0";
	for (i = 0; i < column.length; i++) {
		column[i].style.borderColor = "var(--main-darkgrey)";
	}
	// 2. update lightmode in the localStorage
	localStorage.setItem("lightMode", null);
};

// check if lightmode is enabled
if (lightMode === "enabled") {
	enableLightMode();
};

// toggle darkmode
lightModeToggle.addEventListener("click", () => {
	lightMode = localStorage.getItem("lightMode");
	if (lightMode !== "enabled") {
		enableLightMode();
	} else {
		disableLightMode();
	}
});

// populate media modal
function mediaModalFn(element) {
	var modal = document.getElementById("mediaModal");
	var modalImg = document.getElementById("mediaModalImg");
	var alttext = document.getElementById("mediaModalP1");
	modal.style.display = "flex";
	modalImg.src = element.src;
	alttext.innerHTML = element.alt;
}

// close media modal
function closeMediaModal() {
	var modal = document.getElementById("mediaModal");
	modal.style.display = "none";
}

// scroll to the top of the page
function topFunction() {
	window.scroll({
		top: 0,
		behavior: "smooth"
	});
}
