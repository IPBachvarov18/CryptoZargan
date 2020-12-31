$(document).ready(function() {

    $('body').css('display', 'none');
    $('body').fadeIn(500);

    translateLabel("en");

    $(".translate-button").on("click", function() {
        Cookies.set("language", $(this).data("lng"), { expires: 1 })
        console.log("keks");
        translateLabel(Cookies.get("language"));
    });

    let lang = Cookies.get("language");
    translateLabel(lang);
});