$(document).ready(function() {
    var templateData = [
	{
            id: 1,
	    title: "Google",
	    url: "http://www.google.com"
	},
	{
	    id: 2,
	    title: "Yahoo",
	    url: "http://www.yahoo.com"
	},
	{
	    id: 3,
	    title: "Xkcd",
	    url: "http://www.xkcd.com"
	}
    ]

    templateData.map( function(item){
	$('#links-form').append(ich.link(item));
    });
});
