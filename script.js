const inputBox = document.getElementById('input');
const todolist = document.getElementById('todo-lists');
const icon = document.getElementById('icon');



const setDarkMode = () => {
    document.querySelector("body").setAttribute("data-theme", "dark");
    localStorage.setItem("selectedTheme", "dark");
};
const setLightMode = () => {
    document.querySelector("body").setAttribute("data-theme", "light");
    localStorage.setItem("selectedTheme", "light");
};
const selectedTheme = localStorage.getItem("selectedTheme");

if (selectedTheme === "dark") {
    setDarkMode();
} else {
    setLightMode();
}

const toggleTheme = () => {
    if (icon.src.includes("moon")) {
        setDarkMode();
        icon.src = './images/icon-sun.svg';
    } else if (icon.src.includes("sun")){
        setLightMode();
        icon.src = './images/icon-moon.svg';
    }
};

{/* <div class="row divider">
                <input type="checkbox" class="cbox" />
                <p>Create a new todo</p>
            </div> */}
const input =document.getElementById('inout');
const container = document.getElementById('todo-Lists')
function addTodo() {
    const todoText = input.value;
    console.log(inputBox.value)
    const inputBox = document.createElement('div');
    inputBox.innerText = todoText;
    listContainer.appendChild(inputBox);
    input.value='';}
    
input.addEventListener("keyup",
function(event){
    if (event.keyCode===13){
        addTodo();
    }
    });
    