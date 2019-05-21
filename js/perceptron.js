function Perceptron(opts){
  if (!opts)
    opts = {}

  var debug = 'debug' in opts ? opts.debug : false;

  var weights = 'weights' in opts
    ? opts.weights.slice()
    : []

  var threshold = 'threshold' in opts
    ? opts.threshold
    : 1

  var learningrate;
  if (!('learningrate' in opts)) {
    learningrate = 0.1
  }
  else {
    learningrate = opts.learningrate
  }

  var data = []

  var api = {
    weights: weights,
    retrain: function() {
      var length = data.length
      var success = true
      for(var i=0; i<length; i++) {
        var training = data.shift()
        success = api.train(training.input, training.target) && success
        console.log(weights)
      }
      console.log(i)
      return success
    },
    train: function(inputs, expected) {
      while (weights.length < inputs.length) {
        weights.push(Math.random());
      }
      // add a bias weight for the threshold
      if (weights.length == inputs.length) {
        weights.push('bias' in opts ? opts.bias : 1)
      }

      var result = api.perceive(inputs)
      data.push({input: inputs, target: expected, prev: result})

      if (debug) console.log('> training %s, expecting: %s got: %s', inputs, expected, result)

      if (result == expected) {
        return true
      }
      else {
        if (debug) console.log('> adjusting weights...', weights, inputs);
        for(var i=0; i < weights.length; i++) {
          var input = (i == inputs.length)
            ? threshold
            : inputs[i]
          api.adjust(result, expected, input, i)
          console.log(result)
        }
        if (debug) console.log(' -> weights:', weights)
        return false
      }
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
  document.getElementById('output').innerHTML += msg + '<br/>';
  console.log(msg);
}

const orGate = document.querySelector('#orGate');
const andGate = document.querySelector('#andGate');
const norGate = document.querySelector('#norGate');
const nandGate = document.querySelector('#nandGate');

orGate.addEventListener('click', function(){
  let inputA = document.getElementById('inputA').value;
  let inputB = document.getElementById('inputB').value;
  let or = new Perceptron();

  or.train([0, 0], 0);
  or.train([0, 1], 1);
  or.train([1, 0], 1);
  or.train([1, 1], 1);

  // practice makes perfect (we hope...)
  let i = 0;
  while(i++ < 10000 && !or.retrain()) {}
  console.log(i)

  print('OR');
  print(or.perceive([inputA, inputB]));
});

andGate.addEventListener('click', function(){
  let and = new Perceptron();

  and.train([0, 0], 0);
  and.train([0, 1], 0);
  and.train([1, 0], 0);
  and.train([1, 1], 1);

  // practice makes perfect (we hope...)
  let i = 0;
  while(i++ < 10000 && !and.retrain()) {}

  print('AND');
  print(and.perceive([0, 0]));
  print(and.perceive([0, 1]));
  print(and.perceive([1, 0]));
  print(and.perceive([1, 1]));
});

norGate.addEventListener('click', function(){
  let nor = new Perceptron();

  nor.train([0, 0], 1);
  nor.train([0, 1], 0);
  nor.train([1, 0], 0);
  nor.train([1, 1], 0);

  let i = 0;
  while(i++ <10000 && !nor.retrain()) {}

  print('NOR');

  print(nor.perceive([0, 0]));
  print(nor.perceive([0, 1]));
  print(nor.perceive([1, 0]));
  print(nor.perceive([1, 1]));
});

nandGate.addEventListener('click',function(){
  let nand = new Perceptron();

  nand.train([0, 0], 1);
  nand.train([0, 1], 1);
  nand.train([1, 0], 1);
  nand.train([1, 1], 0);

  let i = 0;
  while(i++ <10000 && !nand.retrain()) {}

  print('NAND');

  print(nand.perceive([0, 1]));
  print(nand.perceive([0, 1]));
  print(nand.perceive([1, 0]));
  print(nand.perceive([1, 1]));
});
