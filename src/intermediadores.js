const { contas, banco } = require("./bancodedados");

const verificarCampos = (req, res, next) => {
  const body = req.body;
  const chaves = [
    "nome",
    "cpf",
    "data_nascimento",
    "telefone",
    "email",
    "senha",
  ];

  let validar = false;
  chaves.forEach((chave) => {
    if (!(chave in body)) {
      validar = true;
    }
  });

  if (validar) {
    return res.status(400).json({ mensagem: `Está faltando um campo` });
  }
  next();
};

const verificarValores = (req, res, next) => {
  const body = Object.values(req.body);
  const query = Object.values(req.query);

  if (query.length === 0) {
    let validar = false;
    for (const valor of body) {
      if (valor.trim() === "") {
        validar = true;
      }
    }
    if (validar) {
      return res.status(400).json({ mensage: "Preencha todos os campos" });
    } else {
      next();
    }
  } else {
    let validar = false;
    for (const valor of query) {
      if (valor.trim() === "") {
        validar = true;
      }
    }
    if (validar) {
      return res.status(401).json({ mensage: "Preencha todos os campos" });
    }

    next();
  }
};

const verificaCpfEmail = (req, res, next) => {
  const { cpf, email } = req.body;

  let verificar = false;

  for (const conta of contas) {
    if (conta.usuario.cpf === cpf || conta.usuario.email === email) {
      verificar = true;
    }
  }

  if (verificar) {
    res.status(400).json({
      mensagem: "Já existe uma conta com o cpf ou e-mail informado!",
    });
  }
  if (!verificar) {
    next();
  }
};

const verificarContaDelete = (req, res, next) => {
  const { numeroConta } = req.params;

  const usuario = acharConta(numeroConta);

  !usuario
    ? res.status(404).json({ mensagem: "Conta bancária não encontrada" })
    : "";

  next();
};

const buscarConta = (req, res, next) => {
  const { numero_conta } = req.body;
  const query = Object.values(req.query);
  const { numeroConta } = req.params;
  let usuario;

  if (query.length == 0) {
    if (`numeroConta` in req.params) {
      usuario = acharConta(numeroConta);

      !usuario
        ? res.status(400).json({ mensagem: "Conta bancária não encontrada" })
        : "";
      next();
      return usuario;
    } else {
      usuario = acharConta(numero_conta);

      !usuario
        ? res.status(400).json({ mensagem: "Conta bancária não encontrada" })
        : "";
      next();
      return usuario;
    }
  } else {
    usuario = acharConta(query[0]);

    !usuario
      ? res.status(400).json({ mensagem: "Conta bancária não encontrada" })
      : "";
    next();
    return usuario;
  }
  return usuario;
};

const verificarSenha = (req, res, next) => {
  const { senha, numero_conta, numero_conta_origem } = req.body;
  const query = Object.values(req.query);
  let usuarios;

  if (query.length !== 0) {
    usuarios = acharConta(query[0]);

    if ("senha_banco" in req.query) {
      if (!validarSenha(banco.senha, query[0], res)) {
        next();
      }
    } else if (!validarSenha(usuarios.usuario.senha, query[1], res)) {
      next();
    }
  }

  let verificar = false;

  if ("numero_conta_origem" in req.body) {
    usuarios = acharConta(numero_conta_origem);
    if (!validarSenha(usuarios.usuario.senha, senha, res)) {
      next();
    }
  } else if ("numero_conta" in req.body) {
    usuarios = acharConta(numero_conta);
    if (!validarSenha(usuarios.usuario.senha, senha, res)) {
      next();
    }
  }
};

const validarSenha = (senhaAtual, senhaDigitada, res) => {
  let validar = false;

  if (senhaAtual !== senhaDigitada) {
    validar = true;
    res.status(404).json({
      mensagem: "Senha incorreta. Tente novamente!",
    });
  }
  return validar;
};

const verificacaoTransferencia = (req, res, next) => {
  const { numero_conta_origem, numero_conta_destino } = req.body;

  const origem = acharConta(numero_conta_origem);
  const destino = acharConta(numero_conta_destino);

  origem === undefined
    ? res.status(400).json({ mensagem: "Conta de origem não existe" })
    : destino === undefined
    ? res.status(400).json({ mensagem: "Conta de destino não existe" })
    : next();
};

const acharConta = (numeroConta) => {
  const usuario = contas.find((conta) => {
    return conta.numero_conta === +numeroConta;
  });

  return usuario;
};

const verificarValorDeposito = (req, res, next) => {
  const deposito = Number(req.body.valor);

  let verificar = false;
  deposito <= 0
    ? ((verificar = true),
      res.status(400).json({
        mensagem: "Não é possível depositar esse valor!",
      }))
    : next();
};

module.exports = {
  verificaCpfEmail,
  verificarValores,
  verificarCampos,
  verificarContaDelete,
  buscarConta,
  verificarSenha,
  acharConta,
  verificacaoTransferencia,
  verificarValorDeposito,
};
