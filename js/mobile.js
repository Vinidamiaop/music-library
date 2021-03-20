export default class MobileMenu {
  constructor(menu, btnMenu, btnClose) {
    this.menu = document.querySelector(menu);
    this.btnMenu = document.querySelector(btnMenu);
    this.btnClose = document.querySelector(btnClose);
    this.eventList = ["touchstart", "click"];
    this.activeClass = "active";
  }

  toggleMenu() {
    this.menu.classList.toggle(this.activeClass);
  }

  handleClick() {
    const body = document.querySelector("body");
    this.toggleMenu();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (this.menu.className.includes(this.activeClass)) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }
  }

  addMenuEvents() {
    this.eventList.forEach((item) => {
      this.btnMenu.addEventListener(item, this.handleClick);
      this.btnClose.addEventListener(item, this.handleClick);
    });
  }

  bindFunctions() {
    this.handleClick = this.handleClick.bind(this);
  }

  init() {
    this.bindFunctions();
    this.addMenuEvents();
    console.log(this.menu);
    console.log(this.btnMenu);
  }
}
