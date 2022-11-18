let div = document.createElement('div');
div.innerHTML = `
  <section id="titleBlock">
    <img id="titleImage" src="./imgs/tokyoMetro.png">
    <div id="titleText">Tokyo Metro Project</div>
  </section>
  <section id="headerDiv">
    <div class="hoverdropdown">
    <button class="hoverdropbtn">Home</button>
      <div class="hoverdropdown-content">
        <a href="/">View Map</a>
      </div>
    </div>
    <div class="hoverdropdown">
    <button class="hoverdropbtn">Lines</button>
      <div class="hoverdropdown-content">
        <a href="/line_view">View Lines</a>
        <a href="/line_edit">Edit Lines</a>
      </div>
    </div>
    <div class="hoverdropdown">
      <button class="hoverdropbtn">Stations</button>
      <div class="hoverdropdown-content">
        <a href="/station_view">View Stations</a>
        <a href="/station_edit">Edit Stations</a>
      </div>
    </div>
    <div class="hoverdropdown">
      <button class="hoverdropbtn">Trains</button>
      <div class="hoverdropdown-content">
        <a href="/train_view">View Trains</a>
        <a href="/train_edit">Edit Trains</a>
      </div>
    </div>
    <div class="hoverdropdown">
      <button class="hoverdropbtn">Operators</button>
      <div class="hoverdropdown-content">
        <a href="/operator_view">View Operators</a>
        <a href="/operator_edit">Edit Operators</a>
      </div>
    </div>
    <div class="hoverdropdown">
      <button class="hoverdropbtn">Schedules</button>
      <div class="hoverdropdown-content">
        <a href="/station_view">View Schedules</a>
        <a href="/schedule_edit">Edit Schedules</a>
      </div>
    </div>

  </section>
`;

let titleNav = document.querySelector(".titleNav");
titleNav.appendChild(div);
