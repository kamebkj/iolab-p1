$(document).ready(function() {

	var tagAry = [];
	// var ctx = $('#canvas')[0].getContext("2d");

	$("#loadBookmarks").submit(getBookmark);

	function getBookmark(event) {
		event.preventDefault();

		$.getJSON('http://feeds.delicious.com/v2/json/tags/'+$("#sourceUser").val()+'?count=100&callback=?', function(data){
			
			if (data.length!=0) {
				// Clear the canvas & array
				$("#bookmarks").empty();
				tagAry = [];

				// Put the tags into tag array
				$.each(data, function(index, value){
					tagAry.push({k:index, v:value});
				});
				tagAry.sort(compare);

				// Normalize the size of the circles
				var total = 0;
				for (var k=0; k<5; k++) {
					total += tagAry[k].v;
				}
				// For the top 5 tags, each creates a circle
				for (var i=0; i<5; i++) {
					var radius = (tagAry[i].v/total)*700;
					$("#bookmarks").append('<div class="circle" id="circle'+i+'">'+tagAry[i].k+'<br>'+tagAry[i].v+'</div>');
					$("#circle"+i).css("width",radius);
					$("#circle"+i).css("height",radius);
					$("#circle"+i).css("cursor","pointer");
					$("#circle"+i).on("click", openBookmarkInTag);
				}
			}
			else {
				console.log("Fail to get data");
			}
		});
	}

	function openBookmarkInTag() {
		var i = $(this).attr("id")[6];

		$.getJSON('http://feeds.delicious.com/v2/json/'+$("#sourceUser").val()+"/"+tagAry[i].k+'?count=100&callback=?', function(data){
			$("#bookmark-links ul").empty();
			
			$.each(data, function(){
				$("#bookmark-links ul").append('<a href="'+this.u+'" target="_blank">'+'<li>'+this.d+'</li></a>');
			});
		});
	}

	function compare(a, b) {
		if (a.v < b.v) return 1;
		if (a.v > b.v) return -1;
		return 0;
	}
});