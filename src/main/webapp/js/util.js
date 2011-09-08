jQuery.fn.log = function (msg)
{
	console.log("%s: %o", msg, this);
	return this;
};

function writeLog(logId, logArray)
{
	if ($.isArray(logArray))
	{
		for (i = 0; i < logArray.length; i++)
		{
			if (logArray[i] == ". ")
				$(logId).prepend(logArray[i]);
			else
				$(logId).prepend("\n" + logArray[i]);
		}
	}
}

function formatCurrency(num)
{
    num = isNaN(num) || num === '' || num === null ? 0.00 : num;
    return parseFloat(num).toFixed(2);
}

function displayCents(points)
{
	var returnString = "$";
	returnString += formatCurrency(points * JGenerous.returnData.exchangeRate);
	return returnString;
}

$.extend({
  getUrlVars: function(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function(name){
    return $.getUrlVars()[name];
  }
});

jQuery.preloadImages = function() {
  for ( var i = 0; i < arguments.length; i++) {
    jQuery("<img>").attr("src", arguments[i]);
  }
}