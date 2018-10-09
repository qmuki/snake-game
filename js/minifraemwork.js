'use strict';

/*
    author: me,
    version: noGit,
    update: october 8,

    descritpion: target DOM
*/

/* work with paths */
function getPath(path) {
    return document.getElementById(path)
}

function getValue(id) {
    return getPath(id).value
}

function editHtml(path, text) {
    getPath(path).innerHTML = text
}

function createElement(path, element) {
    path.appendChild(document.createElement(element))
}

function setAttribute(path, attribute, parameter) {
    path.setAttribute(attribute, parameter)
}

// ToDo
/* date */
function getDate(time) {
    const date = new Date()

    const y = '\'' + ("0" + date.getFullYear()).slice(-2)
    const h = ("0" + date.getHours()).slice(-2)
    const m = ("0" + date.getMinutes()).slice(-2)
    const s = ("0" + date.getSeconds()).slice(-2)
    const ms = ("00" + date.getMilliseconds()).slice(-3)

    return h + ':' + m + ':' + s + '.' + ms
}