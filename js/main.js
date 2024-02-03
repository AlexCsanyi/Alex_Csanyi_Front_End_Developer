// form submit
const main = document.getElementById('main');
const containerSuccess = document.getElementById('success');
const containerError = document.getElementById('error');

const form = document.getElementById('contact-form');
const containerBtnSubmit = document.getElementById('container-btn-submit');
const btnSubmit = document.getElementById('btn-submit');
const containerSpinner = document.getElementById('container-lds-submit');

const handleSubmit = (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // show spinner
  containerBtnSubmit.style.display = 'none';
  containerSpinner.style.display = 'block';

  // collect data
  const formData = new FormData(form);

  // send data
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => {
      // show the containerSuccess message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      main.style.display = 'none';
      containerSuccess.style.display = 'block';
    })
    .catch((error) => {
      // show the error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      main.style.display = 'none';
      containerError.style.display = 'block';
    })
    .finally(() => {
      // reset submit btn
      containerSpinner.style.display = 'none';
      containerBtnSubmit.style.display = 'block';

      // reset form
      form.reset();
    });
};

btnSubmit.addEventListener('click', handleSubmit);

const handleBack = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  containerError.style.display = 'none';
  containerSuccess.style.display = 'none';
  main.style.display = 'block';
};

const btnsBack = document.querySelectorAll('.btn--back');
btnsBack.forEach((el) => el.addEventListener('click', handleBack));

// progress bar
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let windowHeight;
let scrolled;
let docHeight;
let scrollPer;

function render() {
  windowHeight = window.innerHeight;
  (scrolled = window.pageYOffset),
    (docHeight = Math.max(
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
      document.body.scrollHeight,
      document.body.offsetHeight
    )),
    (scrollPer = scrolled / (docHeight - windowHeight));

  ctx.clearRect(0, 0, 25, 25);
  ctx.lineWidth = 5;
  makeArc('#666666', 12.5, 12.5, 10, 2 * Math.PI);
  makeArc('#FFFFFF', 12.5, 12.5, 10, scrollPer * 2 * Math.PI);
}
function makeArc(color, one, two, three, five) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.arc(one, two, three, 0, five);
  ctx.stroke();
}

window.onresize = function () {
  render();
};
window.onscroll = function () {
  render();
};
render();

// cta btn cursor animation
const cursor = document.querySelector('#cursor');
let mouse = { x: -100, y: -100 };
let cursorPosition = { x: 0, y: 0 };
const cursorSpeed = 0.1;

const updateCursorCoordinates = (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
};

window.addEventListener('mousemove', updateCursorCoordinates);
const updateCursorPosition = () => {
  cursorPosition.x += (mouse.x - cursorPosition.x) * cursorSpeed;
  cursorPosition.y += (mouse.y - cursorPosition.y) * cursorSpeed;
  cursor.style.transform =
    'translate3d(' + cursorPosition.x + 'px, ' + cursorPosition.y + 'px, 0)';
};

function loop() {
  updateCursorPosition();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);

const cursorModifiers = document.querySelectorAll('[cursor-class]');
cursorModifiers.forEach((modifier) => {
  modifier.addEventListener('mouseenter', function () {
    const mouseEnterAttribute = this.getAttribute('cursor-class');
    cursor.classList.add(mouseEnterAttribute);
  });

  modifier.addEventListener('mouseleave', function () {
    const mouseLeaveAttribute = this.getAttribute('cursor-class');
    cursor.classList.remove(mouseLeaveAttribute);
  });
});

// magnetic button
const lerp = (current, target, factor) => {
  return current * (1 - factor) + target * factor;
};

const calculateDistance = (x1, y1, x2, y2) => {
  return Math.hypot(x1 - x2, y1 - y2);
};

const calcBoundingClientRect = (domElement) => {
  const rect = domElement.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  };
};

let mouseMagneticPosition = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouseMagneticPosition.x = e.pageX;
  mouseMagneticPosition.y = e.pageY;
});

class MagneticObject {
  constructor(domElement) {
    this.domElement = domElement;
    this.boundingClientRect = calcBoundingClientRect(this.domElement);

    this.triggerArea = 200; // 200px
    this.interPolationFactor = 0.8;

    this.lerpingData = {
      x: { current: 0, target: 0 },
      y: { current: 0, target: 0 },
    };

    this.resize();
    this.render();
  }

  resize() {
    window.addEventListener('resize', (e) => {
      this.boundingClientRect = calcBoundingClientRect(this.domElement);
    });
  }

  render() {
    const boundclientRectX =
      this.boundingClientRect.left + this.boundingClientRect.width / 2;
    const boundclientRectY =
      this.boundingClientRect.top + this.boundingClientRect.height / 2;

    const distanceFromMouseToCenter = calculateDistance(
      mouseMagneticPosition.x,
      mouseMagneticPosition.y,
      boundclientRectX,
      boundclientRectY
    );

    let targetHolder = { x: 0, y: 0 };
    if (distanceFromMouseToCenter < this.triggerArea) {
      targetHolder.x = (mouseMagneticPosition.x - boundclientRectX) * 0.3;
      targetHolder.y = (mouseMagneticPosition.y - boundclientRectY) * 0.3;
    }

    this.lerpingData['x'].target = targetHolder.x;
    this.lerpingData['y'].target = targetHolder.y;

    for (const coord in this.lerpingData) {
      this.lerpingData[coord].current = lerp(
        this.lerpingData[coord].current,
        this.lerpingData[coord].target,
        this.interPolationFactor
      );
    }

    this.domElement.style.transform = `translate(${this.lerpingData['x'].current}px,${this.lerpingData['y'].current}px)`;

    window.requestAnimationFrame(() => this.render());
  }
}

const magneticButton = document.querySelector('#container-btn-submit');
new MagneticObject(magneticButton);

// scrollTrigger
function addObserver(el, options) {
  // handle unsupported browsers
  if (!('IntersectionObserver' in window)) {
    // The animation will be called immediately so
    entry.target.classList.add('active');
    return;
  }

  let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      // `entry.isIntersecting` will be true if the element is visible
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  // Adding the observer to the element
  observer.observe(el);
}

function scrollTrigger(selector, options = {}) {
  let elements = document.querySelectorAll(selector);
  elements = Array.from(elements);
  elements.forEach((el) => {
    addObserver(el, options);
  });
}

// footer
scrollTrigger('#footer', {
  rootMargin: '-100px',
});
