import Neuron, {randomType, Types} from '../Neuron';
import {Brain} from "../Brain";

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
        ],
        type: Types.OUTPUT

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
    ],
    type: Types.INPUT
});

// console.dir(n1);
// console.dir(n2);
//
// console.dir(Neuron.cross(n1,n2));

/**
 * Test of how often "double connection" mutations occur. As expected, ~0.5%.
 */
// console.dir('cross');
// let dmuts = 0;
// let max = 1000;
// for(let i = 0; i<max;i++){
//     let c  = Neuron.cross(n1, n2);
//     if(c.connections.length > 2){
//         console.dir(i);
//         console.dir(c);
//         dmuts+=1
//     }
// }
//
// console.dir(dmuts);
// console.dir(dmuts/max)


/**
 * Test of trigger
 */
// console.dir('trigger');
// console.dir(n.trigger(1,1));

// for(let i = 0; i< 1000; i++){
//     console.dir(randomType());
// }

/**
 * Brain testing
 */
// const b1 = new Brain({neurons:[n1]});
// const b2 = new Brain({neurons:[n2]});
//
// const iter = 1000;
// const matches = 0;
//
// for(let i = 0; i < iter; i++){
//     const b3 = Brain.cross(b1, b2);
//     if(b3.neurons[0].threshold != 0.2 && b3.neurons[0].threshold != 0.1){
//         console.dir(b3);
//     }
// }
