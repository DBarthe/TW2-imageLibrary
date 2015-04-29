<div id='sidebar'>
  <div id='sidebar-search-container'>
      <input id="sidebar-text-input"
        class='sidebar-search-entry' type='text' name='text'
        placeholder='Search in titles and tags'/>

      <input type="text" id="sidebar-author-input"
        class='sidebar-search-entry' name="author" list="authorList"
        placeholder='Author'>
      <datalist id="authorList">
        <?php foreach ($authorList as $author){
          echo "<option value='$author'></option>";
        } echo "\n";?>
      </datalist>

      <input type="text" id="sidebar-category-input"
        class='sidebar-search-entry' name="category" list="categoryList"
        placeholder='Category'>
      <datalist id="categoryList">
        <?php foreach ($categoryList as $category){
          echo "<option value='$category'></option>";
        } echo "\n";?>
      </datalist>

      <input type="text" id="sidebar-user-input"
        class='sidebar-search-entry' name="user" list="userList"
        placeholder="User">
      <datalist id="userList">
        <?php foreach ($userList as $user){
          $userName = $user->getName();
          echo "<option value='$userName'></option>";
        } echo "\n";?>
      </datalist>
    
      <input type="text" id="sidebar-tags-input"
        class='sidebar-search-entry' name="tags"
        placeholder='Tags separated by spaces'>

      <button class='custom-button sidebar-search-entry' id='sidebar-search-submit'>Refresh</button>
  </div>
</div>