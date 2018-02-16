function addColorBox(container,color) {
    let node = document.createElement("li");
    node.style.backgroundColor = color;
    container.appendChild(node);
}
module.exports = addColorBox;