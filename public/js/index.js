$(document).ready(function () {
	$("body").css("display", "none");
	$("body").fadeIn(500);

	if (Cookies.get("language") == null) {
		Cookies.set("language", "en", { expires: 1 });
	}

	$(".translate-button").on("click", function () {
		Cookies.set("language", $(this).data("lng"), { expires: 1 });
		console.log("keks");
		translateLabel(Cookies.get("language"));
	});

	let lang = Cookies.get("language");
	translateLabel(lang);
});

let acc = document.getElementsByClassName("accordion");

for (let i = 0; i < acc.length; i++) {
	acc[i].addEventListener("click", function () {
		this.classList.toggle("active");
		let panel = this.nextElementSibling;

		if (panel.style.display === "block") {
			panel.style.display = "none";
		} else {
			panel.style.display = "block";
		}
	});
}
