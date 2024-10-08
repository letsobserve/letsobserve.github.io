const banner = document.createElement("img");
const column = document.getElementsByClassName("column");
const siteMain = document.getElementById("site-main");
const header = document.createElement("header");
const title = document.getElementById("pageHeader");

//let initalHeaderFontSize = parseFloat(window.getComputedStyle(title, null).getPropertyValue('font-size'));
let cookie_consent = getCookie("userCookieConsent");
let ytFrame = document.getElementById("latest-video");
if (cookie_consent != "") {
	document.getElementById("cookieNotice").style.display = "none";
} else {
	//document.getElementById("cookieNotice").style.display = "block";
};
createHeader();
// hide banner and header on scroll
window.addEventListener("scroll", (e) => {
	if (window.pageYOffset < 200) {
		if (banner.dataset.transition == "true") {
			banner.style.opacity = (120 - Math.floor(window.pageYOffset)) + "%";
		} else {
			header.style.top = banner.height - 48 + "px";
			banner.style.position = "sticky";
			banner.style.top = "-1px";
		};
    }
});
// create the site header
function createHeader() {
	// create elements
	const nav = document.createElement("nav");
	const a = document.createElement("a");
	const a1 = document.createElement("a");
	const a2 = document.createElement("a");
	const a3 = document.createElement("a");
	const a4 = document.createElement("a");
	const h1 = document.createElement("h1");
	// set up banner
	banner.setAttribute("id", "banner");
	banner.setAttribute("src", "/images/banner-night-scene.png");
	banner.setAttribute("alt", "Shadows of flowers and leaves over a clear sky with the full moon visible.");
	banner.setAttribute("data-transition", "true");
	document.body.insertBefore(banner, document.body.firstChild);
	// set up navigation bar
	header.setAttribute("id", "site-header");
	nav.setAttribute("class", "navbar");
	header.appendChild(nav);
	// home button and page title
	a.setAttribute("class", "navheader");
	a.setAttribute("href", "//jordanhewett.com/index.html");
	h1.setAttribute("class", "header-h1");
	h1.innerHTML = "Observe";
	h1.setAttribute("id", "pageHeader");
	h1.setAttribute("title", "Return to Homepage");
	banner.insertAdjacentElement("afterend", header);
	nav.appendChild(a);
	a.appendChild(h1);
	// navigation buttons
	a1.setAttribute("class", "navbutton");
	a1.setAttribute("href", "//jordanhewett.com/Nature.html");
	a1.innerHTML = "Nature";
	nav.appendChild(a1);
	a2.setAttribute("class", "navbutton");
	a2.setAttribute("href", "//jordanhewett.com/Food.html");
	a2.innerHTML = "Food";
	nav.appendChild(a2);
	a3.setAttribute("class", "navbutton");
	a3.setAttribute("href", "//jordanhewett.com/Dreams.html");
	a3.innerHTML = "Dreams";
	nav.appendChild(a3);
	a4.setAttribute("class", "navbutton");
	a4.setAttribute("href", "//jordanhewett.com/Media.html");
	a4.innerHTML = "Media";
	nav.appendChild(a4);
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
// scroll to the top of the page
function topFunction() {
	window.scroll({
		top: 0,
		behavior: "smooth"
	});
};
