"use strict";
const fs = require('fs');
function readAsJson(path) {
    let fileContent = fs.readFileSync(path).toString();
    let data = JSON.parse(fileContent);
    return data;
}
function writeToFile(path, data) {
    let newContent = JSON.stringify(data);
    fs.writeFileSync(path, newContent);
    return data;
}
function pushAsJson(path, data) {
    let list = readAsJson(path);
    list.push(data);
    let newContent = JSON.stringify(list);
    fs.writeFileSync(path, newContent);
    return list;
}
function deleteAsJson(path, id) {
    let list = readAsJson(path);
    // delete logic on array
    list = list.filter((x) => x.id != id);
    let newContent = JSON.stringify(list);
    fs.writeFileSync(path, newContent);
    return list;
}
module.exports = { readAsJson, pushAsJson, deleteAsJson, writeToFile };
