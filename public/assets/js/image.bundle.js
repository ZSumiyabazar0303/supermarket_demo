var image_input = document.querySelector("#image-input");

image_input.addEventListener("change", function() {
	var reader = new FileReader();
	reader.addEventListener("load", () => {
		var uploaded_image = reader.result;
		document.querySelector("#avatar-pic").style.backgroundImage = `url(${uploaded_image})`;
	});
	reader.readAsDataURL(this.files[0]);
});
var image_input = null;

$(function rmv() {
	$('#remove').click(function() {
		document.getElementById("avatar-pic").style.backgroundImage = "url('/assets/media/avatars/150-1.jpg')";
	});
});


