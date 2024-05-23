var canvas = document.getElementById('animationCanvas');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

var context = canvas.getContext('2d');
var messageIcons = [];
var iconSize = 25;

function createIcon(x, y) {
    return { x: x, y: y, dy: -1 };
}

function drawIcon(icon) {
    context.beginPath();
    context.arc(icon.x, icon.y, iconSize / 2, 0, Math.PI * 2);
    context.fillStyle = "#00a3d2";
    context.fill();
    context.closePath();

    context.font = "16px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("✉", icon.x, icon.y);
}

function updateIcons() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < messageIcons.length; i++) {
        var icon = messageIcons[i];
        icon.y += icon.dy;

        if (icon.y < -iconSize) {
            messageIcons.splice(i, 1);
            i--;
        } else {
            drawIcon(icon);
        }
    }
    requestAnimationFrame(updateIcons);
}

function addIcon() {
    var x = Math.random() * (canvas.width - iconSize) + iconSize / 2;
    var y = canvas.height + iconSize / 2;
    messageIcons.push(createIcon(x, y));
}

setInterval(addIcon, 1000);
updateIcons();