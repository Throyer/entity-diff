# Entity diff

Entity diff generator.

How to use:
``` typescript

import { Audit } from "entity-diff";

const audit = new Audit();

const before = {
  name: "Lucas Oliveira",
  age: 20
}

const after = {
  name: "Lucas",
  age: 20
}

const result = audit.diff(before, after);

// result:
// [
//   {
//     key: "name",
//     from: "Lucas Oliveira",
//     to: "Lucas"
//   }
// ]

```


Audit Options:
``` typescript

import { Audit } from "entity-diff";

const audit = new Audit(
  ["id"],             // ignore: list with ignored properties (optional)

  [                   // options: custom diff options for especific properties (optional)
    {                 
      key:            // key name (required)
      title:          // name displayed in diff (optional)
      customFormater: // function to customize the rendering of the `from` and `to` (optional)

      arrayOptions: { // arrayOptions: diff array options (optional)
        key:          // used to search for the object in the other array (required)
        name:         // property with the name displayed in the diff (optional)    
      }
    }
  ]
);

const before = {
  id: 1,
  nome: "Fulano da silva",
  empresa: {
      id: 1,
      nome: "Algum lugar",
      cnpj: "12345678910"
  },
  permissoes: [
    {
      id: 1,
      nome: "ADMINISTRADOR"
    },
    {
      id: 2,
      nome: "USUARIO"
    }
  ]
};

const after = {
  id: 1,
  nome: "Fulano",
  empresa: {
    id: 2,
    nome: "Outro lugar",
    cnpj: "10987654321"
  },
  permissoes: [
    {
      id: 1,
      nome: "SUPER_USER"
    },
    {
      id: 4,
      nome: "PROGRAMADOR"
    }
  ]
};

const diffs = audit.diff(before, after);
```

**diffs**

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
        "key": "PROGRAMADOR",
        "type": "NOVO",
        "details": [
          {
            "key": "nome",
            "from": null,
            "to": "PROGRAMADOR"
          }
        ]
      },
      {
        "key": "USUARIO",
        "type": "REMOVIDO",
        "details": [
          {
            "key": "nome",
            "from": "USUARIO",
            "to": null
          }
        ]
      },
    ]
  }
]
```
