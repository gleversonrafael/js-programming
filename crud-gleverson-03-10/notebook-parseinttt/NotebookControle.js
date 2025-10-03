let listaNotebook = []; //conjunto de dados
let oQueEstaFazendo = ''; //variável global de controle
let notebookGlobal = null; //variavel global 

bloquearAtributos(true);

//backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaNotebook.length; i++) {
        const notebookAqui = listaNotebook[i];
        if (notebookAqui.id == chave) {
            notebookAqui.posicaoNaLista = i;
            return listaNotebook[i];
        }
    }
    return null;//não achou
}

// Função para procurar um elemento pela chave primária   -------------------------------------------------------------
function procure() {
    const id = document.getElementById("inputId").value;
    if (isNaN(id) || !Number.isInteger(Number(id))) {
        mostrarAviso("Precisa ser um número inteiro");
        document.getElementById("inputId").focus();
        return;
    }

    if (id) { // se digitou um readonlyId
        notebookGlobal = procurePorChavePrimaria(id);
        if (notebookGlobal) { //achou na lista
            mostrarDadosNotebook(notebookGlobal);
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir");

        } else { //não achou na lista
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else {
        document.getElementById("inputId").focus();
        return;
    }
}

//backend->frontend
function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clique o botão salvar");
    document.getElementById("inputId").focus();

}

// Função para alterar um elemento da lista
function alterar() {

    // Remove o readonly dos campos
    bloquearAtributos(false);

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clic o botão salvar");
}

// Função para excluir um elemento da lista
function excluir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clic o botão salvar para confirmar a exclusão");
}

function salvar() {
    //gerencia operações inserir, alterar e excluir na lista

    // obter os dados a partir do html
    let id;
    if (notebookGlobal == null) {
        id = parseInt(document.getElementById("inputId").value);
    } else {
        id = notebookGlobal.id;
    }

    const dados = {
        modelo: document.getElementById("inputModelo").value,
        fabricante: document.getElementById("inputFabricante").value,
      
        processador: document.getElementById("inputProcessador").value,
        fabricanteProcessador: document.getElementById("inputFabricanteProcessador").value,

        quantidadeRam: document.getElementById("inputQuantidadeRam").value,
        armazenamentoPermanente: document.getElementById("inputArmazenamentoPermanente").value,

        dataLancamento: obterDataLancamento()
    };

    console.log(dataLancamento);
    
    //verificar se o que foi digitado pelo USUÁRIO está correto
    if (
        id && dados.modelo && dados.fabricante && dados.processador && dados.fabricanteProcessador && dados.quantidadeRam && dados.armazenamentoPermanente && dataLancamento
    ) 
    {// se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                notebookGlobal = new Notebook
                (
                    id, dados.modelo, dados.fabricante, dados.processador, dados.fabricanteProcessador, dados.quantidadeRam, dados.armazenamentoPermanente, dados.dataLancamento, listaNotebook[listaNotebook.length]
                );

                listaNotebook.push(notebookGlobal);
                mostrarAviso("Inserido na lista");
                break;

            case 'alterando':
                let notebookAlterado = new Notebook
                (
                    id, dados.modelo, dados.fabricante, dados.processador, dados.fabricanteProcessador, dados.quantidadeRam, dados.armazenamentoPermanente, dados.dataLancamento, listaNotebook[notebookGlobal.posicaoNaLista]
                );

                listaNotebook[notebookGlobal.posicaoNaLista] = notebookAlterado;
                mostrarAviso("Alterado");
                break;

            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaNotebook.length; i++) {
                    if (notebookGlobal.posicaoNaLista != i) {
                        novaLista.push(listaNotebook[i]);
                    }
                }
                listaNotebook = novaLista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                // console.error('Ação não reconhecida: ' + oQueEstaFazendo);
                mostrarAviso("Erro aleatório");
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputId").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}

//extra
function obterDataLancamento() 
{
    document.getElementById("inputDataLancamento").value()
}

//backend
function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        texto +=
            linha.id + " - " +
            linha.nome + "<br>";
    }
    return texto;
}

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaNotebook);
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação de edição");
}

function mostrarAviso(mensagem) {
    //printa a mensagem na divAviso
    document.getElementById("divAviso").innerHTML = mensagem;
}

// Função para mostrar os dados do Notebook nos campos
function mostrarDadosNotebook(notebookLocal) {
    document.getElementById("inputId").value = notebookLocal.id;
    document.getElementById("inputNome").value = notebookLocal.nome;

    // Define os campos como readonly
    bloquearAtributos(true);
}

// Função para limpar os dados dos campos
function limparAtributos() {
    let propriedadesNotebookHTML = document.querySelectorAll(".bloqueavel");

    propriedadesNotebookHTML.forEach((elem) => 
    {
        elem.value = "";
    })

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    //quando a chave primaria possibilita edicao, tranca (readonly) os outros e vice-versa
    document.getElementById("inputId").readOnly = !soLeitura;

    let propriedadesNotebookHTML = document.querySelectorAll(".bloqueavel");

    propriedadesNotebookHTML.forEach((elem) => 
    {
        elem.readOnly = soLeitura;
    })
}

// Função para deixar visível ou invisível os botões
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    //  visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 
    //none significa que o botão ficará invisível (visibilidade == none)
    //inline significa que o botão ficará visível 

    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar; // o cancelar sempre aparece junto com o salvar
    document.getElementById("inputId").focus();
}

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
function persistirEmLocalPermanente(arquivoDestino, conteudo) {
    /*cria um blob (objeto que representa dados de arquivo) que armazena "[conteudo]" como arquivo de texto,
    criando um arquivo temporário*/
    const blob = new Blob([conteudo], { type: 'text/plain' });
    //cria o elemento "a" (link temporário) usado para adicionar o dowload do arquivo
    const link = document.createElement('a'); /*cria uma URL temporária que aponta para o blob e
    atribui ela ao href do link para que ele "aponte" para o arquivo gerado (permitindo seu download)*/
    link.href = URL.createObjectURL(blob);
    link.download = arquivoDestino; // Nome do arquivo de download
    link.click(); //inicia o processo de dowload automaticamente
    // Libera o objeto URL
    URL.revokeObjectURL(link.href); //remove a URL temporária que foi criada (liberando a memória)
}


// Função para abrir o seletor de arquivos para upload (para processar o arquivo selecionado)
function abrirArquivoSalvoEmLocalPermanente() {
    const input = document.createElement('input');
    //cria o elemento input do tipo file (serve para abrir o seletor de arquivos)
    input.type = 'file';
    input.accept = '.csv'; // Aceita apenas arquivos CSV do sistema local
    input.onchange = function (event) {
        /*associa uma função de evento ao onchange, que será chamada quando o usuário selecionar um arquivo
        O evento change é disparado quando um arquivo é selecionado*/
        const arquivo = event.target.files[0]; //acessa o arquivo selecionado e armazena na variavel arquivo
        console.log(arquivo.name);
        if (arquivo) {
            converterDeCSVparaListaObjeto(arquivo);
        }
        /*verifica se um arquivo foi selecionado: 
        se sim, chama a função processarArquivo e passa o arquivo selecionado como argumento
        permitindo que o arquivo seja lido e processado na função processarArquivo*/
    };
    input.click(); //seletor de arquivos exibido automaticamente    
}

function prepararESalvarCSV() { //gera um arquivo csv com as informações da lista. Vai enviar da memória RAM para dispositivo de armazenamento permanente.
    let nomeDoArquivoDestino = "./Notebook.csv";  //define o nome do arquivo csv
    let textoCSV = "";
    for (let i = 0; i < listaNotebook.length; i++) {
        const linha = listaNotebook[i]; //variavel linha contem as informações de cada Notebook
        textoCSV += linha.id + ";" +
            linha.nome + "\n";
    }
    persistirEmLocalPermanente(nomeDoArquivoDestino, textoCSV);
}


// Função para processar o arquivo CSV e transferir os dados para a listaNotebook
function converterDeCSVparaListaObjeto(arquivo) {
    const leitor = new FileReader();  //objeto que permite ler arquivos locais no navegador 
    leitor.onload = function (e) {
        const conteudo = e.target.result; // Conteúdo do arquivo CSV
        const linhas = conteudo.split('\n'); // Separa o conteúdo por linha
        listaNotebook = []; // Limpa a lista atual (se necessário)
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i].trim();  //linhas[i] representa cada linha do arquivo CSV
            if (linha) { //verifica se a linha não está vazia
                const dados = linha.split(';'); // Separa os dados por ';'
                if (dados.length === 2) { //verifica os seis campos
                    // Adiciona os dados à listaNotebook como um objeto
                    listaNotebook.push({
                        id: dados[0],
                        nome: dados[1],
                    });
                }
            }
        }
        listar(); //exibe a lista atualizada
    };
    leitor.readAsText(arquivo); // Lê o arquivo como texto
}

