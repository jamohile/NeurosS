import Neuron from '../Neuron';

let n1 = new Neuron(
    {
        threshold: 0.1,
        filter: 0.1,
        stability: 0.1,
        connections: [
            {
                offset: 1,
                probability: 1,
                filter: 1
            },
            {
                offset: 3,
                probability: 1,
                filter: 1
            }
        ]

    });
let n2 = new Neuron({
    threshold: 0.2,
    filter: 0.2,
    stability: 0.2,
    connections: [
        {
            offset: 2,
            probability: 1,
            filter: 1
        }
    ]
});

console.dir(n1);
console.dir(n2);

/**
 * Test of how often "double connection" mutations occur. As expected, ~0.5%.
 */
console.dir('cross');
let dmuts = 0;
let max = 1000;
for(let i = 0; i<max;i++){
    let c  = Neuron.cross(n1, n2);
    if(c.connections.length > 2){
        console.dir(i);
        console.dir(c);
        dmuts+=1
    }
}

console.dir(dmuts);
console.dir(dmuts/max)


/**
 * Test of trigger
 */
// console.dir('trigger');
// console.dir(n.trigger(1,1));
