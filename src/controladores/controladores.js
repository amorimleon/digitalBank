const bancodedados = require("../bancodedados");
let { contas } = require("../bancodedados");
const fs = require("fs/promises");
const { acharConta } = require("../intermediadores");

const todasAsContas = (req, res) => {
  res.send(contas);
};

let numeroConta;

const criarNumeroConta = () => {
  contas == ""
    ? (numeroConta = 0)
    : (numeroConta = contas[contas.length - 1].numero_conta);
};

const criarConta = (req, res) => {
  const body = req.body;
  criarNumeroConta();

  numeroConta++;
  let conta = {};
  conta["numero_conta"] = numeroConta;
  conta["saldo"] = 0;
  conta["usuario"] = body;

  contas.push(conta);
  escrevendoBody(bancodedados);

  res.status(204).json();
};

const escrevendoBody = async (bancodedados) => {
  const novoBanco = JSON.stringify(bancodedados);
  try {
    await fs.writeFile("./src/bancodedados.js", `module.exports =${novoBanco}`);
  } catch (erro) {
    return res.json(`Deu erro: ${erro.menssage}`);
  }
};

const atualizarUsuario = (req, res) => {
  const { numeroConta } = req.params;
  const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

  const usuarios = acharConta(numeroConta);
  usuarios.saldo = 0;
  usuarios.usuario.nome = nome;
  usuarios.usuario.cpf = cpf;
  usuarios.usuario.data_nascimento = data_nascimento;
  usuarios.usuario.telefone = telefone;
  usuarios.usuario.email = email;
  usuarios.usuario.senha = senha;

  escrevendoBody(bancodedados);

  return res.status(204).json();
};

const deletarUsuario = (req, res) => {
  const { numeroConta } = req.params;

  const usuarios = acharConta(numeroConta);

  let filter;

  if (usuarios.saldo !== 0) {
    return res.status(400).json({
      mensagem: "A conta só pode ser removida se o saldo for zero!",
    });
  } else if (usuarios.saldo === 0) {
    filter = contas.filter((conta) => {
      return conta.numero_conta !== +numeroConta;
    });
  }
  bancodedados.contas = filter;

  escrevendoBody(bancodedados);
  res.status(204).json();
};

const depositar = (req, res) => {
  const { numero_conta, valor } = req.body;
  const deposito = Number(valor);

  const usuario = acharConta(numero_conta);

  usuario.saldo += deposito;

  const data = new Date();

  const novaData = formatarData(data);

  const registroDeposito = registro(novaData, numero_conta, deposito);

  bancodedados.depositos.push(registroDeposito);

  escrevendoBody(bancodedados);

  res.status(200).json();
};

const formatarData = (data) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  const hora = String(data.getHours()).padStart(2, "0");
  const minutos = String(data.getMinutes()).padStart(2, "0");
  const segundos = String(data.getSeconds()).padStart(2, "0");

  const dataFormatada = `${ano}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;

  return dataFormatada;
};

const registro = (novaData, numero_conta, valor) => {
  const registro = {
    data: novaData,
    numero_conta,
    valor,
  };

  return registro;
};

const sacar = (req, res) => {
  const body = req.body;
  const { numero_conta, valor } = body;
  const saque = Number(valor);

  const usuarios = acharConta(numero_conta);

  if (usuarios.saldo >= saque) {
    usuarios.saldo -= saque;

    const data = new Date();

    const novaData = formatarData(data);

    const registroSaque = registro(novaData, numero_conta, saque);

    bancodedados.saques.push(registroSaque);
  } else {
    res.status(400).json({
      mensagem: "Saldo insuficiente!",
    });
  }

  res.status(200).json();

  escrevendoBody(bancodedados);
};

const tranferir = (req, res) => {
  const body = req.body;
  const { numero_conta_origem, numero_conta_destino, valor } = body;
  const Valortransferencia = Number(valor);

  const contaOrigem = acharConta(numero_conta_origem);
  const contaDestino = acharConta(numero_conta_destino);

  if (numero_conta_origem !== numero_conta_destino) {
    if (contaOrigem.saldo >= Valortransferencia) {
      contaOrigem.saldo -= Valortransferencia;
      contaDestino.saldo += Valortransferencia;

      const dataFormatada = formatarData(new Date());

      bancodedados.transferencias.push(
        registroTransferencia(
          dataFormatada,
          numero_conta_origem,
          numero_conta_destino,
          Valortransferencia
        )
      );

      escrevendoBody(bancodedados);
    } else {
      res.status(404).json({
        mensagem: "Saldo insuficiente!",
      });
    }
  } else {
    res.status(400).json({
      mensagem: "A conta de origem e destino não podem ser iguais!",
    });
  }

  res.status(200).json();
};

const registroTransferencia = (
  data,
  numero_conta_origem,
  numero_conta_destino,
  valor
) => {
  return {
    data: data,
    numero_conta_origem: numero_conta_origem,
    numero_conta_destino: numero_conta_destino,
    valor: valor,
  };
};

const saldo = (req, res) => {
  const { numero_conta } = req.query;
  const conta = acharConta(numero_conta);

  res.status(200).json({ mensagem: `${conta.saldo}` });
};

const extrato = (req, res) => {
  const { numero_conta, senha } = req.query;

  const depositos = filtrarRegistros(
    bancodedados.depositos,
    numero_conta,
    "numero_conta"
  );

  const saques = filtrarRegistros(
    bancodedados.saques,
    numero_conta,
    "numero_conta"
  );

  const transferenciasEnviadas = filtrarRegistros(
    bancodedados.transferencias,
    numero_conta,
    "numero_conta_origem"
  );

  const transferenciasRecebidas = filtrarRegistros(
    bancodedados.transferencias,
    numero_conta,
    "numero_conta_destino"
  );

  res.status(200).send({
    depositos,
    saques,
    transferenciasEnviadas,
    transferenciasRecebidas,
  });
};

const filtrarRegistros = (registros, numero_conta, campo) => {
  return registros.filter((registro) => registro[campo] === numero_conta);
};

module.exports = {
  todasAsContas,
  criarConta,
  atualizarUsuario,
  deletarUsuario,
  depositar,
  sacar,
  tranferir,
  saldo,
  extrato,
};
