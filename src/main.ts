let noteZValue = 1; //global Z value
const NotesList: NotePad[] = []; //list of Notes for Select Bar
const selectBar: HTMLElement = document.querySelector("#select-bar") as HTMLElement; 
var focusedNote: HTMLElement; /* focused note which is used in the del button 
event listner. In the future I could make this into a stack.
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
  noteNum: number
  note: HTMLElement;
  menu: HTMLElement;
  titleBar:HTMLElement;
  content: HTMLElement;
  textInput: HTMLElement;
  resizeDiv: HTMLElement;
  resizeCornerDiv: HTMLElement;

  constructor(noteNum: number) {
    this.noteNum = noteNum;
    
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
    
    this.titleBar.className = "title-bar";
    this.resizeDiv.className = "resize-div";
    this.resizeCornerDiv.className = "resize-corner-div";

    this.titleBar.textContent = "note number " + noteNum;
    this.note.style.zIndex = (noteZValue++).toString();
    this.addEventHandlers();
    this.addToSelectionBar();
    focusedNote = this.note;
  }
  /*Eventhandlers for resizing and moving notes. In the furture if I need to
  repicate this effect again I can make a more abstracted version that works with
  more than just notes. */
  addEventHandlers() {
    addResizing(this.note, this.resizeDiv, this.resizeCornerDiv);
    addMoving(this.note, this.titleBar);
    this.note.addEventListener("focusin", () => {
      focusedNote = this.note;
      this.note.style.zIndex = (noteZValue++).toString()
  });
  }
  addToSelectionBar = () => {
    NotesList.push(this);
    const currentNoteSelector = document.createElement("div");
    currentNoteSelector.className = "select-note";
    currentNoteSelector.textContent = "note number " + noteNum;
    selectBar?.appendChild(currentNoteSelector);
  }

}
const main = document.querySelector("main") as HTMLElement;
const add = document.querySelector("#new-button") as HTMLElement;
const del = document.querySelector("#del-button") as HTMLElement;
const clear = document.querySelector("#clear-button") as HTMLElement;
var noteNum = 0;
add.addEventListener("click", () => {
  const note = new NotePad(++noteNum);
  main?.appendChild(note.note);
});
const delNote = () => {
  //console.log("deleting note");
  const currentNoteIndex = NotesList.findIndex((member) => member.note === focusedNote);
  if (focusedNote?.className === "note"&& currentNoteIndex !== -1) {
    console.log()
    main.removeChild(focusedNote);
    NotesList.splice(currentNoteIndex, 1);
    selectBar.removeChild(selectBar.children[currentNoteIndex]);
  }
}
del.addEventListener("click", delNote);
document.addEventListener("keydown", (e) => {
  console.log(`current key pressed is ${e.key}`)
  if(e.key === "Delete" || e.key === "Backspace") {
    delNote();
  }
});


const clearNote = () => {
  const selectors = selectBar.querySelectorAll(".select-note");
  selectors.forEach((selector) => selectBar.removeChild(selector));
  NotesList.forEach((notepad) => main.removeChild(notepad.note));
}
clear.addEventListener("click", clearNote);
document.addEventListener("keydown", (e) => {
  if(e.key === "c") {
    clearNote();
  }
})


