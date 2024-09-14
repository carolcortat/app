// olá, mundo!
//const mensagem = "olá, carol!"

//{
    //const mensagem = "olá, manu!"
    //console.log(mensagem)
//}

//console.log(mensagem);

// para rodar o código - coloco no terminal node index.js
//console significa objeto - log é uma função caixinha - as aspas é o que vc esta mandando para caixinha executar
//variavel é uma caixinha - um tipo de dado
// const é uma variavel que não pode mudar
// {} é um escopo - é local só funciona o que esta dentro das chaves

// arrays, objetos
//let metas = ["carol", "hello"]
//console.log(metas[0] + ", " + metas[1])

// let meta = {
//     value: 'ler um livro por mês',
//     address: 2,
//     checked: false,
//     log: (info) => {
//         console.log(info)
//     }
// }

// let metas = [
//     meta,
//     {
//         value: "caminhar 20 minutos todos os dias",
//         checked: false
//     }
// ]
// console.log(metas[1].value)

   
// meta.value = "não é mais ler um livro"
// meta.log(meta.value)


//function //arrow function
// const criarMeta = () => {}

// function criarMeta() {}

//return dentro da função ele acaba

// const start = () => {
//     let count = 0
//     while(count < 10){
//     console.log(count)
//     count = count + 1
//     }
// }

// start()

const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem-vindo ao app de metas";


let metas

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}


const cadastrarMeta = async () => {
    const meta = await input({ message: "Digite a meta:"})

    if(meta.length == 0) {
        mensagem = 'A meta não pode ser vazia'
        return
    }

     metas.push(
        { value: meta, checked: false}
    )

    mensagem = "Meta cadastrada com sucesso"
}


const listarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar",
        choices: [...metas],
        instructions: false,
    })

metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!"
        return
    }

    

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })

    mensagem = 'Meta(s) marcada(s) como concluída(s)'

}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
    mensagem = 'Não existe metas realizadas!'
    return
    }

    await select({
        message: "Metas Realizadas" + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {

    if(metas.length == 0) {
        mensagem = "Não existem metas!"
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
        // != diferente
    })
    if(abertas.length == 0) {
        mensagem = 'Não existem metas abertas!'
        return
    }

    await select({
        message: "Metas Abertas" + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {


    if(metas.length == 0) {
        menssagem = "Não existem metas!"
        return
    }
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })
     const itensADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itensADeletar.length == 0) {
    mensagem = 'Nenhum item para deletar'
    return
    }

    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = 'Meta(s) deletada(s) com sucesso'
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}


const start = async () => {
   await carregarMetas() 

   while(true){
    // let opcao = "sair"
    mostrarMensagem()
    await salvarMetas()

    const opcao = await select({
        message: "Menu >",
        choices: [
            {
                name: "Cadastrar meta",
                value: "cadastrar"

            },
            {
                name: "Listar metas",
                value: "listar"   
            },
             {
                name: "Metas realizadas",
                value: "realizadas"   
            },
             {
                name: "Metas abertas",
                value: "abertas"   
            },
            {
                name: "Deletar metas",
                value: "deletar"   
            },
            {
                name: "Sair",
                value: "sair"
 
            }
        ]
    })

    switch(opcao){
        case "cadastrar":
            await cadastrarMeta()
            break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                    console.log("Até a próxima!")
                    return

    }
    }
 }

 start()

