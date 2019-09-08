// load new page content via .fetch when link is clicked and animate it
let toDoLink = document.querySelector("#project-2");
let note360Link = document.querySelector("#project-1");
let project3Link = document.querySelector("#project-3");

let linkArray = [toDoLink, project3Link, note360Link];

linkArray.forEach(eachLink => {
  eachLink.addEventListener("click", () => {
    switch (eachLink) {
      case toDoLink:
        fetchPage(eachLink, "project2.html");
        break;

      case note360Link:
        fetchPage(eachLink, "project1.html");
        break;

      case project3Link:
        fetchPage(eachLink, "project3.html");
        break;
    }
  });
});

function fetchPage(link, page) {
  let baseURL = `${window.location.protocol}//${window.location.hostname}`;

  if (window.location.port) {
    baseURL += `:${window.location.port}`;
  }

  fetch(`${baseURL}/${page}`)
    .then(response => response.text())
    .then(html => {
      let doc = new DOMParser().parseFromString(html, "text/html");

      anime({
        targets:
          ".hero-content h1, .hero-content p, .hero-content h6, .image-section .container",
        translateY: -700,
        opacity: 0,
        easing: "linear",
        duration: 700,
        complete: anim => {
          document.querySelector(".hero-wrapper").remove();
          document.querySelector(".image-section").remove();
        }
      });

      setTimeout(function() {
        document
          .querySelector(".wrapper")
          .insertBefore(
            doc.querySelector(".new-content"),
            document.querySelector(".insert-desc-here")
          );
        anime({
          targets: ".new-content",
          translateY: [700, 0],
          delay: (el, i) => 100 * i,
          opacity: [0, 1],
          easing: "linear"
        });
      }, 300);

      setTimeout(function() {
        document
          .querySelector(".wrapper")
          .insertBefore(
            doc.querySelector(".new-img-content"),
            document.querySelector(".insert-img-here")
          );
        anime({
          targets: ".new-img-content .container",
          translateY: [700, 0],
          delay: (el, i) => 100 * i,
          opacity: [0, 1],
          easing: "linear"
        });
      }, 300);
    });
}
