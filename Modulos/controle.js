// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAe4MQXyH6sgj-EunF4PLc3FioxwC2swug",
    authDomain: "petrogas-ae62a.firebaseapp.com",
    projectId: "petrogas-ae62a",
    storageBucket: "petrogas-ae62a.appspot.com",
    messagingSenderId: "855753166012",
    appId: "1:855753166012:web:21bba49b60035d245254b9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var usuario = null;

// Começamos aqui 

const db = firebase.firestore();



firebase.auth().onAuthStateChanged((val)=>{

if(val){
        usuario=val;

//Ouvir por mudanças no banco de dados.

db.collection('registrosEntregas').where("userId","==",usuario.uid).onSnapshot((data)=>{
        let list = document.querySelector('#registrosEntregas');
        list.innerHTML = "";
        let registrosEntregas = data.docs;
        registrosEntregas = registrosEntregas.sort(function(a,b){
            if(a.data().horario < b.data().horario)
                return +1;
            else
                return -1;
            })
        registrosEntregas.map((val)=>{
        
            list.innerHTML+=`
            <li>
            <div class="containerCard">
                <div class="deco01"><p>${val.data().codBarra}</p></div>
                <div class="card">
                    <div class="cardTop">
                    <a registrosEntregas-id="${val.id}" class="confirmar-reset-btn reset" href="javascript:void(0)">
                            <i style="color:${val.data().color}" class="bi bi-fire"></i>
                    </a>
                        <h4>${val.data().cliente}</h4>
                    </div>
                    <div class="cardQuite">
                        <div class="val">
                        <label>VALOR: </label>
                        <p>R$ ${val.data().valor}</p>
                        </div>
                        <div class="pag">
                            <label>PAGAMENTO:</label>
                            <p>${val.data().pagamento}</p>
                        </div>
                    </div>
                    <div class="cardLow">
                        <div class="hora">
                        <a registrosEntregas-id="${val.id}" class="confirmar-inicio-btn inicio" href="javascript:void(0)">
                            <i class="bi bi-box-arrow-right"></i>
                        </a>
                        <p>${val.data().hora01} hr</p>
                        </div>
                        <div class="hora">
                        <a registrosEntregas-id="${val.id}" class="confirmar-entrega-btn complete" href="javascript:void(0)">
                            <i class="bi bi-clipboard-check"></i>
                        </a>
                        <p>${val.data().hora02} hr</p>
                        </div>
                        <h6>${val.data().entregador}</h6>
                    </div>
                </div>
                <div class="deco02">
                <div class="excluirPonto"><a registrosEntregas-id="${val.id}" class="excluir-btn" href="javascript:void(0)"><i class="bi bi-trash"></i></a></div></div>
            </div>`
        })

//---------------------------------------------------------------------------------------------------
       // Adicione um ouvinte de eventos ao botão de confirmação de início
        var confirmarInicioBtn = document.querySelectorAll('.confirmar-inicio-btn');

        confirmarInicioBtn.forEach(element => {
            element.addEventListener('click', function (e) {
                e.preventDefault();

                // Obtém o docId do atributo personalizado
                let docId = element.getAttribute('registrosEntregas-id');

                // Obtém o registro correspondente no banco de dados
                let registroRef = db.collection('registrosEntregas').doc(docId);

                // Obter os dados do registro
                registroRef.get().then((doc) => {
                    if (doc.exists) {
                        // Verifica se hora02 é igual a "--:--" e hora01 é igual a "--:--"
                        if (doc.data().hora02 === "--:--" && doc.data().hora01 === "--:--") {
                            // Se a condição for atendida, exibe a confirmação
                            const confirmacao = confirm("Deseja realmente iniciar esta entrega?");
                            if (confirmacao) {
                                // Atualiza informações no banco de dados
                                const dataAtual = new Date();
                                const hora = dataAtual.getHours();
                                const minutos = dataAtual.getMinutes();

                                const horaFormatada = `${hora < 10 ? '0' + hora : hora}:${minutos < 10 ? '0' + minutos : minutos}`;

                                // Atualiza o registro com a nova informação
                                registroRef.update({
                                    color: 'yellow',
                                    hora01: horaFormatada
                                });
                            }
                        } else {
                            alert("A entrega não pode ser iniciada. Saida já registrada ou entrega já finalizada.");
                        }
                    } else {
                        console.log("Registro não encontrado");
                    }
                }).catch((error) => {
                    console.log("Erro ao obter registro:", error);
                });
            });
        });
//---------------------------------------------------------------------------------------------------
       // Adicione um ouvinte de eventos ao botão de confirmação de entrega
        var confirmarEntregaBtn = document.querySelectorAll('.confirmar-entrega-btn');

        confirmarEntregaBtn.forEach(element => {
            element.addEventListener('click', function (e) {
                e.preventDefault();

                // Obtém o docId do atributo personalizado
                let docId = element.getAttribute('registrosEntregas-id');

                // Obtém o registro correspondente no banco de dados
                let registroRef = db.collection('registrosEntregas').doc(docId);

                // Obter os dados do registro
                registroRef.get().then((doc) => {
                    if (doc.exists) {
                        // Verifica se hora01 é diferente de "--:--"
                        if (doc.data().hora01 !== "--:--") {
                            // Se a condição for atendida, exibe a confirmação
                            const confirmacao = confirm("Deseja realmente confirmar esta entrega?");
                            if (confirmacao) {
                                // Atualiza informações no banco de dados
                                const dataAtual = new Date();
                                const hora = dataAtual.getHours();
                                const minutos = dataAtual.getMinutes();

                                const horaFormatada = `${hora < 10 ? '0' + hora : hora}:${minutos < 10 ? '0' + minutos : minutos}`;

                                // Atualiza o registro com a nova informação
                                registroRef.update({
                                    color: 'green',
                                    hora02: horaFormatada
                                });
                            }
                        } else {
                            alert("A entrega não pode ser confirmada. Saida não registrada.");
                        }
                    } else {
                        console.log("Registro não encontrado");
                    }
                }).catch((error) => {
                    console.log("Erro ao obter registro:", error);
                });
            });
        });
//---------------------------------------------------------------------------------------------------
         // Adicione um ouvinte de eventos ao botão de confirmação de reset
        var confirmarInicioBtn = document.querySelectorAll('.confirmar-reset-btn');

        confirmarInicioBtn.forEach(element => {
            element.addEventListener('click', function (e) {
                e.preventDefault();

                const confirmacao = confirm("Deseja realmente resetar esta entrega?");

                // Verificar se a senha está correta
                if (confirmacao) {
                    const senhaDigitada = prompt("Digite a senha para confirmar o reset:");
                    if (senhaDigitada === "9797") {
                        // Se o usuário confirmar, atualizar informações no banco de dados
                        const dataAtual = new Date();
                        const hora = dataAtual.getHours();
                        const minutos = dataAtual.getMinutes();

                        const horaFormatada = `${hora < 10 ? '0' + hora : hora}:${minutos < 10 ? '0' + minutos : minutos}`;

                        let docId = element.getAttribute('registrosEntregas-id');
                        db.collection('registrosEntregas').doc(docId).update({
                            color: 'red',
                            hora01: '--:--',
                            hora02: '--:--'
                        });
                    }
                } else {
                    alert("Senha incorreta. Operação cancelada.");
                }
            });
        });
//---------------------------------------------------------------------------------------------------
         //Filtro para pesquisar item
  
         const filtroProdutoInput = document.getElementById('filtroProduto2');
  
         filtroProdutoInput.addEventListener('input', function () {
             const termoFiltro = filtroProdutoInput.value.toLowerCase();
             const listaRegistros = document.querySelector('#registrosEntregas');
             
             // Itera sobre os itens da lista e mostra ou esconde com base no filtro
             Array.from(listaRegistros.children).forEach(item => {
                 const textoItem = item.textContent.toLowerCase();
                 const correspondeAoFiltro = textoItem.includes(termoFiltro);
 
                 item.style.display = correspondeAoFiltro ? 'block' : 'none';
             });
         });
//---------------------------------------------------------------------------------------------------
        var excluiRegistros = document.querySelectorAll('.excluir-btn');

        excluiRegistros.forEach(element => {
            element.addEventListener('click',function(e){
                e.preventDefault();
                let docId = element.getAttribute('registrosEntregas-id');

                db.collection('registrosEntregas').doc(docId).delete();
            })
        });
//---------------------------------------------------------------------------------------------------
        // Limpar o conteúdo atual da tabela
        tabelaRegistros.innerHTML = "";

        // Iterar sobre os documentos recuperados do Firestore
        data.forEach((doc) => {
            const registro = doc.data();

            // Criar uma nova linha na tabela
            const novaLinha = document.createElement('tr');

            // Preencher as células da linha com os dados do documento
            novaLinha.innerHTML = `
                <td>${registro.cliente}</td>
                <td>${registro.pagamento}</td>
                <td>${registro.qtd}</td>
                <td>R$ ${registro.valor}</td>
                <td>${new Date(registro.horario).toLocaleDateString()}</td>
                <td>${registro.entregador}</td>
            `;

            // Adicionar a nova linha à tabela
            tabelaRegistros.appendChild(novaLinha);
        });
//---------------------------------------------------------------------------------------------------

        // Obtém a referência para o elemento <p> da data atual
        const dataAtualElement = document.getElementById('data-atual');

        // Obtém a data atual
        const dataAtual = new Date();

        // Formata a data atual para exibição (por exemplo, "dd/mm/aaaa")
        const formatoData = { day: 'numeric', month: 'numeric', year: 'numeric' };
        const dataFormatada = dataAtual.toLocaleDateString(undefined, formatoData);

        // Atualiza o conteúdo do elemento <p> com a data atual
        dataAtualElement.textContent = 'Entregas do dia: ' + dataFormatada;
//---------------------------------------------------------------------------------------------------

        // Inicialize a variável para armazenar a soma da quantidade
        let somaQtd = 0;

        // Itere sobre os registros e calcule a soma da quantidade
        registrosEntregas.forEach((registro) => {
            // Verifique se o registro é do dia atual
            const dataRegistro = new Date(registro.data().horario).toLocaleDateString();
            const dataAtualFormatada = dataAtual.toLocaleDateString();

            if (dataRegistro === dataAtualFormatada) {
                // Converta o valor da quantidade para número antes de somar
                somaQtd += parseInt(registro.data().qtd, 10);
            }
        });
        const contagemTotal = document.getElementById('contagemTotal');
        //console.log('Soma da quantidade do dia atual:', somaQtd);
        contagemTotal.textContent = somaQtd;
//---------------------------------------------------------------------------------------------------
        let somaQtdDinheiro = 0;

        // Obtenha a data atual formatada
        const dataAtualFormatada = new Date().toLocaleDateString();

        // Itere sobre os registros e calcule a soma da quantidade para pagamento "Dinheiro" ou "Dinheiro Trocado"
        registrosEntregas.forEach((registro) => {
            // Converta o horário do registro para uma data
            const dataRegistro = new Date(registro.data().horario).toLocaleDateString();

            // Verifique se o registro é do dia atual e a forma de pagamento inclui "Dinheiro"
            if (dataRegistro === dataAtualFormatada && (registro.data().pagamento.includes('Dinheiro') || registro.data().pagamento.includes('Dinheiro Trocado'))) {
                // Converta o valor da quantidade para número antes de somar
                somaQtdDinheiro += parseInt(registro.data().qtd, 10);
            }
        });

        const contagemDinheiro = document.getElementById('contagemDinheiro');
        //console.log('Soma da quantidade do dia atual:', somaQtd);
        contagemDinheiro.textContent = somaQtdDinheiro;

//---------------------------------------------------------------------------------------------------
            let somaQtdPix = 0;

            // Itere sobre os registros e calcule a soma da quantidade para pagamento "Dinheiro"
            registrosEntregas.forEach((registro) => {
                // Converta o horário do registro para uma data
                const dataRegistro = new Date(registro.data().horario).toLocaleDateString();

                // Verifique se o registro é do dia atual e o pagamento é "Dinheiro"
                if (dataRegistro === dataAtualFormatada && registro.data().pagamento === 'Pix') {
                    // Converta o valor da quantidade para número antes de somar
                    somaQtdPix += parseInt(registro.data().qtd, 10);
                }
            });

            const contagemPix = document.getElementById('contagemPix');
            //console.log('Soma da quantidade do dia atual:', somaQtd);
            contagemPix.textContent = somaQtdPix;
//---------------------------------------------------------------------------------------------------
            let somaQtdCartao = 0;

            // Itere sobre os registros e calcule a soma da quantidade para pagamento "Dinheiro"
            registrosEntregas.forEach((registro) => {
                // Converta o horário do registro para uma data
                const dataRegistro = new Date(registro.data().horario).toLocaleDateString();

                // Verifique se o registro é do dia atual e o pagamento é "Dinheiro"
                if (dataRegistro === dataAtualFormatada && registro.data().pagamento === 'Cartão') {
                    // Converta o valor da quantidade para número antes de somar
                    somaQtdCartao += parseInt(registro.data().qtd, 10);
                }
            });

            const contagemCartao = document.getElementById('contagemCartao');
            //console.log('Soma da quantidade do dia atual:', somaQtd);
            contagemCartao.textContent = somaQtdCartao;
//---------------------------------------------------------------------------------------------------

            })
  }
})





export function registrarComanda () {
          
            // Chame a função de registro aqui (a mesma lógica que no submit do formulário)
            let cliente = document.getElementById('cliente').value;
            let pagamento = document.getElementById('pagamento').value;
            let valor = document.getElementById('valor').value;
            let entregador = document.getElementById('entregador').value;
            let codBarra = document.getElementById('numberBarCode').innerText;
            let qtd = document.getElementById('qtd').value;
           

            if (cliente != "") {
                // Inserir e criar coleção caso não exista.
                db.collection('registrosEntregas').add({
                    color: 'red',
                    cliente: cliente,
                    pagamento: pagamento,
                    horario: new Date().getTime(),
                    userId: usuario.uid,
                    valor: valor,
                    hora01: "--:--",
                    hora02: "--:--",
                    entregador: entregador,
                    qtd: qtd,
                    codBarra: codBarra
                });
            } else{
                alert("Cliente Vazio");
            }

};