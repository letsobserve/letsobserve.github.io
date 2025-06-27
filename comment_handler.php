<?php
  if (add_comment($_POST)) {
    echo '<script>console.log("comment received!")</script>';
  };
?>
