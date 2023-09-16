<h1>DigitalBank :moneybag: </h1>
  
<p align="center">


  <img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=for-the-badge&logo=JavaScript&logoColor=black"/>
  <img src="https://img.shields.io/badge/Node.js-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
</p>

> Status do Projeto: Concluído :heavy_check_mark: 

### Tópicos 

:small_blue_diamond: [Descrição do projeto](#descrição-do-projeto)

:small_blue_diamond: [Pré-requisitos](#pré-requisitos)

:small_blue_diamond: [Como rodar a aplicação](#como-rodar-a-aplicação-arrow_forward)

:small_blue_diamond: [Funcionalidades](#funcionalidades)
    :small_blue_diamond:[Criar Uma conta](#CriarConta)
## Descrição do projeto

<P align="justify">Esta Api simula funcionalidades básicas de um banco. Com ela você poderá criar uma conta bancária, fazer depósitos, saques, trasnsferências entre outras funcinalidades.</P>

...

## Pré-requisitos

:warning: [Node](https://nodejs.org/en/download/)

...

## Como rodar a aplicação :arrow_forward:

No terminal, clone o projeto: 

```
git clone git@github.com:amorimleon/digitalBank.git
```

No terminal do VsCode, Instale o Express:

```
npm install express
```

Para executar o express use o seguinte comando:
```
npm run dev
```
## Funcionalidades
### :pushpin: **Criar Uma conta:**

🔗 Rota
```
http://localhost:8000/contas
```
Body:
```
{
"nome": "nomeUsuario",
"cpf":"cpfUsuario",
"data_nascimento":"aaaa-mm-dd",
"telefone": "999999999",
"email":"usuario@mail.com",
"senha": "senhaUsuario"
}
```

### :pushpin: **Depositar:**

🔗 Rota
```
http://localhost:8000/transacoes/depositar
```
Body:
```
{
"numero_conta": "1", 
"valor": "2000"
}
```

### :pushpin: **Sacar:**

🔗 Rota
```
http://localhost:8000/transacoes/sacar
```
Body:
```
{
"numero_conta": "2",
"valor": "5000",
"senha": "123456"
}
```

### :pushpin: **Transferir:**

🔗 Rota
```
http://localhost:8000/transacoes/transferir
```
Body:
```
{ 
"numero_conta_origem": "1",
"numero_conta_destino": "2",
"valor": "500",
"senha": "123456"
}
```

### :pushpin: **Extrato:**

🔗 Rota
```
http://localhost:8000//contas/extrato?numero_conta=1&senha=123456
```
