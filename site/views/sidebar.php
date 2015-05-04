<div id='sidebar'>
  <div id='sidebar-search-container'>
      <input id="sidebar-text-input"
        class='sidebar-search-entry' type='text' name='text'
        placeholder='Search in titles and tags'/>

      <select id="sidebar-author-input"
        class='sidebar-search-entry' name="author">
        <option value=''>Any author</option>
        <?php foreach ($authorList as $author){
          echo "<option value='$author'>$author</option>";
        } echo "\n";?>
      </select>

      <select id="sidebar-category-input"
        class='sidebar-search-entry' name="category">
        <option value=''>Any category</option>
        <?php foreach ($categoryList as $category){
          echo "<option value='$category'>$category</option>";
        } echo "\n";?>
      </select>

      <select id="sidebar-user-input"
        class='sidebar-search-entry' name="user">
        <option value=''>Any user</option>
        <?php foreach ($userList as $user){
          $userName = $user->getName();
          echo "<option value='$userName'>$userName</option>";
        } echo "\n";?>
      </select>
    
      <input type="text" id="sidebar-tags-input"
        class='sidebar-search-entry' name="tags"
        placeholder='Tags separated by spaces'>

      <button class='custom-button sidebar-search-entry' id='sidebar-search-submit'>Refresh</button>
  </div>
</div>