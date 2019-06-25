
function Perceptron(opts){
  //opts es un parámetro del perceptrón donde se van guardando
  //todas las variables y métodos
  if (!opts)//si el opts está vacio entonces se declara como un objeto abierto
    opts = {}
  //si el debug está activado entonces en la consola aparecerá el paso a paso
  var debug = 'debug' in opts ? opts.debug : false;
  //declaro la variable que contará las iteraciones más adeante  
  var iter = 0
  //si dentro del opts están declarados los pesos entonces se extraen para la variable de los pesos
  // si no, los pesos se declara como un arreglo vacio
  var weights = 'weights' in opts ? opts.weights.slice() : []
  //Si los inputs stán delcaradon dentro del opts entonces se toman y se almacenan en la variable
  //si no entonces se declara como un arreglo vacio
  var inputs = 'inputs' in opts ? opts.inputs : []
  //Si hay un valor limite en opts entonces lo deja como está y si o le asigna 1
  //es usado para pasarlo por la función de activación y determinar se la neurona funciona
  var threshold = 'threshold' in opts
    ? opts.threshold
    : 1
  //Asigna un valor para la el cosficiente de aprendizaje de forma automatica
  var learningrate;
  if (!('learningrate' in opts)) {
    learningrate = Math.random();
  }
  else {
    learningrate = opts.learningrate
  }

  var data = []

  //declaración de la api que contiene todas las variables y metodos que se
  //utilizan en el "aprendizaje" la neurona
  var api = {
    weights: weights,
    retrain: function(iter) {
      var length = data.length
      var success = true
      for(var i=0; i<length; i++) {
        var training = data[i]
        success = api.train(training.input, training.target, iter) && success
        if(!success){
          return success
        }
      }
      return success
    },
    train: function(inputs, expected, iter) {
      var rows = document.querySelector("#rows");
      while (weights.length < inputs.length) {
        //pesos aleatorios
        weights.push(Math.random());
      }
      // agregar el peso del bias para el limite
      if (weights.length == inputs.length) {
        weights.push('bias' in opts ? opts.bias : 1);
      }
      
      var result = api.perceive(inputs)
      
      let error = expected - result;
      let Y = 0;
      
      for (var i = 0; i < inputs.length; i++) {
        Y += inputs[i]*weights[i]
      }

      Y -= weights.slice(-1);
      let delta = []
      for (var i = 0; i < inputs.length; i++) {
        delta.push((learningrate*error*inputs[i]))
      }
      
      if (iter == undefined){
        iter=0;
      }

      rows.innerHTML += "<tr><td>"+ iter + "</td><td>" + inputs + "</td><td>" + weights.slice(0,-1) + "</td><td>" + weights.slice(-1) + "</td><td>" + expected + "</td><td>" + Y + "</td><td>" + result + "</td><td>" + learningrate + "</td><td>" + error + "</td><td>" + delta + "</td></tr>"
      
      if (result == expected) {
        return true
      }
      else {
        //if (debug) console.log('> ajunstando pesos...', weights, inputs);
        for(var i=0; i < weights.length; i++) {
          var input = (i == inputs.length)
            ? threshold
            : inputs[i]
          api.adjust(result, expected, input, i)
        }
        return false;
      }

    },

    setData: function(inputs,target,expected){
      data.push({input: inputs, target: target, prev: expected});
    },

    adjust: function(result, expected, input, index) {
      var d = api.delta(result, expected, input, learningrate);
      weights[index] += d;
      if (isNaN(weights[index])) throw new Error('weights['+index+'] went to NaN!!')
    },

    delta: function(actual, expected, input, learnrate) {
      return (expected - actual) * learnrate * input
    },

    perceive: function(inputs, net, activationFunc) {
      var result = 0
      for(var i=0; i<inputs.length; i++) {
        result += inputs[i] * weights[i]
      }
      result += threshold * weights[weights.length - 1];

      // Set the activation function to sigmoid, hardside, or a custom formula.
      activationFunc = activationFunc || ((x) => { return Number(this.sigmoid(x) >= 0.5) });
      //activationFunc = activationFunc || ((x) => { return this.sigmoid(x) });
      //activationFunc = activationFunc || ((x) => { return Number(this.hardside(x) > 0) });

      // Finally, pass the result through an activation function to determine if the neuron fires.
      return activationFunc ? activationFunc(result) : (net ? result : (result > 0 ? 1 : 0));
    },
    
    sigmoid: function(t) {
    	return 1/(1+Math.pow(Math.E, -t));
    },
    
    hardside: function(t) {
    	return t;
    }
  }

  return api;
}

var print = function(msg) {
  document.getElementById('output').innerHTML = msg + '<br/>';
}

const orGate = document.querySelector('#orGate');
const andGate = document.querySelector('#andGate');
const norGate = document.querySelector('#norGate');
const andGate3 = document.querySelector('#andGate3');
const nandGate = document.querySelector('#nandGate');

try{
  const trainOrGate = document.querySelector('#trainOrGate'); 
  var or = new Perceptron();

  trainOrGate.addEventListener('click',function(){

    var rt = document.querySelector("#retrain");
    rt.innerHTML = "<a href='orGate.html' class='btn btn-warning my-2'>Reentrenar compuerta OR</a>"
    
    or.setData([0, 0], 0, 0);
    or.setData([0, 1], 1, 1);
    or.setData([1, 0], 1, 1);
    or.setData([1, 1], 1, 1);

    // practice makes perfect (we hope...)
    var i = 0;
    while(i++ < 10000 && !or.retrain(i)) {}
    })  

    orGate.addEventListener('click', function(){
    var x1 = document.getElementById('x1').value;
    var x2 = document.getElementById('x2').value;
    print(or.perceive([x1, x2]));

  });
}catch(error){
  console.error("no orGate");
}

try{
  const trainAndGate = document.querySelector('#trainAndGate');
  var and = new Perceptron();
  trainAndGate.addEventListener('click',function(){

    var rt = document.querySelector("#retrain");
    rt.innerHTML = "<a href='andGate.html' class='btn btn-warning my-2'>Reentrenar compuerta AND</a>"
    and.setData([0, 0], 0, 0);
    and.setData([0, 1], 0, 0);
    and.setData([1, 0], 0, 0);
    and.setData([1, 1], 1, 1);

    // practice makes perfect (we hope...)
    var i = 0;
    while(i++ < 10000 && !and.retrain(i)) {}
    console.log(i)
  })  

  andGate.addEventListener('click', function(){
    var x1 = document.getElementById('x1').value;
    var x2 = document.getElementById('x2').value;
    print(and.perceive([x1, x2]));

  });
}catch(error){
  console.error("no and gate")
}

try{
  const trainNorGate = document.querySelector('#trainNorGate');
  var nor = new Perceptron();
  trainNorGate.addEventListener('click',function(){

    var rt = document.querySelector("#retrain");
    rt.innerHTML = "<a href='norGate.html' class='btn btn-warning my-2'>Reentrenar compuerta NOR</a>"
    nor.setData([0, 0], 1, 1);
    nor.setData([0, 1], 0, 0);
    nor.setData([1, 0], 0, 0);
    nor.setData([1, 1], 0, 0);

    // practice makes perfect (we hope...)
    var i = 0;
    while(i++ < 10000 && !nor.retrain(i)) {}
  });

  norGate.addEventListener('click', function(){
    var x1 = document.getElementById('x1').value;
    var x2 = document.getElementById('x2').value;
    print(nor.perceive([x1, x2]));

  });
}catch(error){
  console.error("no nor gate")
}

try{
  const trainNandGate = document.querySelector('#trainNandGate');
  var nand = new Perceptron();
  trainNandGate.addEventListener('click',function(){

    var rt = document.querySelector("#retrain");
    rt.innerHTML = "<a href='nandGate.html' class='btn btn-warning my-2'>Reentrenar compuerta NAND</a>"
    nand.setData([0, 0], 1, 1);
    nand.setData([0, 1], 1, 1);
    nand.setData([1, 0], 1, 1);
    nand.setData([1, 1], 0, 0);

    // practice makes perfect (we hope...)
    var i = 0;
    while(i++ < 10000 && !nand.retrain(i)) {}
    console.log(i)
  });

  nandGate.addEventListener('click', function(){
    var x1 = document.getElementById('x1').value;
    var x2 = document.getElementById('x2').value;
    print(nand.perceive([x1, x2]));

  });
}catch(error){
  console.error("no nand gate")
}

try{
  const trainAndGate3 = document.querySelector('#trainAndGate3');
  var and3 = new Perceptron();

  trainAndGate3.addEventListener('click',function(){

    var rt = document.querySelector("#retrain");
    
    rt.innerHTML = "<a href='andGate3.html' class='btn btn-warning my-2'>Reentrenar compuerta NAND</a>"
    

    and3.setData([0, 0, 0], 0, 0);
    and3.setData([0, 0, 1], 0, 0);
    and3.setData([0, 1, 0], 0, 0);
    and3.setData([0, 1, 1], 0, 0);
    and3.setData([1, 0, 0], 0, 0);
    and3.setData([1, 0, 1], 0, 0);
    and3.setData([1, 1, 0], 0, 0);
    and3.setData([1, 1, 1], 1, 1);

    // practice makes perfect (we hope...)
    var i = 0;
    while(i++ < 10000 && !and3.retrain(i)) {}
    console.log(i)
  });

  andGate3.addEventListener('click', function(){
    var x1 = document.getElementById('x1').value;
    var x2 = document.getElementById('x2').value;
    var x3 = document.getElementById('x3').value;
    print(and3.perceive([x1, x2, x3]));
  });
}catch(error){
  console.error("no and gate for 3 inputs")
}