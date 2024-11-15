function runHomePageScript() {
  // Save the current content
  const previousContent = document.body.innerHTML;

  // Add blur effect to the body
  document.body.classList.add('blur-background');

  // Clear the current content
  document.body.innerHTML = '';

  // play container
  const buttonContainer = document.createElement('div');
  const button = document.createElement('button');
  button.className = 'play-container';
  button.textContent = "play";
  button.onclick = () => handleOptionClick("play");
  buttonContainer.appendChild(button);
  document.body.appendChild(buttonContainer);
  //--------------------------------------

  // settings container
  const buttonContainer2 = document.createElement('div');
  const button2 = document.createElement('button');
  button2.className = 'settings-container';
  button2.textContent = "settings";
  button2.onclick = () => handleOptionClick("settings");
  buttonContainer2.appendChild(button2);
  document.body.appendChild(buttonContainer2);
  //--------------------------------------

  // leaderboard container
  const buttonContainer3 = document.createElement('div');
  const button3 = document.createElement('button');
  button3.className = 'leader-container';
  button3.textContent = "leaderboard";
  button3.onclick = () => handleOptionClick("leaderboard");
  buttonContainer3.appendChild(button3);
  document.body.appendChild(buttonContainer3);
  //--------------------------------------

  // chat container
  const buttonContainer4 = document.createElement('div');
  const button4 = document.createElement('button');
  button4.className = 'chat-container';
  button4.textContent = "chat";
  button4.onclick = () => handleOptionClick("chat");
  buttonContainer4.appendChild(button4);
  document.body.appendChild(buttonContainer4);
  //--------------------------------------


  // Create the navigation container
  const navContainer = document.createElement('div');
  navContainer.className = 'nav_container';
  navContainer.innerHTML = `
    <a href="/">
      <button id="nav-toggle" class="nav-toggle">
        <i class="fa-solid fa-house"></i>
      </button>
    </a>
    <a href="#">
      <button id="nav-toggle" class="nav-toggle">
        <i class="fa-solid fa-user"></i>
      </button>
    </a>
    <a href="#">
      <button id="nav-toggle" class="nav-toggle">
        <i class="fa-solid fa-message"></i>
      </button>
    </a>
     <a href="#">
      <button id="nav-toggle" class="nav-toggle">
        <i class="fa-solid fa-gear"></i>
      </button>
    </a>
    <a href="#" onclick="logout()">
      <button id="nav-toggle" class="nav-toggle">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </a>
    `;

    // <!-- Mode switch -->
    // <button id="mode-switch" class="nav-toggle">
    //   <i class="fas fa-moon"></i>
    // </button>

  // Append the navigation container to the body
  document.body.appendChild(navContainer);

  // Push the new state to the history
  history.pushState({ page: 'options', previousContent: previousContent }, '', '/options');

  // mode  switch
    document.getElementById('mode-switch').addEventListener('click', function() {
      document.body.classList.toggle('light-mode');
      const icon = this.querySelector('i');
      if (document.body.classList.contains('light-mode')) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
          localStorage.setItem('mode', 'light');
      } else {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
          localStorage.setItem('mode', 'dark');
      }
  });

  // Set initial mode based on localStorage
  document.addEventListener('DOMContentLoaded', function() {
      const savedMode = localStorage.getItem('mode');
      const modeSwitchIcon = document.getElementById('mode-switch').querySelector('i');
      if (savedMode === 'light') {
          document.body.classList.add('light-mode');
          modeSwitchIcon.classList.remove('fa-sun');
          modeSwitchIcon.classList.add('fa-moon');
      } else {
          document.body.classList.remove('light-mode');
          modeSwitchIcon.classList.remove('fa-moon');
          modeSwitchIcon.classList.add('fa-sun');
      }
  });

  document.getElementById('nav-toggle').addEventListener('click', function() {
      const navList = document.getElementById('nav-list');
      navList.style.display = navList.style.display === 'flex' ? 'none' : 'flex';
  });

}

function handleOptionClick(option) {
  console.log(`${option} button clicked`);
  // Add your logic here to handle each option
}

window.onpopstate = function(event) {
  if (event.state && event.state.page === 'options') {
    // Restore the previous content
    document.body.innerHTML = event.state.previousContent;
    document.body.classList.remove('blur-background');
  }
};