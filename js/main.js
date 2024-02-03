// form submit
const main = document.getElementById('main');
const containerSuccess = document.getElementById('success');
const containerError = document.getElementById('error');
const spanErrorMessage = document.getElementById('error-message');

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
      console.error(error);
      spanErrorMessage.textContent = error.message;
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

function render() {
  const windowHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const docHeight = Math.max(
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
    document.body.scrollHeight,
    document.body.offsetHeight
  );

  const scrollPercentage = scrolled / (docHeight - windowHeight);

  ctx.clearRect(0, 0, 25, 25);
  ctx.lineWidth = 5;
  makeArc('#666666', 12.5, 12.5, 10, 2 * Math.PI);
  makeArc('#FFFFFF', 12.5, 12.5, 10, scrollPercentage * 2 * Math.PI);
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
const mouse = { x: -100, y: -100 };
const cursorPosition = { x: 0, y: 0 };
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

const mouseMagneticPosition = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouseMagneticPosition.x = e.pageX;
  mouseMagneticPosition.y = e.pageY;
});

const makeMagnetic = (domElement) => {
  let boundingClientRect = calcBoundingClientRect(domElement);
  const triggerArea = 200;
  const interPolationFactor = 0.8;
  const lerpingData = {
    x: { current: 0, target: 0 },
    y: { current: 0, target: 0 },
  };

  const resize = () => {
    boundingClientRect = calcBoundingClientRect(domElement);
  };

  const render = () => {
    const centerX = boundingClientRect.left + boundingClientRect.width / 2;
    const centerY = boundingClientRect.top + boundingClientRect.height / 2;

    const distanceFromMouseToCenter = calculateDistance(
      mouseMagneticPosition.x,
      mouseMagneticPosition.y,
      centerX,
      centerY
    );

    if (distanceFromMouseToCenter < triggerArea) {
      lerpingData.x.target = (mouseMagneticPosition.x - centerX) * 0.3;
      lerpingData.y.target = (mouseMagneticPosition.y - centerY) * 0.3;
    } else {
      lerpingData.x.target = 0;
      lerpingData.y.target = 0;
    }

    lerpingData.x.current = lerp(
      lerpingData.x.current,
      lerpingData.x.target,
      interPolationFactor
    );

    lerpingData.y.current = lerp(
      lerpingData.y.current,
      lerpingData.y.target,
      interPolationFactor
    );

    domElement.style.transform = `translate(${lerpingData.x.current}px, ${lerpingData.y.current}px)`;

    window.requestAnimationFrame(render);
  };

  window.addEventListener('resize', resize);
  render();
};

const magneticButton = document.querySelector('#container-btn-submit');
makeMagnetic(magneticButton);

// scrollTrigger
function addObserver(el, options) {
  // handle unsupported browsers
  if (!('IntersectionObserver' in window)) {
    // The animation will be called immediately so
    el.classList.add('active');
    return;
  }

  const observer = new IntersectionObserver((entries, observer) => {
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
