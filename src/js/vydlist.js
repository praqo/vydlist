const app = (function () {
  const addForm = document.querySelector(".jsAddForm");
  const addInput = document.querySelector("#addInput");
  let videoArea = document.querySelector(".jsVideoArea");
  let playlistArea = document.querySelector(".jsPlaylistArea");
  let userData = {
    videosArr: [],
  };
  let isDuplicate = false;
  let videoPlayingId = "";

  if (!localStorage.hasOwnProperty("vydlistApp")) {
    updateLocalStorage();
  } else {
    userData = JSON.parse(localStorage.getItem("vydlistApp"));
  }

  function updateLocalStorage() {
    localStorage.setItem("vydlistApp", JSON.stringify(userData));
    events.emit("userDataChange", userData);
  }

  function createVideoElement(videoInfo) {
    console.log("createVideoElement");
    if (videoInfo.site === "youtube") {
      return `<iframe class="playlist-iframe" src="https://www.youtube.com/embed/${videoInfo.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    if (videoInfo.site === "vimeo") {
      return `<iframe src="https://player.vimeo.com/video/${videoInfo.id}" class="playlist-iframe" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
  }

  function selectActiveVideo(e) {
    videoPlayingInfo = {
      id: e.currentTarget.dataset.id,
      site: e.currentTarget.dataset.site,
    };
    const el = createVideoElement(videoPlayingInfo);

    videoArea.innerHTML = el;
  }

  function deleteItem(e) {
    const id = e.currentTarget.parentNode.dataset.id;
    const site = e.currentTarget.parentNode.dataset.site;

    userData = {
      ...userData,
      videosArr: userData.videosArr.filter((item) => {
        if (!(id === item.id && site === item.site)) {
          return item;
        }
      }),
    };

    updateLocalStorage();
  }

  function createPlaylistElement(videoInfo) {
    let playlistItemWrapper = document.createElement("div");
    let videoEl = document.createElement("div");
    let deleteButton = document.createElement("button");

    playlistItemWrapper.classList.add("playlist-item-wrapper");
    playlistItemWrapper.setAttribute("data-id", videoInfo.id);
    playlistItemWrapper.setAttribute("data-site", videoInfo.site);

    videoEl.classList.add("playlist-item");
    videoEl.setAttribute("data-id", videoInfo.id);
    videoEl.setAttribute("data-site", videoInfo.site);
    videoEl.setAttribute("data-link", videoInfo.link);

    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = `<i class="fa fa-trash-o" aria-hidden="true" title="delete from playlist"></i>`;
    deleteButton.addEventListener("click", deleteItem);

    videoEl.innerHTML = `<div class="playlist-item-overlay"></div>${createVideoElement(
      videoInfo
    )}`;

    videoEl.addEventListener("click", selectActiveVideo);

    playlistItemWrapper.appendChild(videoEl);
    playlistItemWrapper.appendChild(deleteButton);

    return playlistItemWrapper;
  }

  function createVideoListItem(videoLink) {
    let videoInfo;

    if (videoLink.includes("youtube")) {
      videoInfo = {
        id: videoLink.slice(videoLink.indexOf("v=") + 2),
        img: `https://i.ytimg.com/vi_webp/${videoLink.slice(
          videoLink.indexOf("v=") + 2
        )}/sddefault.webp`,
        site: "youtube",
        link: videoLink,
      };
    }

    if (videoLink.includes("vimeo")) {
      videoInfo = {
        id: videoLink.slice(videoLink.indexOf(".com/") + 5),
        img: "",
        site: "vimeo",
        link: videoLink,
      };
    }

    if (!videoInfo) {
      return "invalid";
    }

    console.log(userData);

    userData.videosArr.forEach((item) => {
      if (item.id === videoInfo.id && item.site === videoInfo.site) {
        isDuplicate = true;
      }
    });

    if (isDuplicate) {
      isDuplicate = false;
      return "duplicate";
    }

    let videoEl = createPlaylistElement(videoInfo);

    userData = { ...userData, videosArr: [...userData.videosArr, videoInfo] };

    updateLocalStorage();

    return videoEl;
  }

  function addVideo(e) {
    e.preventDefault();
    if (!addInput.value.replace(/ /g, "")) {
      return;
    }

    const videoListItem = createVideoListItem(addInput.value);
    addInput.value = "";
    if (videoListItem === "duplicate") {
      alert("This video is already in your playlist");
    }

    if (videoListItem === "invalid") {
      alert("Invalid link");
    }
  }

  function populatePlaylist() {
    let htmlToAppend = document.createDocumentFragment();

    if (userData.videosArr.length > 0) {
      userData.videosArr.forEach((item, index) => {
        htmlToAppend.appendChild(createPlaylistElement(item));
      });
    } else {
      const message = document.createElement("p");
      message.innerText = "no videos";
      htmlToAppend.appendChild(message);
    }

    playlistArea.innerHTML = "";
    playlistArea.appendChild(htmlToAppend);
  }

  addForm.addEventListener("submit", addVideo);
  events.on("userDataChange", populatePlaylist);

  populatePlaylist();
})();
