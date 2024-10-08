<!DOCTYPE html>
<html lang="en">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>OBSERVE: Blog</title>
	<link rel="icon" type="image/x-icon" href="../images/observeeyev2.png">
	<link rel="stylesheet" href="../css/home.css">
	<meta name="author" content="Jordan Hewett" />
	<meta name="keywords" content="Jordan, Hewett, Observe, Nature, Dream, Dreams, Food, Recipes, Stories" />
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1480924343854494"
			crossorigin="anonymous"></script>
</head>
<body>
	<div id="cookieNotice">
		<span id="cookieClose" onclick="closeCookieNotice()">&times;</span>
		<h6 class="cookieTitle">This website uses cookies</h6>
		<p class="cookieMessage">As with most websites, we use cookies to remember you, your preferences and to create a better, more personalised experience. By accepting our cookies we can remember your preferences and you are able to view the embeded youtube videos.</p>
		<div class="cookieButtonWrap">
			<button class="cookieButton" onclick="acceptCookieConsent()">Accept</button>
		</div>
	</div>
	<img id="banner" src="../images/banner-night-scene.png" alt="Observe Banner Image" data-transition="true">
	<header id="site-header">
		<a class="navheader" href="../index.html"><h1 id="pageHeader" class="header-h1" data-transition="true">Observe</h1></a>
		<nav class="navbar">
			<a class="navbutton" href="../Nature.html">Nature</a>
			<a class="navbutton" href="../Food.html">Food</a>
			<a class="navbutton" href="../Dreams.html">Dreams</a>
			<a class="navbutton" href="../Media.html">Media</a>
		</nav>
	</header>
	<div id="site-main">
		<div class="wrapper-main">
			<main id="site-content" class="site-main">
				<div class="site-content-wrapper">
					<ul class="breadcrumbs">
						<li><a href="../index.html">Home</a></li>
						<li><a href="../Food.html">Food</a></li>
						<li>Blog Post</li>
					</ul>
					<br />
					<h1>Blog Post</h1>
					<br />
					<time datetime="2022-04-30">Published 30 April 2022</time>
					<article class="column-container">
						<br />
						<div class="column">
							<br />
							<figure class="blogFigure">
								<img class="blogImage" src="../images/placeholder.jpeg">
								<figcaption>Figcaption</figcaption>
								<br />
							</figure>
							<br />
							<section class="introduction">
								<br>
								<h2>Introduction</h2>
								<br />
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
								<br>
							</section>
							<br />
							<hr />
							<br />
							<section class="middle">
								<br />
								<h2>Middle</h2>
								<br />
								<p>middle section</p>
							</section>
							<br />
							<hr />
							<br />
							<section class="conclusion">
								<br />
								<h2>Conclusion</h2>
								<br />
								<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
							</section>
							<br />
							<hr />
							<br />
						</div>
					</article>
				</div>
			</main>
			<br />
			<aside id="site-aside">
				<div class="site-aside-wrapper">
					<p>Aside</p>
				</div>
			</aside>
		</div>
	</div>
	<br />
	<hr>
	<br />
	<div id="respond">
		<h3>Leave a Comment</h3>
		<form action="post_comment.php" method="post" id="commentform">
			<label for="comment_author" class="required">Your name</label>
			<br />
			<input type="text" name="comment_author" id="comment_author" value="" tabindex="1" required="required">
			<br />
			<label for="email" class="required">Your email;</label>
			<br />
			<input type="email" name="email" id="email" value="" tabindex="2" required="required">
			<br />
			<label for="comment" class="required">Your message</label>
			<br />
			<textarea name="comment" id="comment" rows="10" tabindex="4" required="required"></textarea>
			<br />
			<input type="hidden" name="comment_post_ID" value="1" id="comment_post_ID" />
			<input name="submit" type="submit" value="Submit comment" />
		</form>
	</div>
	<br>
	<footer class="footer">
		<h3 class="footer-title">Observe</h3>
		<p class="footer-text">Since 2019.</p>
		<p class="footer-credit">This is a Hewett-Made Website.</p>
		<br>
	</footer>
	<script src="../js/script.js">
	</script>
	<?php
	require('Persistence.php');
	$comment_post_ID = 1;
	$db = new Persistence();
	$comments = $db->get_comments($comment_post_ID);
	$has_comments = (count($comments) > 0);
	?>
</body>
</html>
