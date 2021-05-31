"use strict"

/* 1) to do list:
-input de texto para ingresar la tarea
-input para la fecha
-botón de submit
-validar ambos campos y requerir que la fecha no sea anterior
-poder dar 3 colores a las tareas
-que las tareas se añadan al dom y al local storage
-poder borrar las tareas
-crear un área separada donde colocar las tareas realizadas
*/

const form = document.getElementById ("form")
const taskInput = document.getElementById ("taskInput")
const dateInput = document.getElementById ("dateInput")
const colorInput = document.getElementById ("colorInput")
const list = document.getElementById ("list")
const validation = document.getElementById ("validation")

const validationSign = ((a)=>{
    validation.textContent = `${a}`
        validation.removeAttribute("hidden")
        setTimeout(()=>{
            validation.setAttribute("hidden",true)     
        },2000)
})

const validateTaskAndDate = ()=>{
    const regEx = /^[a-z]+\s*/gm
    if (regEx.test (taskInput.value)) {
        let listItem = `${taskInput.value}.`
        let current = new Date
        let selected = new Date (dateInput.value)
        let ms1 = current.getTime()
        let ms2 = selected.getTime()
            if (dateInput.value == "") validationSign("Debe ingresar una fecha")
            else if (ms2 < ms1) validationSign("La fecha no puede ser anterior a la de hoy")
            else{
                const li = document.createElement ("LI")
                let id = Math.random()
                li.setAttribute("id", id)
                li.setAttribute("draggable",true)
                li.innerHTML = `${listItem}  ${selected.toLocaleDateString()}  <i class="far fa-times-circle"></i>`
                li.style.backgroundColor = colorInput.value
                list.appendChild(li)
                localStorage.setItem (li.getAttribute("id"),li.innerHTML)
                form.reset()
            }
        }
    else validationSign("Debe agregar una tarea")
}

form.addEventListener ("submit",(e)=>{
    e.preventDefault()
    validateTaskAndDate()
})

//borrar individualmente tareas de la lista de tareas pendientes
list.addEventListener ("click",(e)=>{
    const del = e.target.parentElement
    list.removeChild(del)
    localStorage.removeItem(del.getAttribute("id"))
})

// Drag & Drop de las tareas de list a finished-tasks
const finishedTasks = document.getElementById ("finished-tasks")
const finishedList = document.getElementById ("finished-list")

list.addEventListener("dragstart",(e)=> e.dataTransfer.setData("text/plain",e.target.id))

list.addEventListener("drag",(e)=> e.target.classList.add("active-task"))

list.addEventListener("dragend",(e)=> e.target.classList.remove("active-task"))

finishedTasks.addEventListener("dragover",(e)=> e.preventDefault())

finishedTasks.addEventListener("drop",(e)=>{
    e.preventDefault()
    const element = document.getElementById(e.dataTransfer.getData("text"))
    element.classList.remove("active-task")
    finishedList.appendChild(list.removeChild(element))
})

//borrar individualmente tareas de la lista de tareas finalizadas
finishedList.addEventListener ("click",(e)=>{
    const del = e.target.parentElement
    finishedList.removeChild(del)
    localStorage.removeItem(del.getAttribute("id"))
})

// Drag & Drop de las tareas de finished-tasks a task-list
const taskList = document.getElementById ("task-list")

finishedTasks.addEventListener("dragstart",(e)=> e.dataTransfer.setData("text/plain",e.target.id))

finishedTasks.addEventListener("drag",(e)=> e.target.classList.add("active-task"))

finishedTasks.addEventListener("dragend",(e)=> e.target.classList.remove("active-task"))

taskList.addEventListener("dragover",(e)=> e.preventDefault())

taskList.addEventListener("drop",(e)=>{
    e.preventDefault()
    const element = document.getElementById(e.dataTransfer.getData("text"))
    element.classList.remove("active-task")
    list.appendChild(finishedList.removeChild(element))
})

addEventListener('load',()=>{
    if (localStorage.length > 0){
        const fragment = document.createDocumentFragment()    
        for (let i=0; i< localStorage.length; i++){
            const li = document.createElement ("LI")
            let id = localStorage.key(i)
            li.setAttribute("id", id)
            li.setAttribute("draggable",true)
            li.innerHTML = `${localStorage.getItem(localStorage.key(i))}`
            li.style.backgroundColor = colorInput.value
            fragment.appendChild(li)
            }
        list.appendChild(fragment)
    }
})

