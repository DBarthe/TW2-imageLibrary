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
                  ."<a href='./account.php'>Account</a></li>"
              ."<li ".($page === 'logout' ? 'class="current-nav-li"' : "").">"
                  ."<a href=./logout.php>Logout</a></li>";
        }
        else {
          echo "<li ".($page === 'login' ? 'class="current-nav-li"' : "").">"
            ."<a href='./login.php'>Login</a></li>";
          echo "<li ".($page === 'signup' ? 'class="current-nav-li"' : "").">"
            ."<a href='./signup.php'>Signup</a></li>";
        }
        ?>
      </ul>
    </nav>
  </header>