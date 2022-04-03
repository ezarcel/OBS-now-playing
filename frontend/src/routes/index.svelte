<script>
  import "../styles/global.scss"
</script>

<div class="wave wave-animate-slow wave-danger">
  <h5>Hola</h5>
</div>

<style lang="scss">
  :global(html), :global(body) {
    height: 100%;
    margin: 0;
  }

  div {
    text-align: center;
    padding: 10px;
    background-color: #212121;
    border-radius: 15px;
    transition: .3s;
    width: 30vw;
    color: white;
    // position: absolute;
    top: 50%;
    left: 50%;
    // transform: translate(-50%, -50%);

    h5 {
      text-align: left;
      margin: 5px;
      font-weight: normal;
    }
  }

  .wave {
    background-color: #F3F6F9;
    overflow: hidden;
    position: relative;
}

.wave>div {
    z-index: 1;
}

.wave:before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ffffff;
    z-index: -1;
}

.wave:after {
    content: ' ';
    width: 1000px;
    height: 1025px;
    position: absolute;
    bottom: 65%;
    left: -250px;
    border-radius: 35%;
    background: white;
    z-index: 0;
}

.wave:after {
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
}

.wave-animate:after {
    -webkit-animation: animate-wave 15s infinite linear;
    animation: animate-wave 15s infinite linear;
}

.wave-animate-slower:after {
    -webkit-animation: animate-wave 30s infinite linear;
    animation: animate-wave 30s infinite linear;
}

.wave-animate-slow:after {
    -webkit-animation: animate-wave 25s infinite linear;
    animation: animate-wave 25s infinite linear;
}

.wave-animate-fast:after {
    -webkit-animation: animate-wave 10s infinite linear;
    animation: animate-wave 10s infinite linear;
}

.wave-animate-faster:after {
    -webkit-animation: animate-wave 5s infinite linear;
    animation: animate-wave 5s infinite linear;
}

.wave.wave-primary {
    background-color: rgba(105, 147, 255, 0.1) !important;
}

.wave.wave-primary .svg-icon svg g [fill] {
    fill: #6993FF;
}

.wave.wave-secondary {
    background-color: rgba(228, 230, 239, 0.1) !important;
}

.wave.wave-secondary .svg-icon svg g [fill] {
    fill: #E4E6EF;
}

.wave.wave-success {
    background-color: rgba(27, 197, 189, 0.1) !important;
}

.wave.wave-success .svg-icon svg g [fill] {
    fill: #1BC5BD;
}

.wave.wave-info {
    background-color: rgba(137, 80, 252, 0.1) !important;
}

.wave.wave-info .svg-icon svg g [fill] {
    fill: #8950FC;
}

.wave.wave-warning {
    background-color: rgba(255, 168, 0, 0.1) !important;
}

.wave.wave-warning .svg-icon svg g [fill] {
    fill: #FFA800;
}

.wave.wave-danger {
    background-color: rgba(246, 78, 96, 0.1) !important;
}

.wave.wave-danger .svg-icon svg g [fill] {
    fill: #F64E60;
}

.wave.wave-light {
    background-color: rgba(243, 246, 249, 0.1) !important;
}

.wave.wave-light .svg-icon svg g [fill] {
    fill: #F3F6F9;
}

.wave.wave-dark {
    background-color: rgba(24, 28, 50, 0.1) !important;
}

.wave.wave-dark .svg-icon svg g [fill] {
    fill: #181C32;
}

.wave.wave-white {
    background-color: rgba(255, 255, 255, 0.1) !important;
}

.wave.wave-white .svg-icon svg g [fill] {
    fill: #ffffff;
}

@-webkit-keyframes animate-wave {
    from {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes animate-wave {
    from {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    to {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}
</style>