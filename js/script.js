const column = document.getElementsByClassName("column");
const siteMain = document.getElementById("site-main");
const banner = document.getElementById("banner");
const header = document.getElementById("site-header");
const title = document.getElementById("pageHeader");

let initalHeaderFontSize = parseFloat(window.getComputedStyle(title, null).getPropertyValue('font-size'));
let cookie_consent = getCookie("userCookieConsent");
let ytFrame = document.getElementById("latest-video");
if (cookie_consent != "") {
	document.getElementById("cookieNotice").style.display = "none";
} else {
	//document.getElementById("cookieNotice").style.display = "block";
};

// create a cookie
function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	let expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";";
	console.log(document.cookie);
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
	deleteCookie("userCookieConsent");
	//setCookie("userCookieConsent",1,30);
	document.cookie = "userCookieConsent=true";
	document.getElementById("cookieNotice").style.display = "none";
};
// close cookie consent notice
function closeCookieNotice() {
	document.getElementById("cookieNotice").style.display = "none";
};

// Light / Dark Mode Toggle Try
try {
	const lightModeToggle = document.querySelector("#toggleTheme");
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
	}
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
	}
	// check if lightmode is enabled
	if (lightMode === "enabled") {
		try {
			enableLightMode();
		} catch (e) {}
	}
	// toggle darkmode
	lightModeToggle.addEventListener("click", () => {
		lightMode = localStorage.getItem("lightMode");
		if (lightMode !== "enabled") {
			enableLightMode();
		} else {
			disableLightMode();
		}
	})
} catch (e) {}

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

// hide banner and header on scroll
window.addEventListener("scroll", (e) => {
	/*if (title.dataset.transition == "true") {
		// make header smaller as you scroll up to 50% original size
		var halfOriginalSize = initalHeaderFontSize / 2;
		var pageOffset = Math.floor(window.pageYOffset) - 100;
		title.style.fontSize = initalHeaderFontSize - pageOffset + "px";
		if (parseFloat(title.style.fontSize) < halfOriginalSize) title.style.fontSize = halfOriginalSize + "px";
		if (parseFloat(title.style.fontSize) > initalHeaderFontSize) title.style.fontSize = initalHeaderFontSize + "px";
	};*/
	if (banner.dataset.transition == "true") {
		banner.style.opacity = (120 - Math.floor(window.pageYOffset)) + "%";
	} else {
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
