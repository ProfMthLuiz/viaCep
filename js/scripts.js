const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");

const closeButton = document.querySelector("#close-message");

// Validando o cep input. O evento keypress é disparado quando uma tecla que produz um 
// valor do tipo caractere é pressionada. 
cepInput.addEventListener("keypress", (e) => {
  
  // Criando uma regex
  const onlyNumbers = /[0-9]|\./;

  // O método String.fromCharCode() retorna uma string criada ao usar 
  // uma sequência específica de valores Unicode. A propriedade keyCode retorna o 
  //código do caractere Unicode correspondente à tecla que desencadeou o evento JavaScript onkeypress, onkeydown ou onkeyup.
  const key = String.fromCharCode(e.keyCode);

  // Permitir apenas números.
  // O método test() executa uma busca por uma correspondência entre 
  // uma expressão regular e uma string.
  // Então se o usuário digitar algo que não seja numérico, damos um preventDefault
  // e um return para não prosseguir o que está acontencendo.
  if (!onlyNumbers.test(key)) {

    e.preventDefault();
    return;

  }

});

// Evento para obter endereço, utilizamos o keyup, porque precisamos dos 8 digitos, e 
// no keyup teriamos que digitar um numero a mais.
cepInput.addEventListener("keyup", (e) => {

  // Pegando o valor do inputCep.
  const inputValue = e.target.value;

  // Verificando se temos a quantidade de numeros necessárias para um CEP.
  if (inputValue.length === 8) {

    getAddress(inputValue);

  }

});

// Obtém o endereço através do CEP passado para API
// Está função é assincrona, porque iremos fazer uma requisição na API.
const getAddress = async (cep) => {
  
  // Exibindo o loader
  toggleLoader();

  // O blur é o evento DOM ativado quando o campo deixa de ser selecionado.
  // Dessa forma, estamos tirando o foco do cep, e assim não permitimos o usuário
  // fique mandando requisições.
  cepInput.blur();

  const apiUrl = `https://viacep.com.br/ws/${cep}/json/`;
  
  // Pegando a resposta da API
  const response = await fetch(apiUrl);
  
  // Recebendo os dados do endereço
  const data = await response.json();

  console.log(data.erro)

  // Mostrar erro e redefinir formulário
  if (data.erro === true) {

    // Se o addressInput não tiver disabled e deu erro
    // temos que chamar o toggleDisabled para desabilitar os campos
    // e deixa apenas o campo CEP para ser preenchido novamento.
    if (!addressInput.hasAttribute("disabled")) {

      toggleDisabled();

    }

    // Limpando o formulário todo
    addressForm.reset();

    // Retirando o loader.
    toggleLoader();

    // Exibir a mensagem para o usuário
    toggleMessage("CEP Inválido, tente novamente.");

    // Return vazio para parar de executar a função.
    return;
    
  }

  // Se o addressInput estiver vazio, ai sim chamamos o toggleDisabled
  if (addressInput.value === "") {

    toggleDisabled();

  }

  // Preenchendo todos os campos.
  addressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;

  // Removendo o loader da tela.
  toggleLoader();

};

// Adicionar ou remover atributo desativado
const toggleDisabled = () => {

  // Verificando se tem campos com disabled
  if (regionInput.hasAttribute("disabled")) {

    // Percorrendo todos os inputs
    formInputs.forEach((input) => {

      // Removendo o atributo disabled
      input.removeAttribute("disabled");

    });

  } else {

    // Percorrendo todos os inputs
    formInputs.forEach((input) => {

      // Inserindo o atributo disabled
      input.setAttribute("disabled", "disabled");

    });

  }
};

// Mostrar ou ocultar o carregador
const toggleLoader = () => {

  const fadeElement = document.querySelector("#fade");
  const loaderElement = document.querySelector("#loader");

  // O método toggle pertence ao objeto classList de um elemento. 
  // Ele irá inserir a classe caso não exista e remover caso exista. 
  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");

};

// Mostrar ou ocultar mensagem
const toggleMessage = (msg) => {
  const fadeElement = document.querySelector("#fade");
  const messageElement = document.querySelector("#message");

  const messageTextElement = document.querySelector("#message p");

  messageTextElement.innerText = msg;

  // O método toggle pertence ao objeto classList de um elemento. 
  // Ele irá inserir a classe caso não exista e remover caso exista.
  fadeElement.classList.toggle("hide");
  messageElement.classList.toggle("hide");
  
};

// Fechar mensagem de erro do modal
closeButton.addEventListener("click", () => toggleMessage());

// Salvar endereço
addressForm.addEventListener("submit", (e) => {
  
  // preventDefault() serve para prevenir o comportamento padrão de um evento
  // Usamos o preventDefault pois não queremos que ele seja submetido da forma padrão.
  e.preventDefault();

  // Habilitando o loader
  toggleLoader();

  // Estimulando um delay, com setTimeout
  setTimeout(() => {

    toggleLoader();

    toggleMessage("Endereço salvo com sucesso!");

    addressForm.reset();

    toggleDisabled();

  }, 1000);

});
