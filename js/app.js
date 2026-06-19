
// Correções automáticas
function getSafeStorage(key){
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch(e){ console.warn('Erro ao ler',key,e); return []; }
}
document.addEventListener('DOMContentLoaded',()=>{ try{ atualizarDashboard(); }catch(e){} });
function mostrarTela(id){

    document
        .querySelectorAll(".tela")
        .forEach(tela=>{
            tela.classList.add("escondida");
            tela.style.display = "none";
        });

    const tela = document.getElementById(id);
    if(tela){
        tela.classList.remove("escondida");
        tela.style.display = "block";
    }
}

let clienteEditando = null;
let veiculoEditando = null;

let clientes = getSafeStorage("clientes");

let veiculos = getSafeStorage("veiculos");

let ordens = getSafeStorage("ordens");

let pecas = getSafeStorage("pecas");

let historico = getSafeStorage("historico");

function atualizarDashboard(){

    totalClientes.textContent =
        clientes.length;

    totalVeiculos.textContent =
        veiculos.length;

    totalPecas.textContent =
        pecas.length;

    totalHistorico.textContent =
        historico.length;

    const abertas =
        ordens.filter(
            os => os.status === "Aberta"
        ).length;

    totalOrdens.textContent =
        abertas;

        const total = historico.reduce(
    (soma,item)=>
    soma + Number(item.valor || 0),
    0
);

valorTotal.textContent =
    "R$ " + total.toFixed(2);

    
}

atualizarDashboard();

function salvarCliente(){

    const nome =
        document.getElementById("clienteNome").value;

    const cpf =
        document.getElementById("clienteCpf").value;

    const telefone =
        document.getElementById("clienteTelefone").value;

    const email =
        document.getElementById("clienteEmail").value;

    if(
        nome === "" ||
        cpf === ""
    ){
        alert("Preencha nome e CPF");
        return;
    }

    if(clienteEditando !== null){

        clientes[clienteEditando] = {
            nome,
            cpf,
            telefone,
            email
        };

        clienteEditando = null;

    }else{

        clientes.push({
            nome,
            cpf,
            telefone,
            email
        });

    }

    salvarDados();

    limparFormularioCliente();

    renderizarClientes();

    atualizarSelectClientes();

    atualizarSelectOS();
}

function salvarDados(){

    localStorage.setItem(
        "clientes",
        JSON.stringify(clientes)
    );

    localStorage.setItem(
        "veiculos",
        JSON.stringify(veiculos)
    );

    localStorage.setItem(
        "ordens",
        JSON.stringify(ordens)
    );

    localStorage.setItem(
        "pecas",
        JSON.stringify(pecas)
    );

    localStorage.setItem(
        "historico",
        JSON.stringify(historico)
    );

    atualizarDashboard();
}

function limparFormularioCliente(){

    clienteNome.value = "";
    clienteCpf.value = "";
    clienteTelefone.value = "";
    clienteEmail.value = "";
}


function renderizarClientes(){

    let html = "";

    clientes.forEach((cliente,index)=>{

        html += `

        <div class="item">

            <h3>${cliente.nome}</h3>

            <p>
                CPF:
                ${cliente.cpf}
            </p>

            <p>
                Telefone:
                ${cliente.telefone}
            </p>

            <p>
                E-mail:
                ${cliente.email}
            </p>

            <button
                onclick="editarCliente(${index})">
                Editar
            </button>

            <button
                onclick="excluirCliente(${index})">
                Excluir
            </button>

        </div>

        `;
    });

    listaClientes.innerHTML = html;
}

function editarCliente(index){

    const cliente =
        clientes[index];

    clienteNome.value =
        cliente.nome;

    clienteCpf.value =
        cliente.cpf;

    clienteTelefone.value =
        cliente.telefone;

    clienteEmail.value =
        cliente.email;

    clienteEditando = index;
}

function excluirCliente(index){

    const confirmar =
        confirm(
            "Deseja excluir este cliente?"
        );

    if(!confirmar) return;

    clientes.splice(index,1);

    salvarDados();

    renderizarClientes();

    atualizarSelectClientes();
}

function pesquisarCliente(){

    const termo =
        pesquisaCliente.value
        .toLowerCase();

    const filtrados =
        clientes.filter(cliente=>{

            return (
                cliente.nome
                .toLowerCase()
                .includes(termo)

                ||

                cliente.cpf
                .includes(termo)
            );
        });

    let html = "";

    filtrados.forEach((cliente,index)=>{

        html += `

        <div class="item">

            <h3>${cliente.nome}</h3>

            <p>${cliente.cpf}</p>

        </div>

        `;
    });

    listaClientes.innerHTML = html;
}


function atualizarSelectClientes(){

    let html =
    `<option value="">
        Selecione o Cliente
    </option>`;

    clientes.forEach(cliente=>{

        html += `
            <option value="${cliente.nome}">
                ${cliente.nome}
            </option>
        `;
    });

    clienteVeiculo.innerHTML = html;
}

function salvarVeiculo(){

    const placa =
        document.getElementById("placa")
        .value
        .toUpperCase();

    const marca =
        document.getElementById("marca")
        .value;

    const modelo =
        document.getElementById("modelo")
        .value;

    const ano =
        document.getElementById("ano")
        .value;

    const cor =
        document.getElementById("cor")
        .value;

    const cliente =
        document.getElementById("clienteVeiculo")
        .value;

    if(
        placa === "" ||
        cliente === ""
    ){
        alert("Preencha os campos obrigatórios");
        return;
    }

    if(veiculoEditando === null){

        const placaExiste =
            veiculos.some(v=>v.placa===placa);

        if(placaExiste){

            alert("Placa já cadastrada");
            return;
        }

        veiculos.push({

            placa,
            marca,
            modelo,
            ano,
            cor,
            cliente

        });

    }else{

        veiculos[veiculoEditando] = {

            placa,
            marca,
            modelo,
            ano,
            cor,
            cliente

        };

        veiculoEditando = null;
    }

    salvarDados();

    limparFormularioVeiculo();

    renderizarVeiculos();

    atualizarSelectOS();
}

function limparFormularioVeiculo(){

    placa.value = "";
    marca.value = "";
    modelo.value = "";
    ano.value = "";
    cor.value = "";

    clienteVeiculo.value = "";
}

function renderizarVeiculos(){

    let html = "";

    veiculos.forEach((veiculo,index)=>{

        html += `

        <div class="item">

            <h3>
                ${veiculo.modelo}
            </h3>

            <p>
                Placa:
                ${veiculo.placa}
            </p>

            <p>
                Marca:
                ${veiculo.marca}
            </p>

            <p>
                Ano:
                ${veiculo.ano}
            </p>

            <p>
                Cor:
                ${veiculo.cor}
            </p>

            <p>
                Cliente:
                ${veiculo.cliente}
            </p>

            <button
                onclick="editarVeiculo(${index})">
                Editar
            </button>

            <button
                onclick="excluirVeiculo(${index})">
                Excluir
            </button>

        </div>

        `;
    });

    listaVeiculos.innerHTML = html;
}

function editarVeiculo(index){

    const veiculo =
        veiculos[index];

    placa.value =
        veiculo.placa;

    marca.value =
        veiculo.marca;

    modelo.value =
        veiculo.modelo;

    ano.value =
        veiculo.ano;

    cor.value =
        veiculo.cor;

    clienteVeiculo.value =
        veiculo.cliente;

    veiculoEditando = index;
}

function excluirVeiculo(index){

    const confirmar =
        confirm(
            "Excluir veículo?"
        );

    if(!confirmar) return;

    veiculos.splice(index,1);

    salvarDados();

    renderizarVeiculos();
}

function pesquisarVeiculo(){

    const termo =
        pesquisaVeiculo.value
        .toLowerCase();

    const filtrados =
        veiculos.filter(veiculo=>{

            return (

                veiculo.placa
                .toLowerCase()
                .includes(termo)

                ||

                veiculo.modelo
                .toLowerCase()
                .includes(termo)

                ||

                veiculo.cliente
                .toLowerCase()
                .includes(termo)

            );
        });

    let html = "";

    filtrados.forEach(veiculo=>{

        html += `

        <div class="item">

            <h3>
                ${veiculo.modelo}
            </h3>

            <p>
                ${veiculo.placa}
            </p>

            <p>
                ${veiculo.cliente}
            </p>

        </div>

        `;
    });

    listaVeiculos.innerHTML = html;
}


let osEditando = null;

function atualizarSelectOS(){

    let clientesHTML =
    `<option value="">
        Selecione o Cliente
    </option>`;

    clientes.forEach(cliente=>{

        clientesHTML += `
        <option value="${cliente.nome}">
            ${cliente.nome}
        </option>`;
    });

    osCliente.innerHTML =
        clientesHTML;

    let veiculosHTML =
    `<option value="">
        Selecione o Veículo
    </option>`;

    veiculos.forEach(veiculo=>{

        veiculosHTML += `
<option value="${veiculo.placa}">
    ${veiculo.modelo} (${veiculo.placa})
</option>`;
    });

    osVeiculo.innerHTML =
        veiculosHTML;
}

function salvarOS(){

    const cliente =
        osCliente.value;

    const veiculo =
        osVeiculo.value;

    const descricao =
        descricaoOS.value;

    const valor =
        valorOS.value;

    const data =
        dataOS.value;

    const status =
        statusOS.value;

    if(
        cliente === "" ||
        veiculo === "" ||
        descricao === ""
    ){
        alert(
            "Preencha todos os campos"
        );
        return;
    }

    const ordem = {

        cliente,
        veiculo,
        descricao,
        valor,
        data,
        status

    };

    if(osEditando !== null){

        ordens[osEditando] = ordem;

        osEditando = null;

    }else{

        ordens.push(ordem);

    }

    if(status === "Concluída"){

        historico.push({

            cliente,
            veiculo,
            descricao,
            valor,
            data

        });
    }

    salvarDados();

    renderizarOS();

    renderizarHistorico();

    limparOS();
}

function limparOS(){

    osCliente.value = "";
    osVeiculo.value = "";
    descricaoOS.value = "";
    valorOS.value = "";
    dataOS.value = "";

    statusOS.value = "Aberta";
}

function renderizarOS(){

    let html = "";

    ordens.forEach((os,index)=>{

        html += `

        <div class="item">

            <h3>
                ${os.descricao}
            </h3>

            <p>
                Cliente:
                ${os.cliente}
            </p>

            <p>
                Veículo:
                ${os.veiculo}
            </p>

            <p>
                Valor:
                R$ ${os.valor}
            </p>

            <p>
                Data:
                ${os.data}
            </p>

            <p>
                Status:
                ${os.status}
            </p>

            <button
                onclick="editarOS(${index})">
                Editar
            </button>

            <button
                onclick="excluirOS(${index})">
                Excluir
            </button>

        </div>

        `;
    });

    listaOS.innerHTML = html;
}

function editarOS(index){

    const os =
        ordens[index];

    osCliente.value =
        os.cliente;

    osVeiculo.value =
        os.veiculo;

    descricaoOS.value =
        os.descricao;

    valorOS.value =
        os.valor;

    dataOS.value =
        os.data;

    statusOS.value =
        os.status;

    osEditando = index;
}

function excluirOS(index){

    if(
        !confirm(
            "Excluir esta ordem?"
        )
    ) return;

    ordens.splice(index,1);

    salvarDados();

    renderizarOS();
}

function renderizarHistorico(){

    let html = "";

    historico.forEach(item=>{

        html += `

        <div class="item">

            <h3>
                ${item.descricao}
            </h3>

            <p>
                Cliente:
                ${item.cliente}
            </p>

            <p>
                Veículo:
                ${item.veiculo}
            </p>

            <p>
                Data:
                ${item.data}
            </p>

            <p>
                Valor:
                R$ ${item.valor}
            </p>

        </div>

        `;
    });

    listaHistorico.innerHTML =
        html;
}


let pecaEditando = null;

function salvarPeca(){

    const codigo =
        codigoPeca.value;

    const nome =
        nomePeca.value;

    const quantidade =
        Number(
            quantidadePeca.value
        );

    const valor =
        Number(
            valorPeca.value
        );

    if(
        codigo === "" ||
        nome === ""
    ){
        alert("Preencha os campos");
        return;
    }

    const peca = {

        codigo,
        nome,
        quantidade,
        valor

    };

    if(pecaEditando !== null){

        pecas[pecaEditando] = peca;

        pecaEditando = null;

    }else{

        pecas.push(peca);
    }

    salvarDados();

    renderizarPecas();

    limparPeca();
}

function limparPeca(){

    codigoPeca.value = "";
    nomePeca.value = "";
    quantidadePeca.value = "";
    valorPeca.value = "";
}

function renderizarPecas(){

    let html = "";

    pecas.forEach((peca,index)=>{

        let alerta = "";

        if(peca.quantidade <= 5){

            alerta = `
                <p class="estoque-baixo">
                    Estoque baixo
                </p>
            `;

        }

        html += `

        <div class="item">

            <h3>
                ${peca.nome}
            </h3>

            <p>
                Código:
                ${peca.codigo}
            </p>

            <p>
                Quantidade:
                ${peca.quantidade}
            </p>

            <p>
                Valor:
                R$ ${peca.valor}
            </p>

            ${alerta}

            <button
                onclick="editarPeca(${index})">
                Editar
            </button>

            <button
                onclick="excluirPeca(${index})">
                Excluir
            </button>

        </div>

        `;
    });

    listaPecas.innerHTML = html;
}

function editarPeca(index){

    const peca =
        pecas[index];

    codigoPeca.value =
        peca.codigo;

    nomePeca.value =
        peca.nome;

    quantidadePeca.value =
        peca.quantidade;

    valorPeca.value =
        peca.valor;

    pecaEditando = index;
}

function excluirPeca(index){

    if(
        !confirm(
            "Excluir peça?"
        )
    ) return;

    pecas.splice(index,1);

    salvarDados();

    renderizarPecas();
}

function pesquisarPeca(){

    const termo =
        pesquisaPeca.value
        .toLowerCase();

    const filtradas =
        pecas.filter(peca=>{

            return (

                peca.nome
                .toLowerCase()
                .includes(termo)

                ||

                peca.codigo
                .toLowerCase()
                .includes(termo)

            );

        });

    let html = "";

    filtradas.forEach(peca=>{

        html += `

        <div class="item">

            <h3>
                ${peca.nome}
            </h3>

            <p>
                ${peca.codigo}
            </p>

        </div>

        `;
    });

    listaPecas.innerHTML = html;
}

renderizarClientes();
renderizarVeiculos();
renderizarOS();
renderizarHistorico();
renderizarPecas();

atualizarDashboard();

atualizarSelectClientes();
atualizarSelectOS();

mostrarTela('dashboard');

function ativarMenu(botao){
    document
        .querySelectorAll('.sidebar button')
        .forEach(btn=>btn.classList.remove('ativo'));

    botao.classList.add('ativo');
}