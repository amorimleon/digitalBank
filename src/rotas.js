const express = require("express");
const {
  todasAsContas,
  criarConta,
  atualizarUsuario,
  deletarUsuario,
  depositar,
  sacar,
  tranferir,
  saldo,
  extrato,
} = require("./controladores/controladores");
const {
  verificaCpfEmail,
  verificarValores,
  verificarCampos,
  buscarConta,
  verificarSenha,
  verificarContaDelete,
  verificacaoTransferencia,
  verificarValorDeposito,
} = require("./intermediadores");

const rotas = express();

rotas.get("/contas", verificarValores, verificarSenha, todasAsContas);

rotas.post(
  "/contas",
  verificarCampos,
  verificarValores,
  verificaCpfEmail,
  criarConta
);

rotas.put(
  "/contas/:numeroConta/usuario",
  verificarCampos,
  verificarValores,
  buscarConta,
  verificaCpfEmail,
  atualizarUsuario
);

rotas.delete("/contas/:numeroConta", verificarContaDelete, deletarUsuario);

rotas.post(
  "/transacoes/depositar",
  verificarValores,
  buscarConta,
  verificarValorDeposito,
  depositar
);

rotas.post(
  "/transacoes/sacar",
  verificarValores,
  buscarConta,
  verificarSenha,
  sacar
);

rotas.post(
  "/transacoes/transferir",
  verificarValores,
  verificacaoTransferencia,
  verificarSenha,
  tranferir
);

rotas.get(
  "/contas/saldo",
  verificarValores,
  buscarConta,
  verificarSenha,
  saldo
);

rotas.get(
  "/contas/extrato",
  verificarValores,
  buscarConta,
  verificarSenha,
  extrato
);

module.exports = rotas;
