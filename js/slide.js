export default class SlideNav {
  constructor(dataSlide, wrapper) {
    this.slideElement = document.querySelector(dataSlide);
    this.slideWrapper = document.querySelector(wrapper);
    this.activeClass = "active";
    this.dist = { finalPosition: 0, startX: 0, movement: 0 };
  }

  transition(active) {
    this.slideElement.style.transition = active ? "transform 0.3s" : "";
  }

  moveSlide(distX) {
    this.dist.movePosition = distX;
    this.slideElement.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  updatePosition(clientX) {
    this.dist.movement = (this.dist.startX - clientX) * 1.8;
    return this.dist.finalPosition - this.dist.movement;
  }

  onStart(event) {
    event.preventDefault();
    let moveType;
    if (event.type === "mousedown") {
      this.dist.startX = event.clientX;
      moveType = "mousemove";
    } else {
      this.dist.startX = event.changedTouches[0].clientX;
      moveType = "touchmove";
    }

    this.slideWrapper.addEventListener(moveType, this.onMove);
    this.transition(false);
  }

  onMove(event) {
    event.preventDefault();
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  onEnd(event) {
    event.preventDefault();
    const moveType = event.type === "mouseup" ? "mousemove" : "touchmove";
    this.slideWrapper.removeEventListener(moveType, this.onMove);
    this.dist.finalPosition = this.dist.movePosition;
    this.transition(true);
    this.changeSlideOnEnd();
  }

  changeSlideOnEnd() {
    if (this.dist.movement > 80 && this.index.next !== undefined) {
      this.changeSlide(this.index.next);
    } else if (this.dist.movement < -80 && this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
    } else {
      this.changeSlide(this.index.active);
    }
  }

  addSlideEvents() {
    this.slideWrapper.addEventListener("mousedown", this.onStart);
    this.slideWrapper.addEventListener("touchstart", this.onStart);
    this.slideWrapper.addEventListener("mouseup", this.onEnd);
    this.slideWrapper.addEventListener("touchend", this.onEnd);
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  //Slide Config

  slidePosition(slide) {
    const margin = this.slideWrapper.offsetLeft - slide.offsetWidth;
    return -(slide.offsetLeft - margin - slide.offsetWidth);
  }

  slideConfig() {
    this.slideArray = [...this.slideElement.children].map((element) => {
      const position = this.slidePosition(element);
      return { position, element };
    });
  }

  slideIndexNav(index) {
    const last = this.slideArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      active: index,
      next: index === last ? undefined : index + 1,
    };
  }

  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slideIndexNav(index);
    this.dist.finalPosition = activeSlide.position;
    this.changeActiveClass();
  }

  changeActiveClass() {
    this.slideArray.forEach((item) => {
      item.element.classList.remove(this.activeClass);
    });

    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  onResize() {
    setTimeout(() => {
      this.slideConfig();
      this.changeSlide(this.index.active + 1);
    }, 1000);
  }

  init() {
    this.bindEvents();
    this.addSlideEvents();
    this.slideConfig();
    this.changeSlide(0);
  }
}
