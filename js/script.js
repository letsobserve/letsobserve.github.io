const banner = document.createElement("img");
const column = document.getElementsByClassName("column");
const siteMain = document.getElementById("site-main");
const header = document.createElement("header");

let cookie_consent = getCookie("userCookieConsent");
let ytFrame = document.getElementById("latest-video");
if (cookie_consent != "") {
	document.getElementById("cookieNotice").style.display = "none";
} else {
	//document.getElementById("cookieNotice").style.display = "block";
};
createHeader();
createBreadcrumbs();
createFooter();
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

function createA(aText, aClass, aLink, aTitle) { // create an a element
	var a = document.createElement("a");
	a.innerHTML = aText;
	a.setAttribute("class", aClass);
	a.setAttribute("href", aLink);
	a.setAttribute("title", aTitle);
	return a;
};
function createHeader() { // create the site header
	// create elements
	const nav = document.createElement("nav");
	const h1 = document.createElement("h1");
	let a, a1, a2, a3;
	// set up element attributes
	banner.setAttribute("id", "banner");
	banner.setAttribute("alt", "A close-up photo of a delicate purple flower, with light purple around its edges.");
	banner.setAttribute("data-transition", "true");
	header.setAttribute("id", "site-header");
	nav.setAttribute("class", "navbar");
	// set the correct href based on current href
	if (window.location.href.indexOf("/posts/") > -1) {
		banner.setAttribute("src", "../images/purple-flowers.jpeg");
		a = "../index.html";
		a1 = "../Blog.html";
		a2 = "../Projects.html";
		a3 = "../Media.html";
	} else if (window.location.href.indexOf("/projects/") > -1) {
		banner.setAttribute("src", "../images/purple-flowers.jpeg");
		a = "../index.html";
		a1 = "../Blog.html";
		a2 = "../Projects.html";
		a3 = "../Media.html";
	} else {
		banner.setAttribute("src", "images/purple-flowers.jpeg");
		a = "index.html";
		a1 = "Blog.html";
		a2 = "Projects.html";
		a3 = "Media.html";
	};
	// insert the elements onto the page
	document.body.insertBefore(banner, document.body.firstChild);
	banner.insertAdjacentElement("afterend", header);
	header.appendChild(nav);
	nav.appendChild(createA("Jordan Hewett", "navheader", a, "Return to Homepage"));
	nav.appendChild(createA("Blog", "navbutton", a1, "Blog"));
	nav.appendChild(createA("Projects", "navbutton", a2, "Projects"));
	nav.appendChild(createA("Media", "navbutton", a3, "Media"));
};
// create breadcrumbs for the page
function createBreadcrumbs() {
	// check if page needs breadcrumbs
	if (window.location.href.indexOf("/posts/") == -1) {
		return;
	};
	// create the elements
	const ul = document.createElement("ul");
	const siteContentWrapper = document.getElementsByClassName("site-content-wrapper");
	const title = document.getElementById("blogTitle").innerHTML;
	// set up the elements
	ul.setAttribute("class", "breadcrumbs");
	// insert the elements
	siteContentWrapper[0].insertAdjacentElement("afterbegin", ul);
	ul.appendChild(createA("Home","","../index.html","Return to Homepage"));
	ul.appendChild(createA("Blog","","../Blog.html","Blog"));
	ul.appendChild(createA(title,"","","Current Page"));
};
// create the site Footer
function createFooter() {
	// create all the elements
	const footer = document.createElement("footer");
	const div = document.createElement("div");
	const p = document.createElement("p");
	const p1 = document.createElement("p");
	const p2 = document.createElement("p");
	const icon = document.createElement("img");
	const br = document.createElement("br");
	const wrapperMain = document.getElementsByClassName("wrapper-main");
	// build the footer section
	wrapperMain[0].insertAdjacentElement("afterend", footer);
	footer.setAttribute("class", "footer");
	footer.appendChild(document.createElement("br"));
	p2.setAttribute("class", "footer-text");
	p2.innerHTML = "Have any comments or suggestions? Email them to me at garden.observation@gmail.com";
	footer.appendChild(p2);
	div.setAttribute("class", "footer-credit-wrapper");
	footer.appendChild(div);
	p.setAttribute("class", "footer-credit");
	p.innerHTML = "Observing Since 2019.";
	div.appendChild(p);
	icon.setAttribute("class", "footer-icon");
	icon.setAttribute("src", "https://jordanhewett.com/images/observeeyev2.png");
	div.appendChild(icon);
	p1.setAttribute("class", "footer-credit");
	p1.innerHTML = "This is a Hewett-Made Website.";
	div.appendChild(p1);
	footer.appendChild(br);
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
// create and populate media modal
function mediaModalFn(element) {
	// create elements and set attributes
	let modal = document.createElement("modal");
	modal.setAttribute("id", "mediaModal");
	let span = document.createElement("span");
	span.setAttribute("id", "closeMediaModal");
	span.setAttribute("onclick", "closeMediaModal()");
	span.innerHTML = "&times;";
	let img = document.createElement("img");
	img.setAttribute("id", "mediaModalImg");
	img.setAttribute("src", element.src);
	img.setAttribute("alt", element.alt);
	let p = document.createElement("p");
	p.setAttribute("id", "mediaModalAlt");
	p.innerHTML = element.alt;
	// insert new element into body
	document.body.insertBefore(modal, document.body.firstChild);
	modal.appendChild(span);
	modal.appendChild(img);
	modal.appendChild(p);
};
// close media modal
function closeMediaModal() {
	var modal = document.getElementById("mediaModal");
	modal.remove();
};
// scroll to the top of the page
function topFunction() {
	window.scroll({
		top: 0,
		behavior: "smooth"
	});
};
