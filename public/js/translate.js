var textTranslation = {

    "nav-game": {
        'en': `Game`,

        'bg': `Игра`
    },

    "nav-singleplayer": {
        'en': `Single Player`,

        'bg': `Самостоятелна игра`
    },

    "nav-multiplayer": {
        'en': `Multiplayer`,

        'bg': `Игра с приятел`
    },

    "nav-rules": {
        'en': `Rules`,

        'bg': `Правила`
    },

    "nav-about": {
        'en': `About`,

        'bg': `Информация`
    },

    "nav-about-team": {
        'en': `About Team`,

        'bg': `За отбора`
    },

    "nav-about-project": {
        'en': `About Project`,

        'bg': `За проекта`
    },

    "nav-documentation": {
        'en': `Documentation`,

        'bg': `Документация`
    },

    "nav-language": {
        'en': `Language`,

        'bg': `Език`
    },

    "btn-en": {
        'en': `English`,

        'bg': `Английски`
    },

    "btn-bg": {
        'en': `Bulgarian`,

        'bg': `Български`
    },

    "nav-contact": {
        'en': `Contact`,

        'bg': `Контакт`
    },

    "welcome-text": {
        'en': `Welcome to Bletchley Game`,

        'bg': `Добре дошли в Bletchley Game`
    },

    "team-text": {
        'en': `By Team Crypto Zargan`,

        'bg': `От отбор Крипто Зарган`
    },

    "index-singleplayer": {
        'en': `Single Player`,

        'bg': `Самостоятелна игра`
    },

    "index-multiplayer": {
        'en': `Multiplayer`,

        'bg': `Игра с приятел`
    },

    "index-story": {
        'en': `Some Magic`,

        'bg': `Магия`
    },

    "contact": {
        'en': `Contact Page`,

        'bg': `Страница за контакт`
    },

    "aboutTeam": {
        'en': `About Team Page`,

        'bg': `Страница за отбора`
    },

    "aboutProject": {
        'en': `About Project Page`,

        'bg': `Страница за проекта`
    },

    "singleplayer": {
        'en': `This is Single Player`,

        'bg': `Това е сингълплейъра`
    },


    "play": {
        'en': `Play`,

        'bg': `Играй`
    },

    "diff-easy": {
        'en': `Easy`,

        'bg': `Лесно`
    },

    "diff-med": {
        'en': `Medium`,

        'bg': `Нормално`
    },

    "diff-hard": {
        'en': `Hard`,

        'bg': `Трудно`
    },

    "level1": {
        'en': `British completed level 1. Are you ready to continue?`,

        'bg': `Британеца мина ниво 1. Готов ли си да продължиш?`
    },

    "next-level": {
        'en': `Next Level`,

        'bg': `Следващо ниво`
    },

    "ff": {
        'en': `Surrender`,

        'bg': `Предаване`
    },

    "home": {
        'en': `Home`,

        'bg': `Начална страница`
    },

    "play-again": {
        'en': `Play Again`,

        'bg': `Играй отново`
    },

    "win": {
        'en': `You won!!!!!`,

        'bg': `Ти спечели!!!!!`
    },

    "lose": {
        'en': `You Lose!!!!!`,

        'bg': `Ти загуби!!!!!`
    },

    "guessed-digi": {
        'en': `Guessed Digits`,

        'bg': `Познати числа`
    },

    "guessed-pos": {
        'en': `Guessed Positions`,

        'bg': `Познати позиции`
    },

    "guessed-num": {
        'en': `Number`,

        'bg': `Число`
    },

    "opening": {
        'en': `This is multiplayer`,

        'bg': `Това е мултиплейъра`
    },

    "choose": {
        'en': `Choose:`,

        'bg': `Избери:`
    },

    "winner": {
        'en': `British wins!`,

        'bg': `Британеца печели!`
    },

    "create": {
        'en': `Create Game`,

        'bg': `Създай игра`
    },

    "join": {
        'en': `Join Game`,

        'bg': `Присъедини се в игра`
    },

    "send-code": {
        'en': `Send this code to your friend and play together`,

        'bg': `Прати кода на твоя приятел и играйте заедно`
    },

    "username": {
        'en': `Username:`,

        'bg': `Потребителско име:`
    },

    "role": {
        'en': `Role:`,

        'bg': `Роля:`
    },

    "german": {
        'en': `German`,

        'bg': `Германец`
    },

    "british": {
        'en': `British`,

        'bg': `Британец`
    },

    "ID": {
        'en': `Game ID:`,

        'bg': `Идентификатор на играта:`
    },

    "guess-code": {
        'en': `Guess Code`,

        'bg': `Познай кода`
    },

    "create-code": {
        'en': `Create code`,

        'bg': `Създай кода`
    },


    "code": {
        'en': `Code: `,

        'bg': `Код: `
    },

    "table1": {
        'en': `Guessed Digits`,

        'bg': `Познати цифри`
    },

    "table2": {
        'en': `Guessed Positions`,

        'bg': `Познати позиции`
    },

    "table3": {
        'en': `Number`,

        'bg': `Число`
    },

    "level1-win": {
        'en': `Congratulations you completed level 1`,

        'bg': `Поздравления ти завърши първо ниво`
    },

    "wait-level2": {
        'en': `Wait for your friend to start level 2`,

        'bg': `Изчакай приятеля си да стартира второ ниво`
    },

    "wait-create-code": {
        'en': `Wait for your friend to create the code`,

        'bg': `Изчакай приятеля си да напише кода`
    },

    "wait-start-game": {
        'en': `Wait for your friend to start the game`,

        'bg': `Изчакай приятеля си да стартира игра`
    },

}

var currentLanguage = 'en';

function replaceElementText(item, text) {
    if (!item.is("button")) {
        item.html(text);
    } else {
        item.text(text);
    }
}

function translateLabel(langId) {

    console.log(langId)
    currentLanguage = langId;

    // Gets all tags that have 'data-lang' attribute present
    $("[data-lang]")
        .each(function() {
            let item = $(this);
            if (textTranslation.hasOwnProperty(item.data("lang")) && textTranslation[item.data("lang")].hasOwnProperty(langId)) {
                let text = textTranslation[item.data("lang")][langId];
                replaceElementText(item, text);
            } else {
                replaceElementText(item, "<font color='red'>" + item.data("lang") + "</font>");
            }
        })
};

function getTranslatedText(elementId) {
    return textTranslation[elementId][currentLanguage];
}