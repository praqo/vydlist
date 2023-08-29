const app = (function () {
  const addForm = document.querySelector(".jsAddForm");
  const addInput = document.querySelector("#addInput");
  let jsVideoArea = document.querySelector(".jsVideoArea");

  function createVideoElement(url) {
    let videoParam = ``;

    if (url.includes("youtube")) {
      videoParam = url.slice(url.indexOf("v=") + 2);
      return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoParam}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
  }

  function addVideo(e) {
    e.preventDefault();
    if (!addInput.value.replace(/ /g, "")) {
      console.log("ter");
      return;
    }

    const el = createVideoElement(addInput.value);
    console.log(el);
    jsVideoArea.innerHTML += el;
  }

  addForm.addEventListener("submit", addVideo);
})();
