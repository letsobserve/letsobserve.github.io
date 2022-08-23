const lightModeToggle = document.querySelector("#toggleTheme");
const column = document.getElementsByClassName("column");
const siteMain = document.getElementById("site-main");

let lightMode = localStorage.getItem("lightMode");
let btn = document.getElementById("toggleTheme");
let sun = document.getElementById("themeImageSun");
let moon = document.getElementById("themeImageMoon");

// if it's disabled, turn it on
const enableLightMode = () => {
	// 1. add the class darkmode to the body
	document.body.classList.add("light-mode");
	siteMain.style.backgroundImage = "var(--alt-radialgradient)";
	lightModeToggle.checked = true;
	sun.style.opacity = "1";
	moon.style.opacity = "0";
	moon.style.left = "37px";
	sun.style.right = "0";
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
	siteMain.style.backgroundImage = "var(--main-radialgradient)";
	lightModeToggle.checked = false;
	moon.style.opacity = "1";
	sun.style.opacity = "0";
	sun.style.right = "37px";
	moon.style.left = "0";
	for (i = 0; i < column.length; i++) {
		column[i].style.borderColor = "var(--main-darkgrey)";
	}
	// 2. update lightmode in the localStorage
	localStorage.setItem("lightMode", null);
};

let cookie_consent = getCookie("user_cookie_consent");
let ytFrame = document.getElementById("latest-video");

if (cookie_consent != "") {
	document.getElementById("cookieNotice").style.display = "none";
	try {
		ytFrame.src = ytFrame.dataset.src;
	} catch {

	};
} else {
	document.getElementById("cookieNotice").style.display = "block";
};

// create a cookie
function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=None; Secure";
};
// delete a cookie
function deleteCookie(cname) {
	const d = new Date();
	d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=;" + expires + ";path=/";
};
// read a cookie
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(";");
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == " ") {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
};
// check for cookie consent
function acceptCookieConsent() {
	deleteCookie("user_cookie_consent");
	setCookie("user_cookie_consent", 1, 30);
	document.getElementById("cookieNotice").style.display = "none";
	try {
		ytFrame.src = ytFrame.dataset.src;
	} catch {
		console.log("doesnt exist");
	};
};
// close cookie consent notice
function closeCookieNotice() {
	document.getElementById("cookieNotice").style.display = "none";
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
};

// close media modal
function closeMediaModal() {
	var modal = document.getElementById("mediaModal");
	modal.style.display = "none";
};

// hide banner on scroll
window.addEventListener("scroll", (e) => {
	const banner = document.getElementById("banner");
	const header = document.getElementById("site-header");
	const title = document.getElementById("pageHeader");
	if (banner.dataset.transition == "true") {
		banner.style.opacity =
		(120 - Math.floor(window.pageYOffset)) + "%";
	} else {
		console.log(header.height);
		header.style.top = banner.height - 48 + "px";
		banner.style.position = "sticky";
		banner.style.top = "-1px";
	};
});

// scroll to the top of the page
function topFunction() {
	window.scroll({
		top: 0,
		behavior: "smooth"
	});
};
