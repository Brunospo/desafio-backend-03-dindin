const sumOfInputsOutputs = (array) => {
    let sumInputs = 0
    let sumOutputs = 0

    array.forEach(element => {
      if (element.tipo === 'entrada') {
        sumInputs += element.valor
      }

      if (element.tipo === 'saida') {
        sumOutputs += element.valor
      }
    })

    return { sumInputs, sumOutputs}
}

module.exports = {
  sumOfInputsOutputs
}