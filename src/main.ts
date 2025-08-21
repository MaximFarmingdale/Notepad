let noteZValue = 1; //global Z value
const NotesList = []; //list of Notes for Select Bar
/* I only found out about the resizing property in css after coding this. Oops */
const addResizing = (main : HTMLElement, bottom: HTMLElement, bottomRight: HTMLElement) => {
  let startMouseLeft = 0;
  let startMouseTop = 0;

  let startWidth = 0;
  let startHeight = 0;

  const resizeOnMouseMove = (e: MouseEvent) => {
        console.log("actively changing height and width");
        main.style.width = startWidth + (e.clientX - startMouseLeft) + "px";
        main.style.height = startHeight + (e.clientY - startMouseTop) + "px";
  }
  const resizeHeightOnMouseMove = (e: MouseEvent) => {
      console.log("actively changing height");
      main.style.height = startHeight + (e.clientY - startMouseTop) + "px";
  }
  const removeSizeChangeOnMouseMove  = () => {
    document.removeEventListener("mousemove", resizeOnMouseMove);
    document.removeEventListener("mousemove", resizeHeightOnMouseMove);
    document.removeEventListener("mouseup", removeSizeChangeOnMouseMove);
  }
  bottomRight.addEventListener("mousedown", (e) => {
    startMouseLeft = e.clientX;
    startMouseTop = e.clientY;

    startWidth = main.offsetWidth;
    startHeight = main.offsetHeight;

    document.addEventListener("mousemove", resizeOnMouseMove);
    document.addEventListener("mouseup", removeSizeChangeOnMouseMove) ;
    });
  bottom.addEventListener("mousedown", (e) => {
    startMouseLeft = e.clientX;
    startMouseTop = e.clientY;

    startWidth = main.offsetWidth;
    startHeight = main.offsetHeight;
    document.addEventListener("mousemove", resizeHeightOnMouseMove);
    document.addEventListener("mouseup", removeSizeChangeOnMouseMove) ;
  });
}
  
const addMoving = (main: HTMLElement, top: HTMLElement) => {
  var startMouseLeft = 0;
  var startMouseTop = 0;

  var startLeft = 0;
  var startTop = 0;
  const moveOnMouseMove = (e: MouseEvent) =>{
    main.style.left = startLeft + (e.clientX - startMouseLeft) + "px" 
    main.style.top = startTop + (e.clientY - startMouseTop) + "px" 
  };
  const removeMoveOnMouseMove = (e: MouseEvent) => {
    document.removeEventListener("mousemove", moveOnMouseMove);
    document.removeEventListener("mouseup", removeMoveOnMouseMove)
  }
  top.addEventListener("mousedown", (e) => {
    startMouseLeft = e.clientX;
    startMouseTop = e.clientY;

    startLeft = main.offsetLeft;
    startTop = main.offsetTop;

    document.addEventListener("mousemove", moveOnMouseMove);
    document.addEventListener("mouseup", removeMoveOnMouseMove);
  });
}
class NotePad  {
  note: HTMLElement;
  menu: HTMLElement;
  titleBar:HTMLElement;
  content: HTMLElement;
  textInput: HTMLElement;
  resizeDiv: HTMLElement;
  resizeCornerDiv: HTMLElement;

  constructor() {
    this.note = document.createElement("div");
    this.menu = document.createElement("div");
    this.titleBar = document.createElement("div");
    this.content = document.createElement("div");
    this.textInput = document.createElement("textarea");
    this.resizeDiv = document.createElement("div");
    this.resizeCornerDiv = document.createElement("div");

    this.note.appendChild(this.menu);

    this.menu.appendChild(this.titleBar);

    this.note.appendChild(this.content);
    this.content.appendChild(this.textInput);
    this.content.appendChild(this.resizeDiv);
    this.content.appendChild(this.resizeCornerDiv);

    this.note.className = "note";
    this.menu.className = "menu";
    this.content.className = "content";
    
    this.titleBar.id = "title-bar";
    this.resizeDiv.id = "resize-div";
    this.resizeCornerDiv.id = "resize-corner-div";

    this.titleBar.textContent = "note number " + noteZValue;
    this.note.style.zIndex = (noteZValue++).toString();
    NotesList.push(this);
    this.addEventHandlers();
  }
  /*Eventhandlers for resizing and moving notes. In the furture if I need to
  repicate this effect again I can make a more abstracted version that works with
  more than just notes. */
  addEventHandlers() {
    addResizing(this.note, this.resizeDiv, this.resizeCornerDiv);
    addMoving(this.note, this.titleBar);
    this.note.addEventListener("focusin", () => 
      this.note.style.zIndex = (noteZValue++).toString()
    );
  }
}
const main = document.querySelector("main");
const add = document.querySelector("#new-button");
const clear = document.querySelector("#clear-button");
add?.addEventListener("click", () => {
  const note = new NotePad();
  main?.appendChild(note.note);
});
