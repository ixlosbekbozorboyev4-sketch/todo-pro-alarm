let input = document.querySelector(".input")
let number = document.querySelector(".count")
let btn = document.querySelector(".btn")
let list = document.querySelector(".list")
let container = document.querySelector(".container")

let count = 0

btn.addEventListener('click', () => {
    const text = input.value.trim()

    if (text === "") {
        alert("Bo'sh qoldirib bo'lmaydi")
    } else {
        const li = document.createElement("li")
        li.textContent = text
        list.append(li)

        count++
        number.innerText = count

        let currentHeight = container.offsetHeight
        container.style.height = (currentHeight + 20) + 'px'

        const deleteBtn = document.createElement("button")
        deleteBtn.textContent = 'X'
        li.append(deleteBtn)

        input.value = ""

        deleteBtn.addEventListener('click', () => {
            li.remove()
            count--
            number.innerText = count

            let newHeight = container.offsetHeight
            container.style.height = (newHeight - 40) + 'px'
        })
    }
})