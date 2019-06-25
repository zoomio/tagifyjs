/**
 * Renders a list of tags inside given target DOM element.
 */
const render = ({ target, tags = [] }) => {
    if (!target || tags.length == 0) {
        return;
    }

    const ul = document.createElement("ul");

    tags.forEach((tag, i) => {
        let a = document.createElement("a");
        a.href = tag.value;
        let li = document.createElement("li");
        li.appendChild(a);
        ul.appendChild(li);
    });

    target.appendChild(ul);
};

export default render;