"use strict";

function makeTable(container, data) {
    var table = $("<table border=\"1\"/>").addClass('CSSTableGenerator');
    $.each(data, function (rowIndex, r) {
        var row = $("<tr/>");
        $.each(r, function (colIndex, c) {
            row.append($("<t" + (rowIndex == 0 ? "h" : "d") + "/>").text(c));
        });
        table.append(row);
    });
    return container.html(table);
}

function getCurrentGrade() {
    if ($("#gr-choice:checked").val()) {
        return $("#grade").val();
    } else {
        const a = parseFloat($("#numerator").val());
        const b = parseFloat($("#denominator").val());
        return a / b * 100;
    }
}
function getAssignmentPercent() {
    if ($("#gr-choice:checked").val()) {
        return $("#assignment-percent-of-grade").val();
    } else {
        const a = parseFloat(getPoints());
        const b = parseFloat($("#denominator").val());
        return a / (a + b) * 100;
    }
}
function getPoints() {
    return $("#points").val();
}

function round(num) {
    return +(parseFloat("" + num)).toFixed(5);
}

function tableRound(table) {
    return table.map(function (r, ind) {
        return (ind == 0) ? r : r.map(round);
    })
}

const END = 120;
const STEP = .1;
function makeGraph(fun) {
    let plotDiv = document.getElementById('plot');

    const x = new Array(END / STEP).fill(undefined).map((val, index) => index * STEP);
    const y = x.map(fun);

    Plotly.newPlot(plotDiv, [{
        x: x,
        y: y,
        mode: 'lines'
    }], {
            margin: { t: 0 }, xaxis: { dtick: 10 }, yaxis: { dtick: 10 }
        });
}

function doStuff1(currentGrade, assignmentPercent, points) {
    //const asstGrade = $("#asst-grade").val();
    function fun(assignmentGrade) {
        return (currentGrade * (1 - assignmentPercent / 100)) + assignmentGrade * assignmentPercent / 100;
    }

    //$("#txt").text("Your new grade is " + fun(asstGrade));

    const data = [["Assignment grade (points)", "Assignment grade (%)", "Total grade"]];
    for (let i = 0; i <= 10; i++) {
        data[i + 1] = [i / 10 * points, i * 10, fun(i * 10)];
    }

    function funInverse(gradeNeeded) {
        return (gradeNeeded - currentGrade * (1 - assignmentPercent / 100)) / (assignmentPercent / 100);
    }

    const data2 = [["Assignment grade (points)", "Assignment grade (%)", "Total grade"]];
    let i = 0;
    for (let gr = 0; gr <= 100; gr += 10) {
        const fi = funInverse(gr);
        if (fi > 0 && fi < 140) {
            data2[i + 1] = [fi / 100 * points, fi, gr];
            i++;
        }
    }

    makeTable($("#table1"), tableRound(data2));
    makeTable($("#table2"), tableRound(data));

    makeGraph(fun);
}

function doStuff() {
    doStuff1(getCurrentGrade(), getAssignmentPercent(), getPoints());
}

$(document).ready(function () {
    doStuff();
    $(".input-change,:radio").on('input', doStuff);
})