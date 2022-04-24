var modal = document.getElementById("modalImg001");

var img = document.getElementById("img001");

var modalImg = document.getElementById("img001");

var captionText = document.getElementById("caption");

var span = document.getElementsByClassName("close")[0];

function mediaModal() {
	modal.style.display = "block";
	modalImg.src = img.src;
	captionText.innerHTML = img.alt;
}

function closeMediaModal() {
	modal.style.display = "none";
}

function topFunction() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}
