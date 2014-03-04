//var base="http://ec2-54-201-178-20.us-west-2.compute.amazonaws.com:8080/"
//var base="http://localhost:3000/"
var base="http://localhost:8080/linkshare/"

$(document).ready(function() {
    $("#lsubmit").click(function(){
	var title = $("input#title").val();
	var url = $("input#url").val();
	var subrequest = function(t, u) {
	    $.ajax({
		type: "POST",
		contentType: "application/json",
		dataType: "text",
		url: base+"link",
		data: JSON.stringify({title: t, url: u}),
		success: function () {
		    create_latest_link();
		},
		error: xhr_error(base+"link")
	    });
	    $.notify("interned link", "success");
	};

	if( url == "" ){
	    console.log("empty");
	} else {
	    reset_form($(this));
	    if( title == "" ){
		$.ajax({
		    type: "GET",
		    dataType: "text",
		    url: base+"lookup",
		    data: {url: encodeURIComponent(url)},
		    success: function(t){
			subrequest(t, url);
		    },
		    error: xhr_error(base+"lookup")
		});
		$.notify("checking title", "info");
	    } else {
		subrequest(title, url);
	    }
	}
    });


    //fetch first page of links from the server.
    $.ajax({
	dataType: "json",
	url: base+"links",
	data: "",
	crossDomain: true,
	success: function (data) {
	    $.each( data.links, function(i, item){
		create_link(item);
	    });
	},
	error: xhr_error(base+"links")
    });
    $.notify("fetching links", "info");
});

function create_latest_link(){
    $.ajax({
	dataType: "json",
	url: base+"link",
	data: "",
	crossDomain: true,
	success: function (data) {
	    create_link(data);
	},
	error: xhr_error(base+"link")
    });
}

function create_link(link){
    $(ich.link(link, true)).hide().appendTo('#links-form').fadeIn(600);
}

function reset_form(t){
    t.closest('form').find("input[type=text], textarea").val("");
}

function xhr_error(url){
    return function(xhr, status, err) {
	$.notify(err);
	console.log(url, xhr, status, err);
    }
}

