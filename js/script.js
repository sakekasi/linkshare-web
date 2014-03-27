var base="http://54.201.155.234/linkshare/"
//var base="http://localhost:3000/"
//var base="http://localhost:8080/linkshare/"

delete_shown = false;

$(document).ready(function() {
    $('#delete').hide();
    
    $('#delete').click(function(){
	var idvals = $.map($('#links-form').find('input:checked'),
			   function(item,i){
			       return parseInt(item.name);
			   });
	body = {}
	body.delete = true;
	body.ids = idvals;
	
	$.ajax({
	    type: "POST",
	    contentType: "application/json",
	    dataType: "text",
	    url: base+"links",
	    data: JSON.stringify(body),
	    success: function(){
		console.log("deleted");
		$.each(idvals, function(i,item){
		    id='#'+item.toString();
		    $(id).slideUp(600);
		});
		$('#delete').fadeOut(600);		
	    },
	    error: xhr_error(base+'links')
	});
	$.notify("deleted link(s)", "info");
    });
    
    
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
		create_link(item, false);
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
	    create_link(data, true);
	},
	error: xhr_error(base+"link")
    });
}

function create_link(link, add){
    if( add ){
	$(ich.link(link, true)).hide().prependTo('#links-form').fadeIn(600);
    } else {
	$(ich.link(link, true)).hide().appendTo('#links-form').fadeIn(600);	
    }
    
    $("[name='"+link.id+"']").change(function(){
	if($("[name='"+link.id+"']").prop('checked')){
	    if(!(delete_shown)){
		delete_shown = true;
		$('#delete').fadeIn(600);
	    }
	} else {
	    if($('#links-form').find('input:checked').length === 0){
		delete_shown = false;
		$('#delete').fadeOut(600);
	    }
	}
    });
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

