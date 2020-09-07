# object-diff

Object diff

de:

``` json
{
  "id": 1,
  "nome": "Fulano da silva",
  "empresa": {
    "id": 1,
    "nome": "Algum lugar",
    "cnpj": "12345678910"
  },
  "permissoes": [
    {
      "id": 1,
      "nome": "ADMINISTRADOR"
    },
    {
      "id": 2,
      "nome": "USUARIO"
    }
  ]
}
```

para:

``` json
{
  "id": 1,
  "nome": "Fulano",
  "empresa": {
    "id": 2,
    "nome": "Outro lugar",
    "cnpj": "10987654321"
  },
  "permissoes": [
    {
      "id": 1,
      "nome": "SUPER_USER"
    },
    {
      "id": 4,
      "nome": "PROGRAMADOR"
    }
  ]
}
```

**diff**

``` json
[
    {
        "key": "nome",
        "from": "Fulano da silva",
        "to": "Fulano"
    },
    {
        "key": "empresa",
        "type": "EDITADO",
        "details": [
            {
                "key": "nome",
                "from": "Algum lugar",
                "to": "Outro lugar"
            },
            {
                "key": "cnpj",
                "from": "12345678910",
                "to": "10987654321"
            }
        ]
    },
    {
        "key": "permissoes",
        "type": "LISTA",
        "details": [
            {
                "key": "ADMINISTRADOR",
                "type": "EDITADO",
                "details": [
                    {
                        "key": "nome",
                        "from": "ADMINISTRADOR",
                        "to": "SUPER_USER"
                    }
                ]
            },
            {
                "key": "USUARIO",
                "type": "NOVO",
                "details": [
                    {
                        "key": "nome",
                        "from": null,
                        "to": "USUARIO"
                    }
                ]
            },
            {
                "key": "PROGRAMADOR",
                "type": "REMOVIDO",
                "details": [
                    {
                        "key": "nome",
                        "from": "PROGRAMADOR",
                        "to": null
                    }
                ]
            }
        ]
    }
]
```
