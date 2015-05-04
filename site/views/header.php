<header>
    <h1>PhotoLib</h1>
    <nav id="topnav">
      <ul>

        <?php
        echo "<li ".($page === 'index' ? 'class="current-nav-li"' : "").">"
          ."<a href='./index.php'>Explore</a></li>";

        if ($session->isAuthenticated()){  
          $userName = $session->getUser()->getName();
          echo "<li ".($page === 'account' ? 'class="current-nav-li"' : "").">"
                  ."<a>Account</a></li>"
              ."<li ".($page === 'logout' ? 'class="current-nav-li"' : "").">"
                  ."<a href=./logout.php>Log out</a></li>";
        }
        else {
          echo "<li ".($page === 'login' ? 'class="current-nav-li"' : "").">"
            ."<a href='./login.php'>Log in</a></li>";
          echo "<li ".($page === 'signup' ? 'class="current-nav-li"' : "").">"
            ."<a href='./signup.php'>Sign up</a></li>";
        }
        ?>
      </ul>
    </nav>
  </header>