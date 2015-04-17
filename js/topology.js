var c = document.querySelector("#topology");
var ctx = c.getContext("2d");
var pt_list = [];

c.addEventListener("click", handleDown);

var start_pt;
var end_pt;
function handleDown(e) {
	// console.log(checkPt(e))
	var pt = {
		"x": e.layerX,
		"y": e.layerY
	}
	var checked_node = checkPt(pt);
	if(checked_node) {
		start_pt = end_pt;
		end_pt = checked_node;
		console.log(start_pt.x,end_pt.x,checked_node.x)
		addPt(checked_node, "#f90");
	} else {
		addPt(pt, "#000");
	}
}

function checkPt(pt) {
	for (var i = pt_list.length - 1; i >= 0; i--) {
		if(Math.abs(pt_list[i].x - pt.x) < 10 && Math.abs(pt_list[i].y - pt.y) < 10) {
			return pt_list[i];
		}
	}
	return false;
}

function addPt(pt, color) {
	console.log(pt)
	ctx.fillStyle = color || 'black';
	ctx.fillRect(pt.x - 5, pt.y - 5, 10, 10);
	ctx.fillText('Variety is the spice of life!', pt.x + 20, pt.y + 5);
	end_pt = pt;
	/*if(pt_list.length > 0) {
		drawLine(start_pt, end_pt);
	}*/
	pt_list.push(end_pt);
	start_pt = end_pt;
}

function drawLine(start_pt, end_pt, color) {
	ctx.save();
	ctx.strokeStyle = color || 'black';  
	ctx.beginPath();
	ctx.moveTo(start_pt.x, start_pt.y);
	ctx.lineTo(end_pt.x, end_pt.y);
	ctx.stroke();
	ctx.restore();
}

function clearStage() {
	ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
	ctx.fillRect(0, 0, c.width, c.height);
}

function genImage() {  
	var image = new Image();
	image.src = c.toDataURL("image/png");
	return image;  
}  