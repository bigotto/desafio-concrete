# Desafio Concrete Solutions

É necessário ter uma instância de MongoDB em execução na máquina local para execução dos scripts de desenvolvimento e de testes.
```
npm run dev
```
e 
```
npm run test
```

A aplicação encontra-se hospedada no [Heroku](https://bruno-bigotto-concrete.herokuapp.com).

## Detalhamento de rotas 
### Sign Up
* /signup

    Método: POST
    
    Parâmetros: 
    ```
    {
        "nome": "string",
        "email": "string",
        "senha": "senha",
        "telefones": [{
        "numero": "123456789",
        "ddd": "11"
        }]
    }
    ```

### Sign In
* /signin

    Método: POST

    Parâmetros: 
    ```
    {
        "email": "string",
        "senha": "senha",
    }
    ```

### Buscar
* /search

    Método: GET
    
    Autenticação: "Bearer {token}"