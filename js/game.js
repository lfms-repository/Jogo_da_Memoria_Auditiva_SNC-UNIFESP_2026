//Referenciando os elementos da tela que particpam do jogo
const grid = document.querySelector(".grid");
const spanPlayer = document.querySelector(".player");
const timer = document.querySelector(".timer");

//Listando os idioma das cartas
const characters = [
  "Alemao",
  "Chines",
  "Coreano",
  "Frances",
  "Ingles",
  "Portugues",
  "Russo",
];

//Defindo os tocadores dos sons das cartas
var audio01 = null;
var audio02 = null;

//Função responsável suporte que ajuda a fazer os elementos que serão as cartas do jogo
const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

//Variáveis de monitoramento das cartas ativas no jogo
let firstCard = "";
let secondCard = "";

//Função que confere se o jogo já foi encerrado, isso é, todos os pares já foram encontrados
const checkEndGame = () => {
  const disabledCards = document.querySelectorAll(".disabled-card");

  if (disabledCards.length == characters.length * 2) {
    clearInterval(this.loop);

    Cabecalho = `Parabéns,${spanPlayer.innerHTML}`;

    Mensagem = `Seu tempo foi de: ${timer.innerHTML} segundos`;

    MsgFinal(Cabecalho, Mensagem);

    audio01.pause();
    audio02.pause();

    resetCards();
  }
};

//Função que confere se as cartas selecionadas são correspondentes
const checkCards = () => {
  const firstCharacter = firstCard.getAttribute("data-character");
  const secondCharacter = secondCard.getAttribute("data-character");

  if (firstCharacter === secondCharacter) {
    firstCard.firstChild.style.backgroundImage = `url('../images/${firstCharacter}.png')`;
    secondCard.firstChild.style.backgroundImage = `url('../images/${secondCharacter}.png')`;

    firstCard.firstChild.classList.add("disabled-card");
    secondCard.firstChild.classList.add("disabled-card");

    firstCard = "";
    secondCard = "";

    setTimeout(() => {
      audio02.pause();
    }, "5000");

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("reveal-card");
      secondCard.classList.remove("reveal-card");

      firstCard = "";
      secondCard = "";

      audio01.pause();
      audio02.pause();
    }, 5000);
  }
};

//Função que faz a revelação das cartas (mostra o averso) e toca os sons relacionados a elas
const revealCard = ({ target }) => {
  if (target.parentNode.className.includes("reveal-card")) {
    return;
  }

  if (firstCard === "") {
    target.parentNode.classList.add("reveal-card");

    //Pegando o som escondido na 1ª carta
    const firstCharacter = target.parentNode
      .getAttribute("data-character")
      .toString();

    //Parando o áudio referente da 2º carta clicada
    if (audio02 != null) {
      audio02.pause();
    }

    //Tocando o áudio referente a 1º carta clicada por 5 segundos
    audio01 = new Audio("../sounds/" + firstCharacter + ".mp3");

    audio01.play();

    //Obrigando o jogador a ouvir o áudio completo da carta (desabilitando clicks na tela)
    document.addEventListener("click", desabilitar, true);

    setTimeout(() => {
      //Pausando o áudio da 1º carta
      audio01.pause();
      //Liberando o jogador para escolher uma nova carta(reabilitando clicks na tela)
      document.removeEventListener("click", desabilitar, true);
    }, "5000");

    firstCard = target.parentNode;
  } else if (secondCard === "") {
    target.parentNode.classList.add("reveal-card");
    secondCard = target.parentNode;

    //Pegando o som escondido na 1ª carta
    const secondCharacter = target.parentNode
      .getAttribute("data-character")
      .toString();

    //Parando o áudio referente da 1º carta clicada
    audio01.pause();

    //Tocando o áudio referente a 2º carta clicada por 5 segundos
    audio02 = new Audio("../sounds/" + secondCharacter + ".mp3");

    audio02.play();

    setTimeout(() => {
      //Pausando o áudio da 2º carta
      audio02.pause();
    }, "5000");

    checkCards();
  }
};

//Função responsável por gerar as cartas do jogo
const createCard = (character) => {
  const card = createElement("div", "card");
  const front = createElement("div", "face front");
  const back = createElement("div", "face back");

  front.style.backgroundImage = `url('../images/${character}-Som.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener("click", revealCard);
  card.setAttribute("data-character", character);

  return card;
};

//Função responsável por embaralhar as cartas do jogo
const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];

  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
};

//Função que monitora o tempo de jogo do usuário
const startTimer = () => {
  this.loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);
};

//Função responsável por carregar o jogo na tela
window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem("player");
  startTimer();
  loadGame();
};

//Função responsável por desabilitar as funções da tela e deixar o usuário presso ao som da carta
function desabilitar(e) {
  e.stopPropagation();
  e.preventDefault();
}

//pt-Br: Função responsável por gerar e exibir a mensagem de vitória ao usuário
function MsgFinal(Titulo, Mensagem) {
  //pt-Br: Escrevendo a mensagem de parabéns ao usuário
  document.getElementById("TituloJanela").innerHTML = Titulo;

  //pt-Br: Escrevendo uma mensagem com tempo de jofo do usuário
  document.getElementById("TextoMsg").innerHTML = Mensagem;

  //pt-Br: Exibindo a janela/caixa de diálogo na tela com a mensagem
  document.getElementById("JanelaCampeao").style.display = "block";
}

//pt-Br: Função responsável por fechar as janelas/caixas de diálogo exibidas ao usuário
function FecharMsg() {
  //pt-Br: Ocultando a janela/caixa de diálogona da tela
  document.getElementById("JanelaCampeao").style.display = "none";
}

function resetCards() {
  document.querySelectorAll(".card .front").forEach((front) => {
    front.classList.remove("disabled-card");
  });
}
