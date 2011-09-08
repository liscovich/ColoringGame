function getCoordinates(cX, cY, radius, angle)
{
	pX = Math.ceil(cX + radius * Math.cos(angle*Math.PI/180));
	pY = Math.ceil(cY + radius * Math.sin(angle*Math.PI/180));
	return {"x":pX, "y":pY };
}


