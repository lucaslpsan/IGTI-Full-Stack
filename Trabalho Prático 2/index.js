var fs = require('fs');

let estados = leitura('JSON_input', 'Estados');
let municipios = leitura('JSON_input', 'Cidades');

// geraEstados();
console.log(quantCidadesUF('GO'));
cincoMaioresUF();
cincoMenoresUF();
console.log('\x1b[36m%s\x1b[0m', '***** Maiores *****');
maioresNomesCidades();
console.log('\x1b[36m%s\x1b[0m', '***** Menores *****');
menoresNomesCidades();
console.log('\x1b[33m%s\x1b[0m', '***** Maior nome *****');
maiorNomeCidade();
console.log('\x1b[33m%s\x1b[0m', '***** Menor nome *****');
menorNomeCidade();

function leitura(path, nome) {
  return JSON.parse(fs.readFileSync(`./${path}/${nome}.json`, 'utf8'));
}

function salvamento(path, nome, data) {
  fs.writeFile(
    `./JSON_output/${path}/${nome}.json`,
    JSON.stringify(data),
    (err) => {
      if (err) throw err;
      console.log(`${nome}.json foi salvo`);
    }
  );
}

function geraEstados() {
  estados.forEach((estado) => {
    let municipiosEstadoAtual = municipios.filter(
      (municipio) => municipio.Estado == estado.ID
    );

    salvamento('estados', estado.Sigla, municipiosEstadoAtual);
  });
}

function quantCidadesUF(UF) {
  let estado = leitura('JSON_output/estados', UF);
  return estado.length;
}

function quantificaEstados() {
  let classificaoEstado = [];

  estados.forEach((estado) => {
    classificaoEstado.push({
      UF: estado.Sigla,
      quant: quantCidadesUF(estado.Sigla),
    });
  });

  classificaoEstado.sort((a, b) => {
    return b.quant - a.quant;
  });

  return classificaoEstado;
}

function montaRetornoQuantEstado(arrayEstados) {
  let retorno = '[';

  arrayEstados.forEach((estado) => {
    retorno += `${estado.UF} - ${estado.quant}, `;
  });

  retorno = retorno.replace(/\, $/, '') + ']';

  return retorno;
}

function soma(array) {
  let soma = array.reduce((acc, curr) => {
    return acc + curr.quant;
  }, 0);

  return soma;
}

function cincoMaioresUF() {
  let cincoMaiores = quantificaEstados().filter((estado, index) => index < 5);

  console.log(
    montaRetornoQuantEstado(cincoMaiores) + ' Soma: ' + soma(cincoMaiores)
  );
}

function cincoMenoresUF() {
  let cincoMenores = quantificaEstados().filter((estado, index) => index > 21);

  console.log(
    montaRetornoQuantEstado(cincoMenores) + ' Soma: ' + soma(cincoMenores)
  );
}

function classificaNomesCidadesPorUF(maior = true) {
  let nomes = [];

  estados.forEach((estado) => {
    let municipiosEstadoAtual = leitura('JSON_output/estados', estado.Sigla);

    municipiosEstadoAtual.sort((a, b) => {
      if (a.Nome.length > b.Nome.length) return -1;
      if (a.Nome.length < b.Nome.length) return 1;
      return b.Nome - a.Nome;
    });

    if (maior)
      nomes.push({
        UF: estado.Sigla,
        nomeCidade: municipiosEstadoAtual[0].Nome,
      });
    else
      nomes.push({
        UF: estado.Sigla,
        nomeCidade:
          municipiosEstadoAtual[municipiosEstadoAtual.length - 1].Nome,
      });
  });

  return nomes;
}

function maioresNomesCidades() {
  let maiores = classificaNomesCidadesPorUF(true);

  console.log(montaNomesCidades(maiores));
}

function menoresNomesCidades() {
  let menores = classificaNomesCidadesPorUF(false);

  console.log(montaNomesCidades(menores));
}

function montaNomesCidades(arrayCidades) {
  let retorno = '[';

  arrayCidades.forEach((cidade) => {
    retorno += `${cidade.nomeCidade} - ${cidade.UF}, `;
  });

  retorno = retorno.replace(/\, $/, '') + ']';

  return retorno;
}

function classificaNomesTodasCidades(maior = true) {
  let classficacao = classificaNomesCidadesPorUF(maior);

  classficacao.sort((a, b) => {
    if (a.nomeCidade.length > b.nomeCidade.length) return -1;
    if (a.nomeCidade.length < b.nomeCidade.length) return 1;
    if (a.nomeCidade > b.nomeCidade) return -1;
    if (a.nomeCidade < b.nomeCidade) return 1;
    return 0;
  });

  return classficacao;
}

function maiorNomeCidade() {
  let maior = classificaNomesTodasCidades(true);

  console.log(`${maior[0].nomeCidade} - ${maior[0].UF}`);
}

function menorNomeCidade() {
  let menor = classificaNomesTodasCidades(false);

  console.log(
    `${menor[menor.length - 1].nomeCidade} - ${menor[menor.length - 1].UF}`
  );
}
