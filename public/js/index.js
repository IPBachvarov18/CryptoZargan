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

$(() => {
	$("#singleButton").on("click", () => {
		$("#multi").hide();
		$("#single").fadeIn(500);
		$("#single").show();
	});

	$("#multiButton").on("click", () => {
		$("#single").hide();
		$("#multi").fadeIn(500);
		$("#multi").show();
	});

	$("#contactSubmit").on("submit", () => {
		$("#invalidName").show();

	});
})

